class Calculator {

	constructor(firstNumber){
		this.firstNumber = firstNumber;
	}

	sum(){
		var rezult = this.firstNumber;
		for (var i = 0; i < arguments.length; i++) {
			rezult += arguments[i];
		}
		return rezult;
	}

	dif(){
		var rezult = this.firstNumber;
		for (var i = 0; i < arguments.length; i++) {
			rezult -= arguments[i];
		}
		return rezult;
	}

	div(){
		var rezult = this.firstNumber;
		for (var i = 0; i < arguments.length; i++) {
			if ( arguments[i] === 0 ) {
				throw new Error('Деление на ноль запрещено');
			}
			rezult /= arguments[i];
		}
		return rezult;
	}

	mul(){
		var rezult = this.firstNumber;
		for (var i = 0; i < arguments.length; i++) {
			rezult *= arguments[i];
		}
		return rezult;
	}

}

class SqrCalc extends Calculator{

	sqr(name, mass){
		var obj = super[name];
		return  Math.pow( obj.apply(this, mass), 2); 
	}

	sum(){
		return this.sqr('sum', arguments);
	}

	dif(){
		return this.sqr('dif', arguments);
	}

	div(){
		return this.sqr('div', arguments);
	}

	mul(){
		return this.sqr('mul', arguments);
	}

}

var myCalculator = new SqrCalc(100);

try {
	console.log(myCalculator.sum(1, 2, 3)); 

	console.log(myCalculator.dif(10, 20));

	console.log(myCalculator.div(2, 2));

	console.log(myCalculator.mul(2, 2)); 
}
catch(e) {
	console.log( e.message );
}

