module.exports = {
    login: function(appId, perms) {
        return new Promise(function(resolve, reject) {
            VK.init({
                apiId: appId
            });

            VK.Auth.getLoginStatus(function(response) {
                if (response.session) {
                    resolve(response);
                }
                else { 
                    VK.Auth.login(function(response) {
                        if (response.session) {
                            resolve(response);
                        } else {
                            reject(new Error('Не удалось авторизоваться'));
                        }
                    }, perms);
                }
            });   
                     
        });
    },
    callApi: function(method, params) {
        return new Promise(function(resolve, reject) {
            VK.api(method, params, function(response) {

                if (response.error) {
                    reject(new Error(response.error.error_msg));
                } else {
                    resolve(response.response);
                }


            });

        });
    },
    getUser: function() {
        return this.callApi('users.get', {});
    },
    getMusic: function() {
        return this.callApi('audio.get', {});
    },
    getFriends: function() {
        return this.callApi('friends.get', { fields: 'photo_100' });
    },
    getNews: function() {
        return this.callApi('newsfeed.get', { filters: 'post', count: 20 });
    },
    getGroups: function() {
        return this.callApi('groups.get', { extended: 1, v: '5.60' });
    },
    getPhotos : function() {
        return this.callApi('photos.get', { album_id: 'profile', extended: 1, v: '5.60' });
    },
    getComments: function(photo_id) {
        return this.callApi('photos.getComments', { photo_id: photo_id, extended: 1, v: '5.60' })
        .then(function(response){
            return new Promise(function(resolve){

                var result = [],
                i = 0;
                response.items.forEach(function(element){
                    result[i] = {};
                    result[i].text = element.text;

                    // если есть коменты от пользователей
                    if( response.profiles.length > 0 ){
                        for( var j = 0; j < response.profiles.length; j++){

                            if( response.profiles[j].id === element.from_id ) {

                                result[i].first_name = response.profiles[j].first_name;
                                result[i].last_name = response.profiles[j].last_name;
                                result[i].photo_50 = response.profiles[j].photo_50;
                                break;

                            }

                        }
                    }

                    // если есть коменты от сообществ
                    if( response.groups.length > 0 ){
                        for( var j = 0; j < response.groups.length; j++){

                            if( response.groups[j].id === element.from_id ) {

                                result[i].first_name = response.groups[j].first_name;
                                result[i].last_name = response.groups[j].last_name;
                                result[i].photo_50 = response.groups[j].photo_50;
                                break;

                            }

                        }
                    }
                    i++;                
                });

                resolve( result );

            });
            
        });   
    }

};
