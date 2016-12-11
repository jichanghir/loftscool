
var leftArray = [],
    rightArray = [],
    dragSrcEl = null,
    currentUl = null;

new Promise(
  // ждем загрузки документа
  function(resolve){  
  if (document.readyState == 'complete') {
    resolve();
  }
  else{
    window.onload = resolve;
  }
})
.then(
  // Конектимся к VK api
  function(){
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
  // Через vk api получаем список друзей
  // или если уже сохранены в localStorage то выводим из localStorage
  function(){
    return new Promise(function(resolve){

      if( localStorage.leftList == undefined ){

        VK.Api.call('friends.get', {fields: 'photo_50'}, function(response){
          if( response.error ){
            new Error(response.error.error_msg);
          }
          else {

            for( var i = 0; i < response.response.length; i++ ){

              leftArray[i] = 
              {
                'fio' : response.response[i].first_name + ' ' + response.response[i].last_name,
                'photo_style' : 'background-image: url(' + response.response[i].photo_50 + ');'
              }
            }

            showResult( leftArray, leftUlFriends );
            resolve();

          }
        });
      }
      else{
        leftArray = eval( localStorage.leftList );
        rightArray = eval( localStorage.rightList );
        
        showResult( leftArray, leftUlFriends );
        showResult( rightArray, rightUlFriends );
        resolve();
      }

    });

  },
  // Ошибка если не получилось подключиться к VK api
  function(){
    new Error( 'Не удалось подключиться' );
  }
)
.then(
  // вешаем обработики на перемещение
  function(){
    leftUlFriends.addEventListener('click', addToRightBlock);
    rightUlFriends.addEventListener('click', addToLeftBlock);
  }
)
.catch(function(e){
  console.log( e.message );
});


// вывод элементов

function showResult(mass, side){
  let source = friendsList.innerHTML;
  let templateFn = Handlebars.compile(source);
  let template = templateFn({ list: mass });

  side.innerHTML = template;
}

function filterLeft(e){
  var resultMass = leftArray.filter(function(obj){       
    let regExpStr = new RegExp( e.target.value, 'i'),
        str = obj.fio, 
        rez = str.search( regExpStr ) != -1; 

    return rez;
  }); 
  showResult( resultMass, leftUlFriends );
}

function filterRight(e){
  var resultMass = rightArray.filter(function(obj){       
    let regExpStr = new RegExp( e.target.value, 'i'),
        str = obj.fio, 
        rez = str.search( regExpStr ) != -1; 

    return rez;
  }); 
  showResult( resultMass, rightUlFriends );
}

leftSearchInput.addEventListener('input', filterLeft);
rightSearchInput.addEventListener('input', filterRight);

// -end- вывод элементов


// drug n drop

function dragStart(ev) {
   ev.dataTransfer.effectAllowed='move';
   ev.dataTransfer.setData('text/html', ev.target.innerHTML );  
   dragSrcEl = ev.target; 
   currentUl = ev.target.closest('.friendsInList');
   return true;
}
function dragEnter(ev) {
   ev.preventDefault();
   return true;
}
function dragOver(ev) {
    ev.preventDefault();
}
function dragDrop(ev) {
  if( currentUl !== ev.target.closest('.friendsInList') ){
    var data = ev.dataTransfer.getData('text/html');
    ev.target.closest('.friendsInList').appendChild(dragSrcEl);

    // обновляем левый и правый массивы
    if(ev.target.closest('#rightUlFriends')) fromLeftArrayToRightArray( dragSrcEl );
    if(ev.target.closest('#leftUlFriends')) fromRightArrayToLeftArray( dragSrcEl );    
  }

  ev.stopPropagation();
  return false;
}

// -end- drug n drop


// перемещение элементов 

function addToRightBlock(e){
  if( e.target.classList.contains('add-user') ){

    var li = e.target.closest('li');

    li.remove();
    rightUlFriends.appendChild(li);

    fromLeftArrayToRightArray( li );

  }
}

function addToLeftBlock(e){
  if( e.target.classList.contains('add-user') ){

    var li = e.target.closest('li');

    li.remove();
    leftUlFriends.appendChild(li);

    fromRightArrayToLeftArray( li );

  }
}

// Обновлем левый массив
function fromLeftArrayToRightArray( element ){
  leftArray = leftArray.filter(function(obj){   
    if( obj.fio.trim() !== element.querySelector('.fio-user').innerHTML.trim() ) return true;
    else {
      rightArray.push({
        'fio' : obj.fio,
        'photo_style' : obj.photo_style
      });
    }
  });
}

// Обновлем правый массив
function fromRightArrayToLeftArray( element ){
  rightArray = rightArray.filter(function(obj){   
    if( obj.fio.trim() !== element.querySelector('.fio-user').innerHTML.trim() ) return true;
    else {
      leftArray.push({
        'fio' : obj.fio,
        'photo_style' : obj.photo_style
      });
    }
  });
}

// -end- перемещение элементов 

// сохранение в localStorage

  saveLists.addEventListener('click', function(){

    // приводим массивы к строке
    var strLeft = '[';
    leftArray.forEach(function(element){
      strLeft += '{"fio":"' + element.fio + '","photo_style":"' + element.photo_style + '"},';
    });
    strLeft += ']';

    var strRight = '[';
    rightArray.forEach(function(element){
      strRight += '{"fio":"' + element.fio + '","photo_style":"' + element.photo_style + '"},';
    });
    strRight += ']';

    // записываем в localStorage
    localStorage.leftList = strLeft;
    localStorage.rightList = strRight;

    alert( 'Сохранено' );

  });

// -end- сохранение в localStorage


  