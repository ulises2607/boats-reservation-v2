import React from 'react';

const TestStyles = () => {
  return (
    <div className="bg-red-500 text-white p-4 m-4">
      <h1 className="text-2xl font-bold">Test de Estilos Tailwind</h1>
      <p className="text-sm">Si ves este texto con fondo rojo, Tailwind está funcionando.</p>
      <div className="flex gap-4 mt-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Botón 1
        </button>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Botón 2
        </button>
      </div>
    </div>
  );
};

export default TestStyles;
