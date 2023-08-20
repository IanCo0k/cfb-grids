import React, { useState } from 'react';

function Modal() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={toggleModal}
      >
        How To Play
      </button>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
          <div className="bg-white p-6 rounded shadow-md z-10">
          <p className="text-center mb-4">Similar to Immaculate Grid, the goal is to find players each cell that match the criteria of the row and column.</p>
          <p className="text-center mb-4">Players from 2005-2006 season up to 2022-2023</p>
          <p className="text-center mb-4">Draft players are between 2010-2021, for now</p>
        <p className="text-center mb-4">Ellipses represents any conference not in the Power 5</p>
        <p className="text-center mb-4"><span className='bg-blue-500'>Passing</span>--<span className='bg-green-500'>Receiving</span>--<span className='bg-purple-500'>Rushing</span>--<span className='bg-orange-500'>Other</span></p>       
            <button
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={toggleModal}
            >
              Close Modal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Modal;
