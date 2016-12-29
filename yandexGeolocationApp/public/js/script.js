(function(){

	var myMap,
			BalloonContentLayout;

			new Promise(
				function(resolve){
					if(document.readyState == 'complete'){
						resolve();
					}
					else{
						window.onload = resolve;
					}
				}
			)
			.then(
				function(){
					return new Promise(function(resolve){

						function init () {
							myMap = new ymaps.Map('map', {
								center: [55.650625, 37.62708],
								zoom: 10
							}, {
								searchControlProvider: 'yandex#search'
							}),
							counter = 0,

							BalloonLayout = ymaps.templateLayoutFactory.createClass(
								'<div class="ballon">' 																											+
									'<div class="ballon-header">' 																						+
										'<a href="" class="ballon-header-close">' 															+
											'<img src="./images/ballon-close.png" alt="" />' 											+
										'</a>' 																																	+
										'<div class="ballon-header-adress">{{properties.balloonHeader}}</div>' 	+
									'</div>' 																																	+
									'<div class="ballon-content">' 																						+	 
										'$[[options.contentLayout]]' 																						+
									'</div>' 																																	+
								'</div>', 
								{
									build: function () {
										this.constructor.superclass.build.call(this);

										this._$element = $('.ballon', this.getParentElement());

										this._$element.find('.ballon-header-close').on('click', $.proxy(this.onCloseClick, this));
									},
									onCloseClick: function (e) {
										e.preventDefault();

										this.events.fire('userclose');
									}
								}),

							MyBalloonContentLayout = ymaps.templateLayoutFactory.createClass(
					     '$[properties.comments]'
					    );

							resolve();
						}
				
						ymaps.ready(init);

					});
				}
			)
			.then(
				function(){
					var map = document.getElementById('map'),
							placemarks = [],
							comments = '',
							clasterComments = '',
							element,
							coordsElement = [];


//===================================
					// получение шаблона с комментариями
					function renderComments(commentsMass, template) {

						var templateElement = document.getElementById(template),
								templateSource = templateElement.innerHTML,
								renderFn = Handlebars.compile(templateSource);
								
						return renderFn({ 
							 list: commentsMass 
						});

					}
					comments = renderComments( null, 'commentsTemplate'),
					clasterComments = renderComments( null, 'ClasterCommentsTemplate');

//===================================					
					// создание кластера

					// Создаем собственный макет с информацией о выбранном геообъекте.
    			var customItemContentLayout = ymaps.templateLayoutFactory.createClass(
        		// Флаг "raw" означает, что данные вставляют "как есть" без экранирования html.
	        	'<h2 class=ballon_header><a href="#" data-openbaloon="{{properties.thisCoords}}">{{ properties.balloonHeader|raw }}</a></h2>' +
	        	'<div class=ballon_body>{{ properties.clasterComments|raw }}</div>' 
        	);

					var clusterer = new ymaps.Clusterer({
						clusterDisableClickZoom: true,
						clusterOpenBalloonOnClick: true,
		        // Устанавливаем стандартный макет балуна кластера "Карусель".
		        clusterBalloonContentLayout: 'cluster#balloonCarousel',
		        // Устанавливаем собственный макет.
		        clusterBalloonItemContentLayout: customItemContentLayout,
		        // Устанавливаем режим открытия балуна. 
		        // В данном примере балун никогда не будет открываться в режиме панели.
		        //clusterBalloonPanelMaxMapArea: 0,
		        // Устанавливаем размеры макета контента балуна (в пикселях).
		        clusterBalloonContentLayoutWidth: 200,
		        clusterBalloonContentLayoutHeight: 130,
		        // Устанавливаем максимальное количество элементов в нижней панели на одной странице
		        clusterBalloonPagerSize: 5,
		        // Настройка внешего вида нижней панели.
		        // Режим marker рекомендуется использовать с небольшим количеством элементов.
		        // clusterBalloonPagerType: 'marker',
		        // Можно отключить зацикливание списка при навигации при помощи боковых стрелок.
		        // clusterBalloonCycling: false,
		        // Можно отключить отображение меню навигации.
		        // clusterBalloonPagerVisible: false

		        preset: 'islands#invertedDarkGreenClusterIcons'
      		});

      		function addAllToClaster(){
      			clusterer.add(placemarks);
						myMap.geoObjects.add(clusterer);
      		}



//===================================
					// открытия балуна по клику на ссылку в кластере

					map.addEventListener('click', function(e){

						if( e.target.dataset.openbaloon ) {
							e.preventDefault();

							var chosenElement,
									choosenCoords = e.target.dataset.openbaloon.split(','),
									coordsX = [];

							for( var key of placemarks ) {
								if( (key.geometry._coordinates[0] == choosenCoords[0]) && (key.geometry._coordinates[1] == choosenCoords[1]) ) {
									chosenElement = key;
									coordsX = [chosenElement.geometry._coordinates[0], chosenElement.geometry._coordinates[1]];

									coordsElement = coordsX,
									element = chosenElement;
								}
							}

							myMap.zoomRange.get(coordsX)
							.then(function (range) {
								return new Promise(function(resolve){
									myMap.setCenter(coordsX, range[1]);
									resolve();
								});
							})
							.then(function(){
								element.balloon.open();
							});
							
						}
					});

//===================================
					// функция добавления метки
					function addPlacemark(coords){
				
						var myPlacemark = new ymaps.Placemark(
							coords, 
							{ 
								comments: comments,
								clasterComments : clasterComments,
								thisCoords : coords
							},
							{
								balloonLayout: BalloonLayout,
								balloonContentLayout: MyBalloonContentLayout,
								preset: 'islands#violetIcon'
							}
						);

						// определяем элемент и его координаты сразу при установке
						element = myPlacemark;
						coordsElement = myPlacemark.geometry._coordinates;	

						myPlacemark.properties.set('balloonContent', content);

						// определение адреса по координатам
						ymaps.geocode(coords).then(function (res) {
							var firstGeoObject = res.geoObjects.get(0);

							myPlacemark.properties
							.set({
								balloonHeader: firstGeoObject.properties.get('text')
							});
						});

						// добавление метки на карту
						myMap.geoObjects.add(myPlacemark);

						// получение адреса по координатам при открытии балуна
						myPlacemark.events.add('click', function (e) {						
							element = e.get('target');	
							coordsElement = e.get('target').geometry._coordinates;		
							console.log('coordsElement', coordsElement);
						});

						// добавление метки в массив меток для дальнейшей кластеризации
						placemarks.push(myPlacemark);

						// вызов функции добавления в кластер всех элементов
						addAllToClaster();
						
					}


//===================================
					// вывод всех уже имеющихся меток после загрузки страницы

					// получаем с сервера все метки через Ajax
					var xhr = new XMLHttpRequest();

					xhr.open("POST", '/submit', true)
					xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')

					xhr.send('getAllPlacemark');

					xhr.addEventListener('load', function(){
						var allPlacemarks = xhr.responseText;
						allPlacemarks = eval(allPlacemarks);
						
						// собственно выводим каждую метку
						allPlacemarks.forEach(function(value, key){
							
							var x = +value.coordsX,
									y = +value.coordsY,
									coords = [x,y],
									newComment = renderComments( value.comment, 'commentsTemplate' ),
									newClasterComments = renderComments( value.comment, 'ClasterCommentsTemplate');

							// вывод метки
							addPlacemark(coords);

							// добавление метке комментариев
							element.properties
							.set({
								comments: newComment,
								clasterComments : newClasterComments
							});

							// установка метке количества комментариев
							if( value.comment.length > 0 ) {
								element.properties
								.set({
									iconContent: value.comment.length
								});						
							}

						});

						// вызов функции добавления в кластер всех элементов
						addAllToClaster();

					});
					xhr.addEventListener('error', function(){
						console.log('error');
					});


//===================================
					// создание новой метки по клику на карте
					myMap.events.add('click', function (e) {						
						var coords = e.get('coords');

						addPlacemark(coords);
						element.balloon.open();

						// подготавливаем к отправке на сервер новой метки
						var json = JSON.stringify({
							coordsX : coordsElement[0].toString(),
							coordsY : coordsElement[1].toString(),
							comment : []
						});

						// сохраняем на сервере метку через Ajax
						var xhr = new XMLHttpRequest();

						xhr.open("POST", '/submit', true)
						xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

						xhr.send(json);

						xhr.addEventListener('load', function(){
							responsemass = xhr.responseText;
							responsemass = eval(responsemass);
						});
						xhr.addEventListener('error', function(){
							console.log('error');
						});

					});


//===================================
					// Добавление нового комментария и вывод всех предыдущих
					map.addEventListener('click', function(e){

						if( e.target.dataset.addcomment ) {
							e.preventDefault();

							var responsemass = '', // <- тут будет ответ с сервера в виде строки
									parent = e.target.parentNode,
									name = parent.querySelector('input[name="name"]').value,
									place = parent.querySelector('input[name="place"]').value,
									impression = parent.querySelector('textarea[name=impression]').value;
									console.log('impression', impression);

							// если все поля заполнены
							if( (name != '') && (place != '') && (impression != '') ) {
								
								// подготавливаем к отправке на сервер
								var json = JSON.stringify({
									coordsX : coordsElement[0].toString(),
									coordsY : coordsElement[1].toString(),
									comment : [{
										name : name,
										place : place,
										impression : impression
									}]
								});

								// получаем с сервера комменты через Ajax
								var xhr = new XMLHttpRequest();

								xhr.open("POST", '/submit', true)
								xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

								xhr.send(json);

								xhr.addEventListener('load', function(){
									responsemass = xhr.responseText;
									responsemass = eval(responsemass);
									var newComment = renderComments( responsemass, 'commentsTemplate'),
											newClasterComments = renderComments( responsemass, 'ClasterCommentsTemplate');

									element.properties
									.set({
										comments: newComment,
										clasterComments : newClasterComments
									});

									// установка метке количества комментариев
									if( responsemass.length > 0 ) {
										element.properties
										.set({
											iconContent: responsemass.length
										});						
									}

								});
								xhr.addEventListener('error', function(){
									console.log('error');
								});
							}	


						}
					});
			

				}

			);


})();

