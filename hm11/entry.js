var Model = require('./model.js'),
    View = require('./view.js'),
    Router = require('./router.js');

Handlebars.registerHelper('formatTime', function(time) {
    var minutes = parseInt(time / 60),
        seconds = time - minutes * 60;

    minutes = minutes.toString().length === 1 ? '0' + minutes : minutes;
    seconds = seconds.toString().length === 1 ? '0' + seconds : seconds;

    return minutes + ':' + seconds;
});

Handlebars.registerHelper('formatDate', function(ts) {
    return new Date(ts * 1000).toLocaleString();
});

new Promise(function(resolve) {
    window.onload = resolve;
}).then(function() {
    return Model.login(5765130, 2 | 4 | 8 | 8192 | 262144);
}).then(function() {
    return Model.getUser().then(function(users) {
        header.innerHTML = View.render('header', users[0]);
    });
}).then(function() {

    document.addEventListener('click', function(e){
        var route = e.target.dataset.route;
        if( route ){
            if( route === 'comments'){
                var client_id = e.target.getAttribute('data-routeCommentsId');
                Router.handleComments(route, client_id);
                
            }
            else Router.handle(route);           
        }
    });

    // var sortPhotosElement = document.getElementById('photosTemplate-sort');
    // sortPhotosElement.addEventListener('change', function(){
    //     Router.handle('sortphotos');
    // });

}).catch(function(e) {
    console.error(e);
    alert('Ошибка: ' + e.message);
});


// entry
// -- model
// -- view
// -- router
// ---- controller
// ------ model
// ------ view
// router
// -- controller
// controller
// -- model
// -- view
// model
// view