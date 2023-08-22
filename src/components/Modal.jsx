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
          <p className="text-center mb-4">Similar to Immaculate Grid, the goal is to find players for each cell that match the criteria of the row and column.</p>
          <p className="text-center mb-4">Players from 2005-2006 season up to 2022-2023</p>
          <p className="text-center mb-4">NFL Draft data goes from 2005 to current day now!</p>
            <h1>SOME PLAYERS THAT SHOULD QUALIFY FOR SOME SQUARES WON'T.</h1>
            <br />
            <h1>Send me an email or DM on twitter and I will manually override it as soon as I can.</h1>     
            <button
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={toggleModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Modal;
