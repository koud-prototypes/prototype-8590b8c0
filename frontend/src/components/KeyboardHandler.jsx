import { useEffect } from 'react';

const KeyboardHandler = ({ 
  onDigit, 
  onOperator, 
  onEquals, 
  onClear, 
  onDecimal, 
  onBackspace 
}) => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event.key;
      
      // Números
      if (/^[0-9]$/.test(key)) {
        onDigit(parseInt(key));
      }
      // Operadores
      else if (key === '+') {
        onOperator('+');
      }
      else if (key === '-') {
        onOperator('-');
      }
      else if (key === '*' || key === 'x' || key === 'X') {
        onOperator('×');
      }
      else if (key === '/') {
        event.preventDefault(); // Evitar búsqueda rápida en navegador
        onOperator('÷');
      }
      else if (key === '%') {
        onOperator('%');
      }
      // Punto decimal
      else if (key === '.' || key === ',') {
        onDecimal();
      }
      // Igual
      else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        onEquals();
      }
      // Limpiar
      else if (key === 'Escape' || key === 'c' || key === 'C') {
        onClear();
      }
      // Backspace
      else if (key === 'Backspace') {
        onBackspace && onBackspace();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [onDigit, onOperator, onEquals, onClear, onDecimal, onBackspace]);

  return null; // Este componente no renderiza nada
};

export default KeyboardHandler;