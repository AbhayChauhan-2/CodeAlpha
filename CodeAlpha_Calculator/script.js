const display = document.getElementById("display");
const history = document.getElementById("history");
const keys = document.querySelector(".keypad");

let expression = "";
let justCalculated = false;

function updateDisplay(value = expression) {
  display.value = value || "0";
}

function isOperator(char) {
  return ["+", "-", "*", "/", "%"].includes(char);
}

function appendValue(value) {
  if (justCalculated && !isOperator(value)) {
    expression = "";
    history.textContent = "";
    justCalculated = false;
  }

  if (isOperator(value)) {
    if (!expression) {
      if (value === "-") expression = "-";
      else return;
    } else if (isOperator(expression.at(-1))) {
      expression = expression.slice(0, -1) + value;
    } else {
      expression += value;
    }
  } else {
    expression += value;
  }

  updateDisplay();
}

function addDecimal() {
  if (justCalculated) {
    expression = "";
    history.textContent = "";
    justCalculated = false;
  }

  const parts = expression.split(/[+\-*/%]/);
  const currentNumber = parts.at(-1);

  if (!currentNumber.includes(".")) {
    expression += currentNumber === "" ? "0." : ".";
    updateDisplay();
  }
}

function clearCalculator() {
  expression = "";
  history.textContent = "";
  justCalculated = false;
  updateDisplay();
}

function deleteLast() {
  if (justCalculated) {
    clearCalculator();
    return;
  }

  expression = expression.slice(0, -1);
  updateDisplay();
}

function calculate() {
  if (!expression) return;

  let safeExpression = expression;

  if (isOperator(safeExpression.at(-1))) {
    safeExpression = safeExpression.slice(0, -1);
  }

  if (!safeExpression || !/[0-9)]$/.test(safeExpression)) return;

  try {
    // The input is constructed only from calculator buttons / validated keyboard input.
    const result = Function('"use strict"; return (' + safeExpression + ')')();

    if (!Number.isFinite(result)) throw new Error("Invalid result");

    const formatted = Number.isInteger(result)
      ? String(result)
      : String(Number(result.toFixed(10)));

    history.textContent = `${safeExpression.replaceAll("*", "×").replaceAll("/", "÷")} =`;
    expression = formatted;
    updateDisplay();
    justCalculated = true;
  } catch {
    display.value = "Error";
    expression = "";
    justCalculated = true;
  }
}

keys.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const value = button.dataset.value;
  const action = button.dataset.action;

  if (value) appendValue(value);
  if (action === "clear") clearCalculator();
  if (action === "delete") deleteLast();
  if (action === "decimal") addDecimal();
  if (action === "equals") calculate();
});

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (/^[0-9]$/.test(key)) appendValue(key);
  else if (["+", "-", "*", "/", "%"].includes(key)) appendValue(key);
  else if (key === ".") addDecimal();
  else if (key === "Enter" || key === "=") {
    event.preventDefault();
    calculate();
  } else if (key === "Backspace") deleteLast();
  else if (key === "Escape") clearCalculator();
});
