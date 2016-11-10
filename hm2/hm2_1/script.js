function isAllTrue(source, filterFn) {
	if ( !source.length ) {
		throw new Error('пустой массив');
	}

	for (var i = 0; i < source.length; i++) {
		if ( !isNumber(source[i]) ) {
			return false;
		}
		if ( i == source.length - 1) {
			return true;
		}
	}

}

var allNumbers = [1, 2, 4, 5, 6, 7, 8],
		someNumbers = [1, 2, 'привет', 4, 5, 'loftschool', 6, 7, 8],
		noNumbers = ['это', 'массив', 'без', 'чисел'],
		noMass = [];


function isNumber(val) {

  return typeof val === 'number';

}

try {
	console.log(isAllTrue(allNumbers, isNumber)); //вернет true

	console.log(isAllTrue(someNumbers, isNumber)); //вернет false

	console.log(isAllTrue(noNumbers, isNumber)); //вернет false

	console.log(isAllTrue(noMass, isNumber)); //вернет false
}
catch(e){
	console.log(e.message);
}
