function deleteTextNodes(element){
	var i = 0;

	(function go(){

		var childNode = element.childNodes[i];
		if( childNode.nodeType === 3 ) childNode.remove();
		i++;
		if( i >= element.childNodes.length ) return false;
		go();
	})();
	
}

var container = document.getElementById('container');

deleteTextNodes( container );