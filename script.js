const display = document.querySelector("#display");
const expression = document.querySelector("#expression");
const keypad = document.querySelector(".keypad");

let currentValue = "0";
let firstValue = null;
let operator = null;
let waitingForValue = false;

function showValue(value) {
  display.textContent = value;
}

function formatNumber(value) {
  if (!Number.isFinite(value)) {
    return "Cannot divide by 0";
  }

  return String(Number(value.toFixed(10)));
}

function addNumber(number) {
  if (currentValue === "Cannot divide by 0" || waitingForValue) {
    currentValue = number === "." ? "0." : number;
    waitingForValue = false;
  } else if (number === "." && currentValue.includes(".")) {
    return;
  } else if (currentValue === "0" && number !== ".") {
    currentValue = number;
  } else {
    currentValue += number;
  }

  showValue(currentValue);
}

function calculate(left, right, selectedOperator) {
  switch (selectedOperator) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "*":
      return left * right;
    case "/":
      return right === 0 ? Infinity : left / right;
    case "%":
      return left % right;
    default:
      return right;
  }
}

function chooseOperator(nextOperator) {
  const value = Number(currentValue);

  if (currentValue === "Cannot divide by 0") {
    return;
  }

  if (operator && waitingForValue) {
    operator = nextOperator;
    expression.textContent = `${firstValue} ${nextOperator}`;
    return;
  }

  if (firstValue === null) {
    firstValue = value;
  } else if (operator) {
    firstValue = calculate(firstValue, value, operator);
    currentValue = formatNumber(firstValue);
    showValue(currentValue);
  }

  operator = nextOperator;
  waitingForValue = true;
  expression.textContent = `${currentValue} ${nextOperator}`;
}

function finishCalculation() {
  if (operator === null || firstValue === null || waitingForValue) {
    return;
  }

  const secondValue = Number(currentValue);
  const result = calculate(firstValue, secondValue, operator);
  expression.textContent = `${firstValue} ${operator} ${secondValue} =`;
  currentValue = formatNumber(result);
  showValue(currentValue);
  firstValue = null;
  operator = null;
  waitingForValue = true;
}

function clearCalculator() {
  currentValue = "0";
  firstValue = null;
  operator = null;
  waitingForValue = false;
  expression.innerHTML = "&nbsp;";
  showValue(currentValue);
}

function deleteNumber() {
  if (waitingForValue || currentValue === "Cannot divide by 0") {
    return;
  }

  currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : "0";
  if (currentValue === "-") {
    currentValue = "0";
  }
  showValue(currentValue);
}

keypad.addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (!button) {
    return;
  }

  if (button.dataset.number) {
    addNumber(button.dataset.number);
  } else if (button.dataset.operator) {
    chooseOperator(button.dataset.operator);
  } else if (button.dataset.action === "equals") {
    finishCalculation();
  } else if (button.dataset.action === "clear") {
    clearCalculator();
  } else if (button.dataset.action === "delete") {
    deleteNumber();
  }
});

document.addEventListener("keydown", (event) => {
  if (/^[0-9.]$/.test(event.key)) {
    addNumber(event.key);
  } else if ("+-*/%".includes(event.key)) {
    chooseOperator(event.key);
  } else if (event.key === "Enter" || event.key === "=") {
    finishCalculation();
  } else if (event.key === "Escape") {
    clearCalculator();
  } else if (event.key === "Backspace") {
    deleteNumber();
  }
});
