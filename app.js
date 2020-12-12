function add (a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

function minus(a, b) {
  return a - b;
}

function divide(a, b) {
  return a/b;
}

function operate(a, b, operand) {
  if(operand == '+'){
    return add(a, b);
  }else if(operand == '*') {
    return multiply(a, b);
  }else if(operand == '-') {
    return minus(a, b);
  }else if(operand == '/') {
    return divide(a, b);
  }
}

console.log(operate(10,5,'/'));