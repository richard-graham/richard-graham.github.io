document.addEventListener('DOMContentLoaded', function() {
    calcInit();
}, false);

var calc = {};

function calcInit() {
    calc.equation = '';
    calc.displayValue = '';
    calc.firstNumber = null;
    calc.secondNumber = null;
    calc.operator = null;
    calc.currentVal = '';
    calc.isEqualled = false;

    return calc;
}

function inputNumber(digit) {
    if (calc.isEqualled) {                                                      // if the last button pressed was equals
        calcInit()
    }
    if (digit === '.' && calc.currentVal.includes('.')) { 
        return;                                                                 //exit
    }
    if (digit === '.' && !isNumber(calc.currentVal)) {                          //if there is an operator in currentVal and the next input is '.' make it '0.'
        calc.currentVal = '0.'
        digit = '0.'
    } else if (calc.currentVal === '0.') {                                      //'0.' is not a number so we need to specifically say if the currentVal is '0.' then add new digit to the end of the currentVal
        calc.currentVal += digit
    } else if (calc.currentVal === calc.operator) {                             //if last digit was an operator replace it rather than add digit to the end of it
        calc.currentVal = digit
    } else {                                                                    // otherwise just pop the digit on the end
        calc.currentVal += digit; 
    }
    calc.equation += digit;
}

function inputOperator (operator) {
    let output = 0; 
    if (!isNumber(calc.currentVal)) {                                           //if currentVal is not a number (i.e the the last value entered was an operator)
        replaceOperatorAndVal(operator);
        calc.equation = calc.equation.substring(0, calc.equation.length - 3);   //removes last operator from the equation string
        calc.equation += (` ${operator} `);                                     //adds new operator on the end
        return;
    }
    if (calc.operator === null) {                                               //this runs the first time an operator is entered or after AC is hit
        calc.firstNumber = calc.currentVal; 
    } else {                                                                    //if currentVal is number and 
        calc.secondNumber = calc.currentVal 
        output = doMathStuff(calc.firstNumber, calc.secondNumber, calc.operator) 
        calc.firstNumber = output.toString();
        if (calc.isEqualled === true) {                                         //if the last button pressed was equals
            calc.equation = calc.firstNumber;
            calc.isEqualled = false;
        }
    }
    replaceOperatorAndVal(operator);
    calc.equation += (` ${operator} `);
}

function inputEquals(value) {                                                   //when equals is pressed do this stuff
    var output = 0;
    calc.secondNumber = calc.currentVal;
    output = doMathStuff(calc.firstNumber, calc.secondNumber, calc.operator)
    calc.displayValue = output;
    calc.equation += (` ${value} ${output.toString()}`)
    document.getElementById('outputDisplay').innerHTML = calc.displayValue;
    calc.isEqualled = true;                                                     //this is how other functions know equals was the last thing pressed
}

//reusable functions that the main functions rely on
function replaceOperatorAndVal (input) {
    calc.currentVal = input;
    calc.operator = input;
}

function turnStringToNumber(str) {
    return parseFloat(str);
}

function isNumber(string) {
    return parseFloat(string).toString() === string.toString();
}

function doMathStuff(firstNumberString, secondNumberString, operator) { 
    let returnValue = 0;
    let firstVar = turnStringToNumber(firstNumberString);
    let secondVar = turnStringToNumber(secondNumberString);

    switch (operator) {
        case '+':
            returnValue = firstVar + secondVar  ;
            break;
        case '-':
            returnValue = firstVar - secondVar  ;
            break;
        case '*':
            returnValue = firstVar * secondVar  ;
            break;
        case '/':
            returnValue = firstVar / secondVar  ;
            break;
        default:
            returnValue = 'doMathStuff() expected an operator'
    }
    returnValue = returnValue.toFixed(4);
    return parseFloat(returnValue);
} 

//functions called solely by event handlers
function updateEquation() {
    document.getElementById('equation-display').innerHTML = calc.equation;
}

function updateOutputDisplay() {
    document.getElementById('outputDisplay').innerHTML = calc.currentVal;
}

function updateOutputOperator() {
    document.getElementById('outputDisplay').innerHTML = calc.operator;
}

//event listeners and handlers
document.querySelectorAll('.number').forEach(function(el){el.addEventListener('click', function() {
    inputNumber(this.value)
    updateOutputDisplay()
    ;
})})
document.querySelectorAll('.operator').forEach(function(el){el.addEventListener('click', function() {
    inputOperator(this.value);
    updateOutputOperator()
})})
document.getElementById('equals').addEventListener('click', function() {
    inputEquals(this.value);
})

document.querySelectorAll('button').forEach(function(el){el.addEventListener('click', function() {
    updateEquation(this.value);
})})

document.getElementById('clear').addEventListener('click', function() {
    calcInit();
    document.getElementById('equation-display').innerHTML = '0'
    document.getElementById('outputDisplay').innerHTML = '0'
})