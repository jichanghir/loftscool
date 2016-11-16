function forEach(array, func){

	for( key of array ){
		func( key );
	}	

}

function filter(array, func){

	var rezult = [];
	var i = 0;

	for( key of array){
		if( func( key ) ){
			rezult[i] = key;
			i++;
		}
	}

	return rezult;

}

function map(array, func){

	var rezult = [];

	for (var i = 0; i < array.length; i++) {
		rezult[i] = func( array[i] );
	}

	return rezult;

}

function slice(array, begin, end){

	var rezult = [];
	var i = 0;

	if ( begin < 0 ){
		begin = array.length + begin;
	}

	if ( end < 0 ){
		end = array.length + end;
	}

	if( !end ){
		for( begin; begin < array.length; begin++){
			rezult[i] = array[begin];
			i++;
		}
	}

	else for( begin; begin < end; begin++){
		rezult[i] = array[begin];
		i++;
	}

	return rezult;

}

function reduce(array, func, initialValue){

	var result = 0;

	if( initialValue ) result = initialValue;

	for( key of array ){
		result = func( result, key );
	}

	return result;
}

function splice(array, begin, count){

	var mass = array,
			result = [],
			index = 0,
			newElements = [],
			newElementsIndex = 0;

	if( begin < 0 ){
		begin = array.length + begin;
	}		

	if( arguments.length > 3 ){
		for( var i = 3; i < arguments.length; i++){
			newElements[newElementsIndex] = arguments[i];
			newElementsIndex++;
		}
	}

	for( var i = 0; i < mass.length; i++){

		if (( newElements.length > 0 ) && ( i == begin )) {

			for( var j = 0; j < newElements.length; j++){
				result[index] = newElements[j];
				index ++;
			}

		}

		if (( i >= begin ) && ( i < begin + count )) continue;

		else {
			result[index] = mass[i];
			index++;
		}
	}

	return result;

}

let array = [1, 2, 3, 4, 5, 6];

forEach(array, item => console.log(item));

let greaterThan4 = filter(array, item => item > 4);
console.log('greaterThan4', greaterThan4);

let sqare = map(array, item => item*item);
console.log('sqare', sqare);

let slicedMass = slice(array, -3, -2);
console.log('slicedMass', slicedMass);

let reducedMass = reduce(array, (accamulator, item) => accamulator + item, 10);
console.log('reducedMass', reducedMass);

let splicedMas = splice(array, 2 , 1, "first", "second", 999);
console.log('splicedMas', splicedMas);
