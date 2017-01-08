const {Object, User, Query} = require('../../vendor/leancloud-storage');

Page({
  data: {
    objectId: null,
    title: '',
    newBookTitle: '',
    books: []
  },

  onLoad: function(options) {
    console.log(options)
    if (options && options.id) {
      new Query('BookList').get(options.id).then( booklist => {
        this.setData({
          objectId: booklist.id,
          title: booklist.get('title'),
          books: booklist.get('books')
        });
      }).catch(console.error);
    }
  },

  onTitleEdited: function({detail: {value}}) {
    this.setData({
      title: value
    });
  },

  onRemoveBook: function({target: {dataset: {name}}}) {
    this.setData({
      books: this.data.books.filter( bookName => {
        return bookName !== name;
      })
    });
  },

  onNewBookEdited: function({detail: {value}}) {
    this.setData({
      newBookTitle: value
    });
  },

  onNewBookAdd: function() {
    this.setData({
      books: this.data.books.concat(this.data.newBookTitle),
      newBookTitle: ''
    });
  },

  onSubmit: function() {
    if (!this.data.objectId) {
      new Object('BookList').save({
        title: this.data.title,
        books: this.data.books,
        author: User.current()
      }).then( () => {
        wx.navigateTo({
          url: '../index/index',
        });
      }).catch(console.error);
    } else {
      Object.createWithoutData('BookList', this.data.objectId).save({
        title: this.data.title,
        books: this.data.books
      }).then( () => {
        wx.navigateTo({
          url: '../index/index',
        });
      }).catch( err => {
        wx.showToast({
          title: err.message,
          icon: 'success',
        });
      });
    }
  }
});