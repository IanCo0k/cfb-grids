import React, { useState } from 'react';
import { FaTrophy } from 'react-icons/fa';
import { Link } from 'react-router-dom';

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
          <div className="bg-gray-900 border-2 border-gray-200 p-6 rounded shadow-md z-10 max-w-xl mx-auto" style={{ maxHeight: '600px' }}>
            <h1 className='text-2xl md:text-4xl mb-3'>
              Welcome to <span className='font-bold'>Guess The College</span>!
            </h1>

            <h1 className='text-3xl text-center mb-3'>
              Create an Account <Link to='/login' className='text-blue-800 font-bold' >Here</Link>
            </h1>

            <p className="text-center text-2xl mb-4">
              Accounts will enhance your experience, allowing progress tracking and customization.
            </p>

            <button
              className="mt-4 m-auto bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
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
