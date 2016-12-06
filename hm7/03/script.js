
var elementId = 0;

function create(){
	var newDiv = document.createElement( 'div' ),
			x = ( Math.random() * 100 ) + '%',
			y = ( Math.random() * 100 ) + '%',
			width = Math.floor( Math.random() * (200 - 20) ) + 20 + 'px',
			height = Math.floor( Math.random() * (200 - 20) ) + 20 + 'px',
			r = Math.floor( Math.random() * (256 - 0) ) + 0,
			g = Math.floor( Math.random() * (256 - 0) ) + 0,
			b = Math.floor( Math.random() * (256 - 0) ) + 0,
			color = 'rgb(' + r + ', ' + g + ', ' + b + ')';

	newDiv.classList.add( 'new_element' );
	newDiv.style.left = x;
	newDiv.style.top = y;
	newDiv.style.width = width;
	newDiv.style.height = height;
	newDiv.style.backgroundColor = color;
	newDiv.id = elementId;
	newDiv.classList.add('newElement');
	elementId++;

	container.appendChild( newDiv );

	saveInCookie();
}

function drunNdrop( e ){
	if( e.target.classList.contains('newElement') ){
		var element = e.target,
				coords = getCoords(element),
				shiftX = e.pageX - coords.left;
				shiftY = e.pageY - coords.top;

		function getCoords(elem) { 
			var box = elem.getBoundingClientRect();

			return {
				top: box.top + pageYOffset,
				left: box.left + pageXOffset
			};

		}

		function moveAt(e) {
			element.style.left = e.pageX - shiftX + 'px';
			element.style.top = e.pageY - shiftY + 'px';
		}

	  container.onmousemove = function (e) {
	  	moveAt(e);
	  }

	  container.onmouseup = function(){
	  	container.onmousemove = null;
	  	container.onmouseup = null;
	  	saveInCookie();
	  }
  }
}

function saveInCookie(){
	var allBlocks = document.getElementsByClassName('newElement'),
			cookieString = '[';

	for(var key of allBlocks){
		cookieString += '{"left":"' + key.style.left + '",' +
										 '"top":"' + key.style.top + '",' +
										 '"width":"' + key.style.width + '",' +
										 '"height":"' + key.style.height + '",' +
										 '"backgroundColor":"' + key.style.backgroundColor + '",' + 
										 '"id":"' + key.id + '"},'; 
	}

	cookieString += ']';

	document.cookie = "blocksValues=" + cookieString;
	
}

function reestablishOldBlocks(mas){

	for(var key of mas){

		var newDiv = document.createElement( 'div' );

		newDiv.classList.add( 'new_element' );
		newDiv.style.left = key.left;
		newDiv.style.top = key.top;
		newDiv.style.width = key.width;
		newDiv.style.height = key.height;
		newDiv.style.backgroundColor = key.backgroundColor;
		newDiv.id = key.id;
		newDiv.classList.add('newElement');
		elementId++;

		container.appendChild( newDiv );

	}

}

// достаем из куки значение, и вызываем функцию восстановления блоков
(function(){
	var cookie = document.cookie,
			blocksValue;

	cookie = cookie.split(';');

	for(var key of cookie){
		key = key.split('=');
		if( key[0].trim() === 'blocksValues' ){
			blocksValue = key[1];
			blocksValue = eval(blocksValue);

			reestablishOldBlocks(blocksValue);

		}
	}

})();

button.addEventListener( 'click', create );
container.addEventListener( 'mousedown', drunNdrop );

