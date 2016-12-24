var Controller = require('./controller.js');

module.exports = {
    handle: function(route) {
        var routeName = route + 'Route';

        Controller[routeName]();
    },
    handleComments: function(route, photo_id) {
        var routeName = route + 'Route';

        Controller[routeName](photo_id);
    }
};
