import React, { useState } from 'react';
import './App.css';

function App() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState([]);

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const clearEntry = () => {
    setDisplay('0');
  };

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);
      
      const historyEntry = `${currentValue} ${operation} ${inputValue} = ${newValue}`;
      setHistory([historyEntry, ...history.slice(0, 9)]);
      
      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 'Error';
      case '%':
        return firstValue % secondValue;
      default:
        return secondValue;
    }
  };

  const percentage = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const toggleSign = () => {
    const value = parseFloat(display);
    setDisplay(String(value * -1));
  };

  const squareRoot = () => {
    const value = parseFloat(display);
    if (value >= 0) {
      setDisplay(String(Math.sqrt(value)));
    } else {
      setDisplay('Error');
    }
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl">
        {/* Calculator */}
        <div className="bg-gray-900 rounded-3xl shadow-2xl p-8 w-full lg:w-2/3">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white text-center mb-2">Calculadora Clásica</h1>
            <p className="text-gray-400 text-center text-sm">Operaciones básicas y avanzadas</p>
          </div>

          {/* Display */}
          <div className="bg-gray-800 rounded-2xl p-6 mb-6 shadow-inner">
            <div className="text-right">
              <div className="text-gray-500 text-sm h-6 overflow-hidden">
                {operation && previousValue !== null && `${previousValue} ${operation}`}
              </div>
              <div className="text-white text-5xl font-light overflow-x-auto overflow-y-hidden whitespace-nowrap">
                {display}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-4 gap-3">
            {/* Row 1 */}
            <button
              onClick={clear}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-5 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              AC
            </button>
            <button
              onClick={clearEntry}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-5 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              CE
            </button>
            <button
              onClick={() => performOperation('%')}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-5 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              %
            </button>
            <button
              onClick={() => performOperation('÷')}
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-5 rounded-xl text-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              ÷
            </button>

            {/* Row 2 */}
            <button
              onClick={() => inputDigit(7)}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-5 rounded-xl text-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              7
            </button>
            <button
              onClick={() => inputDigit(8)}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-5 rounded-xl text-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              8
            </button>
            <button
              onClick={() => inputDigit(9)}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-5 rounded-xl text-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              9
            </button>
            <button
              onClick={() => performOperation('×')}
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-5 rounded-xl text-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              ×
            </button>

            {/* Row 3 */}
            <button
              onClick={() => inputDigit(4)}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-5 rounded-xl text-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              4
            </button>
            <button
              onClick={() => inputDigit(5)}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-5 rounded-xl text-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              5
            </button>
            <button
              onClick={() => inputDigit(6)}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-5 rounded-xl text-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              6
            </button>
            <button
              onClick={() => performOperation('-')}
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-5 rounded-xl text-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              -
            </button>

            {/* Row 4 */}
            <button
              onClick={() => inputDigit(1)}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-5 rounded-xl text-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              1
            </button>
            <button
              onClick={() => inputDigit(2)}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-5 rounded-xl text-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              2
            </button>
            <button
              onClick={() => inputDigit(3)}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-5 rounded-xl text-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              3
            </button>
            <button
              onClick={() => performOperation('+')}
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-5 rounded-xl text-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              +
            </button>

            {/* Row 5 */}
            <button
              onClick={toggleSign}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-5 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              +/-
            </button>
            <button
              onClick={() => inputDigit(0)}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-5 rounded-xl text-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              0
            </button>
            <button
              onClick={inputDecimal}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-5 rounded-xl text-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              .
            </button>
            <button
              onClick={() => performOperation('=')}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-5 rounded-xl text-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              =
            </button>

            {/* Row 6 - Extra functions */}
            <button
              onClick={squareRoot}
              className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-5 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              √
            </button>
            <button
              onClick={percentage}
              className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-5 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              Porcentaje
            </button>
          </div>
        </div>

        {/* History Panel */}
        <div className="bg-gray-900 rounded-3xl shadow-2xl p-8 w-full lg:w-1/3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Historial</h2>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200"
              >
                Limpiar
              </button>
            )}
          </div>
          
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {history.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <p>No hay operaciones aún</p>
              </div>
            ) : (
              history.map((entry, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-lg p-4 shadow-md hover:bg-gray-750 transition-colors duration-200"
                >
                  <p className="text-white font-mono text-sm break-all">{entry}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;