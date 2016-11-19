
function prepend(container, newElement){
	container.insertBefore( newElement, container.firstElementChild );
}

var newElement = document.createElement('div'),
		container = document.getElementById('container');

newElement.innerHTML = 'Новый блок';

prepend(container, newElement);