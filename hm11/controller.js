var Model = require('./model.js'),
    View = require('./view.js');

module.exports = {
    musicRoute: function() {
        return Model.getMusic().then(function(music) {
            results.innerHTML = View.render('music', {list: music});
        });
    },
    friendsRoute: function() {
        return Model.getFriends().then(function(friends) {
            results.innerHTML = View.render('friends', {list: friends});
        });
    },
    newsRoute: function() {
        return Model.getNews().then(function(news) {
            results.innerHTML = View.render('news', {list: news.items});
        });
    },
    groupsRoute: function() {
        return Model.getGroups().then(function(groups) {
            results.innerHTML = View.render('groups', {list: groups.items});
        });
    },
    photosRoute: function() {
        return Model.getPhotos().then(function(photos) {
            results.innerHTML = View.render('photos', {list: photos.items});            
        });
    },
    commentsRoute: function(photo_id) {
        return Model.getComments(photo_id).then(function(comments) {
            var pasteIn = 'showComments' + photo_id, 
                element = document.getElementById(pasteIn);
            element.innerHTML = View.render('comments', {list: comments});      
        });
    },
    sortphotosRoute: function(){
        var selectValue = document.getElementById('photosTemplate-sort').value;
        return Model.getPhotos().then(function(photos) {

            if( selectValue != 0){
                photos.items.sort(function(obj1, obj2){
                    return obj2[selectValue].count - obj1[selectValue].count;
                });
            }
            
            results.innerHTML = View.render('photos', {list: photos.items});      
        });
   }
};
