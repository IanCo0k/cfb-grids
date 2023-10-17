import React, { useState, Suspense } from 'react';
import CFB from './CFB';
import CBB from './CBB';

export default function App() {
  const [selectedComponent, setSelectedComponent] = useState('CFB');

  return (
    <div className="bg-gray-800">
      <nav className="bg-blue-500 p-4 flex justify-center">
        <button
          className={`text-white font-bold py-2 px-4 rounded mx-2 ${
            selectedComponent === 'CFB' ? 'bg-blue-700' : ''
          }`}
          onClick={() => setSelectedComponent('CFB')}
        >
          CFB
        </button>
        <button
          className={`text-white font-bold py-2 px-4 rounded mx-2 ${
            selectedComponent === 'CBB' ? 'bg-blue-700' : ''
          }`}
          onClick={() => setSelectedComponent('CBB')}
        >
          CBB
        </button>
      </nav>
      <div className="container mx-auto p-4">
        <Suspense fallback={<div>Loading...</div>}>
          {selectedComponent === 'CFB' ? <CFB /> : <CBB />}
        </Suspense>
      </div>
    </div>
  );
}
