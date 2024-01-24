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
          <div className="bg-gray-200 p-6 rounded shadow-md z-10 max-w-xl flex flex-col m-auto" style={{ maxHeight: '600px' }}>
            <div className="overflow-y-auto mb-4">
              <h1 className='text-center text-2xl font-semibold mb-4'>
                Support CFB Grids{' '}
                <a
                  href="https://www.buymeacoffee.com/ianscook19x"
                  target="_blank"
                  rel="noopener noreferrer"
                  className='text-blue-500'
                >
                HERE
                </a>
              </h1>
              <div className='h-[3px] my-2 w-full bg-blue-500'></div>
              <h1 className='text-5xl mb-3'>PLEASE MAKE AN ACCOUNT <Link to='/login' className='text-blue-800 font-bold' >HERE</Link></h1>
              <div className='h-[3px] my-2 w-full bg-blue-500'></div>
              <p className="text-center text-2xl mb-4">
              For college football news and discussion, visit <a className='text-blue-500 underline' href="https://cfbselect.com/">CFBSelect.com</a>
              </p>
              <div className='h-[3px] my-2 w-full bg-blue-500'></div>
          
              <p className="text-center text-2xl mb-4">
                Players go back to 1957 and up to the end of the 2022-2023 season.
              </p>
              <div className='h-[3px] my-2 w-full bg-blue-500'></div>
              
              <p className='text-center mb-4'>
                To play, you have to click a cell and type a player that meets the team/conference criteria on the y-axis that intersects with the statistic on the x-axis.
              </p>
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

              <div className='mt-4'>
                <h2 className='text-center text-xl font-semibold mb-2'>Legend</h2>
                <div className='flex flex-col items-center'>
                  <div className='flex items-center mb-2'>
                    <FaTrophy style={{ fill: 'green' }} /> <span className='ml-2'>5% - 10%</span>
                  </div>
                  <div className='flex items-center mb-2'>
                    <FaTrophy style={{ fill: 'silver' }} /> <span className='ml-2'>2% - 5%</span>
                  </div>
                  <div className='flex items-center mb-2'>
                    <FaTrophy style={{ fill: 'gold' }} /> <span className='ml-2'>1% - 2%</span>
                  </div>
                  <div className='flex items-center mb-2'>
                    <FaTrophy style={{ fill: 'purple' }} /> <span className='ml-2'>Less than 1%</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
              onClick={toggleModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
        onClick={toggleModal}
      >
        How To Play
      </button>
    </div>
  );
}

export default Modal;
