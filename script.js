class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.currentOperand = '';
    this.previousOperand = '';
    this.operation = null;
    this.readyToReset = false;
  }

  clear() {
    this.currentOperand = '';
    this.previousOperand = '';
    this.operation = null;
    this.readyToReset = false;
  }

  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }

  appendNumber(number) {
    if (number === '.' && this.currentOperand.includes('.') || this.currentOperand.length >= 10) return;
    this.currentOperand = ( number === '.' && this.currentOperand === '' ) ?
      ( `0${number.toString()}` ) : 
      ( this.currentOperand.toString() + number.toString() );
  }

  chooseOperation(operation) {
    if (this.currentOperand === '') return;
    if (this.currentOperand !== '' && this.previousOperand !== '') {
      this.calculate();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
  }

  calculate() {
    let result;
    let isError = false;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;
    switch (this.operation) {
      case '+':
        result = prev + current;
        break
      case '−':
        result = prev - current;
        break
      case '∗':
        result = prev * current;
        break
      case '^':
        result = prev ** current;
        break
      case '√':
        ( prev < 0 ) ? ( isError = true )  :  ( result = Math.pow( prev, 1/current ) );
        break
      case '÷':
        ( current === 0 ) ?  ( isError = true ) : ( result = prev / current );
        break
      default:
        return;
    }
    this.readyToReset = true;
    this.currentOperand = !isError ? (+result.toFixed(5)).toString() : 'ERROR';
    this.operation = null;
    this.previousOperand = '';
  }

  invertNumber() {
    if (this.currentOperand.startsWith('-')) {
      this.currentOperand = this.currentOperand.slice(1)
    } else {
      this.currentOperand = `-${this.currentOperand}`
    }
  }

  getDisplayNumber(currentOperand) {
    if (currentOperand === 'ERROR') {
      return 'ERROR'
    }
    const stringNumber = currentOperand.toString()
    const integerDigits = parseFloat(stringNumber.split('.')[0])
    const decimalDigits = stringNumber.split('.')[1]
    let integerDisplay
    if (isNaN(integerDigits)) {
      integerDisplay = ''
    } else {
      integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`
    } else {
      return integerDisplay
    }
  }

  updateDisplay() {
    this.currentOperandTextElement.innerText =
      this.getDisplayNumber(this.currentOperand)
    if (this.operation) {
      this.previousOperandTextElement.innerText =
        `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
    } else {
      this.previousOperandTextElement.innerText = ''
    }
  }
}

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const invertButton = document.querySelector('[data-invert]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');


const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

numberButtons.forEach(button => {
  button.addEventListener("click", () => {

      if(calculator.previousOperand === "" &&
      calculator.currentOperand !== "" &&
  calculator.readyToReset) {
          calculator.currentOperand = "";
          calculator.readyToReset = false;
      }
      calculator.appendNumber(button.innerText)
      calculator.updateDisplay();
  })
})

operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  })
})

equalsButton.addEventListener('click', button => {
  calculator.calculate();
  calculator.updateDisplay();
})

allClearButton.addEventListener('click', button => {
  calculator.clear();
  calculator.updateDisplay();
})

deleteButton.addEventListener('click', button => {
  calculator.delete();
  calculator.updateDisplay();
})

invertButton.addEventListener('click', button => {
  calculator.invertNumber();
  calculator.updateDisplay();
})
