const input = document.querySelector("#write");
const answer = document.querySelector("#answer");
const calculator = document.querySelector(".container");
const keys = document.querySelector(".keys");

let equation = 0;
let ifDecimal = "";
let isEqual = false;
let negativeSign;

keys.addEventListener("click", (event) => {

  
    
    const key = event.target;
    const keyValue = key.textContent;
    const { type}  = key.dataset;
    const { previousKeyType } = calculator.dataset;
    let display = input.textContent; 

    if(type ==="number"){
        if(previousKeyType === "sign"){
            input.textContent = display + keyValue;
            equation = equation +  -1 * Number(key.value);
            
        }
        else if(display === "0"){
            input.textContent = (previousKeyType === "operator") ? display + keyValue : keyValue;
            equation = (previousKeyType === "operator") ? equation + key.value : key.value;
            ifDecimal = ifDecimal + keyValue;
        }else{
            if(ifDecimal.length >= 19){
                let replaceNumber = ifDecimal;
                ifDecimal = Number(ifDecimal).toExponential(2);
                input.textContent = display.replace(replaceNumber, ifDecimal);
            }else{
                input.textContent = input.textContent.includes('N') ? 'NaN' : 
										input.textContent.includes('I') ? 'Infinity' : display + keyValue;
				equation = equation + key.value;
				ifDecimal = ifDecimal + keyValue;
            }
        }

    }

    if(type ==="operator"  && previousKeyType !== "operator" && previousKeyType !== "sign" && !display.includes("Infinity")){
        if (isEqual){
            input.textContent = answer.textContent + ' ' + keyValue + ' ';
            ifDecimal = "";
            equation = Number(answer.textContent) + ' ' + key.value + ' ';
        } else{
            ifDecimal = "";
            equation = equation + ' ' + key.value + ' ';
            input.textContent = display + ' ' + keyValue + ' ';
    } 
}

    if(type === 'decimal' && (previousKeyType === 'number' || display === '0' || previousKeyType ==='sign')
     && !display.includes('Infinity')) {
    if (!ifDecimal.includes('.')) {
        input.textContent = display + keyValue;
        equation = equation + key.value;
        ifDecimal = ifDecimal + keyValue;
        }
    }

    if((type === "reset" || type === "backspace") && display !== "0"){
        if(type === "backspace"){
            input.textContent = display.substring(0, display.length-1);
            equation = equation.substring(0, equation.length -1);
            ifDecimal = ifDecimal.substring(o, ifDecimal.length-1);
        }else{
            display = "0";
            input.textContent = display;
            equation = "";
            ifDecimal = "";
            isEqual = false;
            answer.innerHTML = "&nbsp;";

        }
    }
     
    if (type === "sign" &&  (previousKeyType === "operator" || display === "0") && previousKeyType !== "sign"){
        input.textContent = (previousKeyType === "operator") ? display + ' ' + keyValue : keyValue;

    }
   


    if(type === "equals"){
        isEqual = true;
        const result = equationHandler(equation);        
        if(result || result === 0){
            answer.textContent = (!Number.isInteger(result)) ? result.toFixed(2) : 
                                        (result.toString().length >= 16) ? result.toExponential(2) : result ;
        } else {
            answer.textContent = 'Math Error';
        }
        
    }
    calculator.dataset.previousKeyType = type;
})

function calculate(firstNumber, operator, secondNumber) {

	firstNumber = Number(firstNumber);
	secondNumber = Number(secondNumber);

    if (operator === 'addition' || operator === '+') return firstNumber + secondNumber;
    if (operator === 'subtraction' || operator === '-') return firstNumber - secondNumber;
    if (operator === 'multiplication' || operator === 'x') return firstNumber * secondNumber;
    if (operator === 'division' || operator === '/') return firstNumber / secondNumber;
    if (operator === 'power' || operator === '^') return firstNumber ** secondNumber;
}

function equationHandler(equation){
            equation = equation.split(" ");
            const operators = ['^','/', 'x',  '+', '-'];
            let firstNumber;
            let secondNumber;
            let operator;
            let operatorIndex;
            let ans;
            for(let i = 0; i < operators.length;i++){
                while (equation.includes(operators[i])) {
                    operatorIndex = equation.findIndex(item => item === operators[i]);
                    firstNumber = equation[operatorIndex-1];
                    operator = equation[operatorIndex];
                    secondNumber = equation[operatorIndex+1];
                    ans = calculate(firstNumber, operator, secondNumber);
                    equation.splice(operatorIndex - 1, 3, ans);
                }
            }
            return ans;
}

