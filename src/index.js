function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
    let entranceString = expr.replace(/ /g, '');
    const entArr = []; // = Array.from(entranceString.matchAll(/((\d+)|(\D))/g));

    let regexp = /((\d+)|(\D))/g;
    let result;
    while (result = regexp.exec(entranceString)) {
        entArr.push(result[0]);
    }

    const operationStack = [];
    const exitArr = [];
    let brackets = 0;

    const priority = {
        '+': 1,
        '-': 1,
        '/': 2,
        '*': 2,
    }
    entArr.forEach(el => {
        if (!isNaN(el)) {
            exitArr.push(el);
        } else if (!operationStack.length) {
            operationStack.push(el);
            if (el === '(') {
                brackets++;
            } else if (el === ')') {
                throw 'ExpressionError: Brackets must be paired';
                brackets--;
            }
        } else if ((priority[el] !== undefined) && (priority[operationStack[operationStack.length - 1]] >= priority[el])) {
            while ((priority[el] !== undefined) && (priority[operationStack[operationStack.length - 1]] >= priority[el])) {
                exitArr.push(operationStack.pop());
            }
            operationStack.push(el);
        } else if ((priority[el] !== undefined) && (priority[operationStack[operationStack.length - 1]] < priority[el])) {
            operationStack.push(el);
        } else if ((priority[el] !== undefined) && (priority[operationStack[operationStack.length - 1]] === undefined)) {
            operationStack.push(el);
        } else if (priority[el] === undefined) {
            if (el === '(') {
                operationStack.push(el);
                brackets++;
            } else if (el === ')') {
                if (brackets <= 0) {
                    throw 'ExpressionError: Brackets must be paired';
                }
                while (operationStack[operationStack.length - 1] !== '(') {
                    exitArr.push(operationStack.pop());
                }
                operationStack.pop();
                brackets--;
            }
        }
    })
    while (operationStack.length) {
        exitArr.push(operationStack.pop());
    }
    const numbers = [];
    while (exitArr.length) {
        while (!isNaN(exitArr[0])) {
            numbers.push(exitArr.shift());
        }
        if (isNaN(exitArr[0])) {
            switch (exitArr.shift()) {
                case '+':
                    numbers[numbers.length - 2] = +numbers[numbers.length - 2] + +numbers[numbers.length - 1];
                    numbers.pop();
                    break;
                case '-':
                    numbers[numbers.length - 2] = +numbers[numbers.length - 2] - +numbers[numbers.length - 1];
                    numbers.pop();
                    break;
                case '/':
                    if ((+numbers[numbers.length - 1] === 0) || (+numbers[numbers.length - 2] === 0)) {
                        throw new Error("TypeError: Division by zero.");
                    }
                    numbers[numbers.length - 2] = +numbers[numbers.length - 2] / +numbers[numbers.length - 1];
                    numbers.pop();
                    break;
                case '*':
                    numbers[numbers.length - 2] = +numbers[numbers.length - 2] * +numbers[numbers.length - 1];
                    numbers.pop();
                    break;
            }
        }
    }

    if (brackets) {
        throw 'ExpressionError: Brackets must be paired';
    }
    return +numbers

}


module.exports = {
    expressionCalculator
}