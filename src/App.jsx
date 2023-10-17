import React, { useState } from 'react';
import CBB from './CBB';
import CFB from './CFB';

export default function App() {
  const [selectedComponent, setSelectedComponent] = useState('CFB');

  const renderComponent = () => {
    if (selectedComponent === 'CFB') {
      return <CFB />;
    } else if (selectedComponent === 'CBB') {
      return <CBB />;
    }
  };

  return (
    <div className='bg-gray-800'>
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
        {renderComponent()}
      </div>
    </div>
  );
}
