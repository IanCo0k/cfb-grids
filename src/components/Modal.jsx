import React, { useState } from 'react';

function Modal() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
          <div className="bg-white p-6 rounded shadow-md z-10">
            <h1 className='text-center text-2xl font-semibold mb-4'>
              Support {' '}
              <a
                href="https://www.buymeacoffee.com/ianscook19x"
                target="_blank"
                rel="noopener noreferrer"
                className='text-blue-500'
              >
              CFB Grids
              </a>
            </h1>
            <p className="text-center text-blue-500 text-3xl mb-4">HAPPY WEEK 0!</p>
            <p className="text-center text-2xl mb-4">PLAYER STATS NOW EXTEND BACK TO 1957</p>
            <p className="text-center mb-4">
              For transfer players, they must have reached the 'career' total with the school to qualify. But players can qualify for 2 different schools now.
            </p>
            <p className="text-center mb-4">
              All team players count for the conference that the team ended with in 2022
            </p>
            <p className="text-center mb-4">FCS players only included in draft data, for now</p>
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

export default Modal;
