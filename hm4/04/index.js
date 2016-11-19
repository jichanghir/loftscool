(function scanDOM(){
	var divCount = 0,
			aCount = 0,
			spanCount = 0,
			textNodesCount = 0,
			c1Count = 0,
			c2Count = 0;

	(function countElements(node){
		var children = node.childNodes;

		for( var key of children ){
			if( key.nodeType === 3 ) textNodesCount++;
			if( key.tagName === 'DIV' ) divCount++;
			if( key.tagName === 'A' ) aCount++;
			if( key.tagName === 'SPAN' ) spanCount++;
			if( key.nodeType !== 3 && key.classList.contains("c1") ) c1Count++;			
			if( key.nodeType !== 3 && key.classList.contains('c2') ) c2Count++;
			if( key.childNodes.length ) countElements(key);
		}
	})(document.getElementsByTagName('body')[0]);
	
	console.log('Тэгов div:', divCount);
	console.log('Тэгов a:', aCount);
	console.log('Тэгов span:', spanCount);
	console.log('Текстовых узлов:', textNodesCount);
	console.log('Элементов с классом c1:', c1Count);
	console.log('Элементов с классом c2:', c2Count);
})();