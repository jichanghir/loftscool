function calculator (firstNumber){

	var obj = {

		sum : function(){
			var rezult = firstNumber;
			for (var i = 0; i < arguments.length; i++) {
				rezult += arguments[i];
			}
			return rezult;
		},

		dif : function(){
			var rezult = firstNumber;
			for (var i = 0; i < arguments.length; i++) {
				rezult -= arguments[i];
			}
			return rezult;
		},

		div : function(){
			var rezult = firstNumber;
			for (var i = 0; i < arguments.length; i++) {
				if ( arguments[i] === 0 ) {
					throw new Error('Деление на ноль запрещено');
				}
				rezult /= arguments[i];
			}
			return rezult;
		},

		mul : function(){
			var rezult = firstNumber;
			for (var i = 0; i < arguments.length; i++) {
				rezult *= arguments[i];
			}
			return rezult;
		}

	}

	return obj;
}

var myCalculator = calculator(100);

try {
	console.log(myCalculator.sum(1, 2, 3)); //вернет 106

	console.log(myCalculator.dif(10, 20)); //вернет 70

	console.log(myCalculator.div(2, 2)); //вернет 25

	console.log(myCalculator.mul(2, 2)); //вернет 400
}
catch(e) {
	console.log( e.message );
}