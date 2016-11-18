function deleteTextNodes(element){
	var childNodes = element.childNodes;

	for( var key of childNodes ){
		if( key.nodeType === 3 ){
			key.remove();
		}
	}

}

var container = document.getElementById('container');

deleteTextNodes( container );