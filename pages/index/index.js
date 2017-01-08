const {User, Query, Promise} = require('../../vendor/leancloud-storage');

Page({
  data: {
    currentUser: null,
    booklists: []
  },

  onLoad: function() {
    this.setData({
      currentUser: getApp().currentUser
    });

    new Query('BookList').descending('updatedAt').include('author').find().then( booklists => {
      booklists.forEach( booklist => {
        booklist.set('author', booklist.get('author').attributes);
      });

      this.setData({booklists});
    }).catch(console.error);
  },

  onLogin: function() {
    User.loginWithWeapp().then( currentUser => {
      getApp().currentUser = currentUser;

      return this.updateUserInfo(currentUser).then( currentUser => {
        this.setData({currentUser});
      });
    }).catch(console.error);
  },

  onEditList: function({target: {dataset: {id}}}) {
    wx.navigateTo({
      url: `../list/list?id=${id}`,
    });
  },

  onCreateList: function() {
    wx.navigateTo({
      url: '../list/list',
    });
  },

  updateUserInfo: function(currentUser) {
    return new Promise( (resolve, reject) => {
      wx.getUserInfo({
        success: function({userInfo}) {
          currentUser.set('nickName', userInfo.nickName);
          currentUser.set('avatarUrl', userInfo.avatarUrl);
          return currentUser.save().then(resolve, reject);
        },
        fail: reject
      })
    });
  }
});
