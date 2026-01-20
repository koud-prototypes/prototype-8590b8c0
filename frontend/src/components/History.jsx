import React from 'react';

const History = ({ history, onClear }) => {
  return (
    <div className="bg-gray-900 rounded-3xl shadow-2xl p-8 w-full lg:w-1/3">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Historial</h2>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200"
          >
            Limpiar
          </button>
        )}
      </div>
      
      <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
        {history.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <svg 
              className="w-16 h-16 mx-auto mb-4 opacity-50" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" 
              />
            </svg>
            <p className="text-sm">No hay operaciones aún</p>
            <p className="text-xs mt-2">Realiza cálculos para ver el historial</p>
          </div>
        ) : (
          history.map((entry, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg p-4 shadow-md hover:bg-gray-750 transition-colors duration-200 animate-fade-in"
            >
              <p className="text-white font-mono text-sm break-all">{entry}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;