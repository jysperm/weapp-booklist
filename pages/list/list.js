const {Object, User, Query} = require('../../vendor/leancloud-storage');

Page({
  data: {
    objectId: null,
    title: '',
    newBookTitle: '',
    books: ['book1']
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

    }
  }
});