const inputArray = ['', '', ''];
let hasDecimal = false;
let wasOperatorEntered = false;
let hasOldData = false;
let isNegative = false;

const buttons = {
  numberButtons: document.querySelectorAll('.number'),
  decimalButton: document.querySelector('#decimal'),
  clearButton: document.querySelector('#clear'),
  backspaceButton: document.querySelector('#backspace'),
  negativeButton: document.querySelector('#negative'),
  divideButton: document.querySelector('#divide'),
  multiplyButton: document.querySelector('#multiply'),
  minusButton: document.querySelector('#minus'),
  plusButton: document.querySelector('#plus'),
  percentButton: document.querySelector('#percent'),
  equalsButton: document.querySelector('#equals'),
  zeroButton: document.querySelector('#zero'),
  operatorButtons: document.querySelectorAll('.operator'),
}

const display = new (function () {
  let _currentDisplay = '';
  this.element = document.getElementById('dis-span');
  let _currentFontSize = 2.5;

  this.getWidth = () => {
    return this.element.offsetWidth;
  }

  this.getParentWidth = () => {
    return this.element.parentNode.clientWidth;
  }

  this.getFontSize = () => {
    return _currentFontSize;
  }

  this.getCurrentDisplay = () => {
    return _currentDisplay;
  }

  this.setFontSize = (input) => {
    _currentFontSize = input;
  }

  this.setCurrentDisplayValue = (input) => {
    _currentDisplay = input;
  }

  this.setDisplaySize = (input) => {
    let size = `${input}em`;
    _currentFontSize = input;
    this.element.parentNode.style.height = size;
    this.element.style.fontSize = size;
  }

  this.content = (input) => {
    _currentDisplay += input;
    this.element.textContent = _currentDisplay;
  }

  this.makeNegative = () => {
    if (_currentDisplay === '' || _currentDisplay == '0') {
      isNegative = false;
      return
    }
    _currentDisplay = '-' + _currentDisplay;
    this.element.textContent = _currentDisplay;
  }

  this.makePositive = () => {
    _currentDisplay = _currentDisplay.split('').splice(1).join('');
    this.element.textContent = _currentDisplay;
  }

  this.backspace = () => {
    let arr = _currentDisplay.split('');
    let currentValue = arr.pop();
    if (currentValue === '.') {
      hasDecimal = false;
    }
    if (currentValue === '-') {
      isNegative = false;
    }
    _currentDisplay = arr.join('');
  }

  this.resetDisplay = () => {
    _currentDisplay = '';
    this.element.textContent = '0';
    this.setDisplaySize(2.5);
  }
})();

const checkDisplaySize = () => {
  while (display.getWidth() > display.getParentWidth()) {
    display.setDisplaySize(display.getFontSize() - .1);
  }
}

function testDataValues() {
  const testObj = {
    hasDecimal,
    wasOperatorEntered,
    hasOldData,
    isNegative,
    inputArray,
    currentDisplayValue: display.getCurrentDisplay(),
    spanWidth: display.getWidth(),
    parentWidth: display.getParentWidth(),
    fontSize: display.getFontSize() + 'em',
  }
  console.table(testObj);
}

function add(a, b) {
  return a + b
}

function multiply(a, b) {
  return a * b;
}

function minus(a, b) {
  return a - b;
}

function divide(a, b) {
  return a / b;
}

function operate([num1, operand, num2]) {
  let a = parseFloat(num1);
  let b = parseFloat(num2);
  let result = 0;
  if (operand == '+') {
    result = add(a, b);
  } else if (operand == '*') {
    result = multiply(a, b);
  } else if (operand == '-') {
    result = minus(a, b);
  } else if (operand == '/') {
    if (b === 0) {
      divideByZero();
      return undefined;
    } else {
      result = divide(a, b);
    }
  }
  return roundResult(result);
}

//returns num of decimal places in a fractional num
const decimalPlaces = (n) => {
  let s = "" + (+n);
  let match = /(?:\.(\d+))?(?:[eE]([+\-]?\d+))?$/.exec(s);
  return Math.max(0, (match[1] == '0' ? 0 : (match[1] || '').length) - (match[2] || 0));
}

const roundResult = (num) => {
  if (Number.isInteger(num)) {
    return num;
  } else {
    return Number(Math.round(num + 'e4') + 'e-4');
  }
}

const divideByZero = () => {
  clearBehavior();
  display.setDisplaySize(1.3);
  display.content('Division by zero is undefined');
  display.setCurrentDisplayValue('');
  display.setFontSize(2.5);
}

function addEvents() {
  buttons.numberButtons.forEach(e => {
    e.addEventListener('pointerdown', numberBehavior);
  });
  buttons.operatorButtons.forEach(e => {
    e.addEventListener('pointerdown', operatorBehavior)
  });
  buttons.zeroButton.addEventListener('pointerdown', zeroBehavior);
  buttons.decimalButton.addEventListener('pointerdown', decimalBehavior);
  buttons.equalsButton.addEventListener('pointerdown', equalsBehavior);
  buttons.clearButton.addEventListener('pointerdown', clearBehavior);
  buttons.negativeButton.addEventListener('pointerdown', negativeBehaviour);
  buttons.percentButton.addEventListener('pointerdown', percentBehaviour);
  buttons.backspaceButton.addEventListener('pointerdown', backspaceBehaviour);
}

const numberBehavior = (event) => {
  display.setDisplaySize(display.getFontSize());
  let value = display.getCurrentDisplay();
  if (hasOldData || value == '0' || value == "-0") {
    display.resetDisplay();
    display.content(event.target.dataset.value);
    hasOldData = false;
    hasDecimal = false;
  } else if (!hasOldData) {
    display.content(event.target.dataset.value);
    checkDisplaySize();
  }
}

const zeroBehavior = (event) => {
  let value = display.getCurrentDisplay();
  if (value === '') {
    display.setCurrentDisplayValue('0');
    return
  }

  if (value == '0' || value === '-0' || hasOldData) {
    return
  } else {
    display.content(event.target.dataset.value);
  }
}

const decimalBehavior = (event) => {
  if (hasDecimal) {
    return
  } else {
    hasDecimal = true;
    if (display.getCurrentDisplay() === '' || hasOldData) {
      display.resetDisplay();
      hasOldData = false;
      display.content('0' + event.target.dataset.value);
    } else {
      display.content(event.target.dataset.value);
    }
  }
}

const operatorBehavior = (event) => {
  if (display.getCurrentDisplay() === "") {
    return
  }
  if (!wasOperatorEntered) {
    inputArray[0] = display.getCurrentDisplay();
    inputArray[1] = event.target.dataset.value;
    wasOperatorEntered = true;
    hasOldData = true;
    hasDecimal = false;
    isNegative = false;
  } else if (wasOperatorEntered) {
    inputArray[2] = display.getCurrentDisplay();
    let tempResult = operate(inputArray);
    display.resetDisplay();
    display.content(tempResult);
    inputArray[0] = tempResult;
    inputArray[1] = event.target.dataset.value;
    inputArray[2] = '';
    hasOldData = true;
    hasDecimal = false;
    isNegative = false;
    checkDisplaySize();
  }

}

const equalsBehavior = () => {
  if (inputArray[0] !== '' && inputArray[1] !== '' && !hasOldData) {
    inputArray[2] = display.getCurrentDisplay();
    let result = operate(inputArray);
    if (result === undefined) {
      return;
    }
    display.resetDisplay();
    display.content(result);
    hasOldData = true;
    wasOperatorEntered = false;
    inputArray[0] = result;
    inputArray[1] = '';
    inputArray[2] = '';
    result >= 0 ? isNegative = false : isNegative = true;
    checkDisplaySize();
  }
}

const clearBehavior = () => {
  display.resetDisplay();
  hasDecimal = false;
  wasOperatorEntered = false;
  hasOldData = false;
  isNegative = false;
  inputArray.forEach((e, i) => {
    inputArray[i] = '';
  });
}

const negativeBehaviour = () => {
  if (!isNegative) {
    isNegative = true;
    display.makeNegative();
  } else {
    display.makePositive();
    isNegative = false;
  }
}

const percentBehaviour = () => {
  let num = display.getCurrentDisplay();
  if (num === '') {
    return
  } else {
    let result = operate(['.01', '×', num]);
    display.setCurrentDisplayValue('');
    display.content(result);
    hasOldData = true;
  }
}

const backspaceBehaviour = () => {
  let nums = display.getCurrentDisplay();
  if (nums === "0" || nums === "-0" || nums === '' || nums.length == 1) {
    display.resetDisplay();
    isNegative = false;
    hasDecimal = false;
    return
  } else {
    display.backspace();
    display.content('');
  }
}

addEvents();
display.setDisplaySize(2.5);
