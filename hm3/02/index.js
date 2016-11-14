
function deepEqual(objA, objB){

    var rezult = true,
        ownPropertiesA = Object.getOwnPropertyNames(objA),
        ownPropertiesB = Object.getOwnPropertyNames(objB);


    if( objA === objB ){
        return 'Обе переменные указывают на один и тот же объект';
    }
    
    if( ownPropertiesA.length === ownPropertiesB.length ){

        for( keyA in objA ){
            if( objB.hasOwnProperty(keyA) ){
 
                if( objA[keyA] === objB[keyA] ) rezult = true;

                else if( objA[keyA] instanceof Date ){
                    aDate = objA[keyA].toString();
                    bDate = objB[keyA].toString();
                    
                    if( aDate !== bDate) return rezult = false;
                }

                else if( typeof objA[keyA] === 'object' ){

                    if( deepEqual( objA[keyA], objB[keyA]) ) rezult = true;
                    else return rezult = false;

                }
                else return rezult = false;
            } 
            else return rezult = false;
        }
    }
    else return rezult = false;

    return rezult;
    
}


var objA = {
    prop1: 'value1',
    prop2: 'value2',
    prop3: 'value3',
    prop4: {
        subProp1: 'sub value1',
        subProp2: {
            subSubProp1: 'sub sub value1',
            subSubProp2: [1, 2, {prop2: 1, prop: 2}, 4, 5, ['first', 'second']]
        }
    },
    prop5: 1000,
    prop6: new Date(2016, 2, 10)
};



var objB = {
    prop5: 1000,
    prop3: 'value3',
    prop1: 'value1',
    prop2: 'value2',
    prop6: new Date('2016/03/10'),
    prop4: {
        subProp2: {
            subSubProp1: 'sub sub value1',
            subSubProp2: [1, 2, {prop2: 1, prop: 2}, 4, 5, ['first', 'second']]
        },
        subProp1: 'sub value1'
    }
};
    
console.log( deepEqual(objA, objB) ); //объекты идентичны, вернет true