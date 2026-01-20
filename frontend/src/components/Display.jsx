import React from 'react';

const Display = ({ value, operation, previousValue }) => {
  return (
    <div className="bg-gray-800 rounded-2xl p-6 mb-6 shadow-inner">
      <div className="text-right">
        <div className="text-gray-500 text-sm h-6 overflow-hidden">
          {operation && previousValue !== null && `${previousValue} ${operation}`}
        </div>
        <div className="text-white text-5xl font-light overflow-x-auto overflow-y-hidden whitespace-nowrap">
          {value || '0'}
        </div>
      </div>
    </div>
  );
};

export default Display;