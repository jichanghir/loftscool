new Promise(function(resolve){
  if (document.readyState == 'complete') {
    resolve();
  }
  else{
    window.onload = resolve;
  }
})
.then(function(){
  return new Promise(function(resolve, reject){

    VK.init({
      apiId: 5765130
    });

    VK.Auth.login(function(response){
      if (response.status == 'connected') {
        resolve();
      } 
      else {
        reject();
      }
    }, 2);

  });
})
.then(
  function(){
    return new Promise(function(resolve, reject){

      VK.Api.call('users.get', {'name_case': 'gen'}, function(response){
        if( response.error ){
          reject( new Error(response.error.error_msg) );
        }
        else {
          let userData = response.response[0];
          titleH1.textContent = `Друзья ${userData.first_name} ${userData.last_name}`;
          resolve();
        }
      });

    });
  },
  function(){
    reject( new Error( 'Не удалось подключится' ) );
  }
)
.then(
  function(){

    VK.Api.call('friends.get', {fields: 'bdate,photo_50'}, function(response){
      if( response.error ){
        reject( new Error(response.error.error_msg) );
      }
      else {
        var resultMass = []; 

        //console.log( response.response.length );

        for( var i = 0; i < response.response.length; i++ ){

          var birthday = new Date(),
              birthdayDate = null,
              birthdayMonth = null,
              birthdayNormDate = null,
              nowDate = new Date().getDay(),
              nowMonth = new Date().getMonth(),
              age = null,
              dataDate = response.response[i].bdate;

          //console.log('response.response[i]', response.response[i]);

          // Если дата рождения была указана
          //debugger;
          if( response.response[i].bdate != undefined ){
            // приводим дату к нормальному виду
            dataDate = dataDate.replace(/\./gi, "-"); 
            dataDate = dataDate.replace(/(\d+)-(\d+)-(\d+)/, '$2/$1/$3');
            birthday.setTime(Date.parse(dataDate));

            // Если дата рождения была указана в нормально виде, то получаем возраст
            if ( birthday != 'Invalid Date' ) {
              // Получаем год рождения
              var birthdayYear = birthday.getFullYear();

              // Получаем текущий год
              var nowYear = new Date().getFullYear();

              // Определеям возраст
              age = nowYear - birthdayYear;

              birthdayDate = birthday.getDate();
              birthdayMonth = birthday.getMonth();
              birthdayNormDate = birthday;
            }
          }
          

          resultMass[i] = 
          {
            'first_name' : response.response[i].first_name,
            'last_name' : response.response[i].last_name,
            'bdate' : response.response[i].bdate,
            'photo_50' : response.response[i].photo_50,
            'age' : age,
            'birthdayDay' : birthdayDate,
            'birthdayMonth' : birthdayMonth,
            'birthdayNormDate' : birthdayNormDate
          }
        }

        console.log('resultMass', resultMass);

        resultMass.sort(function(obj1, obj2) {
          if( !obj1.birthdayNormDate ) return 1;
          if( !obj2.birthdayNormDate ) return -1;       
          return 0;
        });

        console.log('resultMass', resultMass);


        let source = friends.innerHTML;
        let templateFn = Handlebars.compile(source);
        let template = templateFn({ list: resultMass });

        showFriends.innerHTML = template;
      }
    });

  }
)
.catch(function(e){
  console.log( e.message );
});




  