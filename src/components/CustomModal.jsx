import React, { useState } from 'react';

function CustomModal() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
          <div className="bg-white p-6 rounded shadow-md z-10" style={{ width: '100%', maxHeight: '600px', overflowY: 'auto' }}>
            <h1 className='text-center text-2xl font-semibold mb-4'>
              Support CFB Grids {' '}
              <a
                href="https://www.buymeacoffee.com/ianscook19x"
                target="_blank"
                rel="noopener noreferrer"
                className='text-blue-500'
              >
              HERE
              </a>
            </h1>
            <p className="text-center text-2xl mb-4">Players for all columns go back to 1957</p>
            <p className='text-center mb-4'>
              Follow my{' '}
              <a
                href="https://twitter.com/CFBGrids"
                target="_blank"
                rel="noopener noreferrer"
                className='text-blue-500'
              >
                twitter
              </a>{' '}
              for frequent updates
            </p>
            <button
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={toggleModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={toggleModal}
      >
        How To Play
      </button>
    </div>
  );
}

export default CustomModal;
