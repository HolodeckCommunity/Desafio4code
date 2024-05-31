document.getElementById('openModal').onclick = function() {
    document.getElementById('modal').style.display = 'flex';
}

document.querySelector('.close').onclick = function() {
    document.getElementById('modal').style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == document.getElementById('modal')) {
        document.getElementById('modal').style.display = 'none';
    }
}

let displayValue = '';
let firstOperand = '';
let currentOperator = '';

function appendNumber(number) {
    displayValue += number;
    updateDisplay();
}

function appendOperator(operator) {
    if (displayValue === '') return;
    if (firstOperand !== '') {
        calculate();
    }
    firstOperand = displayValue;
    currentOperator = operator;
    displayValue = '';
    updateDisplay();
}

function clearDisplay() {
    displayValue = '';
    firstOperand = '';
    currentOperator = '';
    updateDisplay();
}

function calculate() {
    if (currentOperator === '' || displayValue === '') return;
    let secondOperand = displayValue;
    try {
        if (currentOperator === '+') {
            displayValue = (parseFloat(firstOperand) + parseFloat(secondOperand)).toString();
        } else if (currentOperator === '-') {
            displayValue = (parseFloat(firstOperand) - parseFloat(secondOperand)).toString();
        } else if (currentOperator === '*') {
            displayValue = (parseFloat(firstOperand) * parseFloat(secondOperand)).toString();
        } else if (currentOperator === '/') {
            displayValue = (parseFloat(firstOperand) / parseFloat(secondOperand)).toString();
        }
    } catch (e) {
        displayValue = 'Erro';
    }
    firstOperand = '';
    currentOperator = '';
    updateDisplay();
}

function updateDisplay() {
    document.getElementById('display').value = displayValue;
}

//-----------------------------dark-mode----------------------//

document.getElementById('toggleMode').onclick = function() {
    document.body.classList.toggle('dark-mode');
    var mode = document.body.classList.contains('dark-mode') ? 'Modo Claro' : 'Modo Escuro';
    document.getElementById('modeText').innerText = mode;

    var icon = document.getElementById('modeIcon');
    if (document.body.classList.contains('dark-mode')) {
        icon.innerHTML = '&#127769;'; // Lua
    } else {
        icon.innerHTML = '&#9728;'; // Sol
    }
}


