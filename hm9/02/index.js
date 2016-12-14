
// Функция наследования класса child от parent

function inherit(child, parent){
	child.prototype = Object.create(parent.prototype);
	child.prototype.constructor = child;
	child.prototype.parent = parent;
}

// Создаем класс Calculator 
// и записываем методы в его прототип

function Calculator(firstNumber) {
	this.firstNumber = firstNumber;
}

Calculator.prototype.sum = function(){
	var rezult = this.firstNumber;
	for (var i = 0; i < arguments.length; i++) {
		rezult += arguments[i];
	}
	return rezult;
}

Calculator.prototype.dif = function(){
	var rezult = this.firstNumber;
	for (var i = 0; i < arguments.length; i++) {
		rezult -= arguments[i];
	}
	return rezult;
}

Calculator.prototype.div = function(){
	var rezult = this.firstNumber;
	for (var i = 0; i < arguments.length; i++) {
		if ( arguments[i] === 0 ) {
			throw new Error('Деление на ноль запрещено');
		}
		rezult /= arguments[i];
	}
	return rezult;
}

Calculator.prototype.mul = function(){
	var rezult = this.firstNumber;
	for (var i = 0; i < arguments.length; i++) {
		rezult *= arguments[i];
	}
	return rezult;
}

// Создаем класс SqrCalc 
// и наследуем методы от Calculator
// а затем переопределяем их

function SqrCalc(firstNumber){
	this.firstNumber = firstNumber;
}

inherit(SqrCalc, Calculator);

SqrCalc.prototype.sum = function(){
	return Math.pow( this.parent.prototype.sum.apply(this, arguments), 2);
}

SqrCalc.prototype.dif = function(){
	return Math.pow( this.parent.prototype.dif.apply(this, arguments), 2);
}

SqrCalc.prototype.div = function(){
	return Math.pow( this.parent.prototype.div.apply(this, arguments), 2);
}

SqrCalc.prototype.mul = function(){
	return Math.pow( this.parent.prototype.mul.apply(this, arguments), 2);
}

// создаем экземпляр класса SqrCalc

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

