import React, { useState } from 'react';
import { FaTrophy } from 'react-icons/fa';

function BasketballModal() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
          <div className="bg-white p-6 rounded shadow-md z-10 max-w-xl flex flex-col m-auto" style={{ maxHeight: '600px' }}>
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
              <p className="text-center mb-4">
                Server costs are increasing, so if you'd be willing to donate to continue to support CFB Grids, click the link above.
              </p>
              <p className="text-center text-2xl mb-4">
                Welcome to the first edition of CBB Grids! Honestly not even sure how far back the players go, but it's at least into the 70s. Have fun with this one!
              </p>
              <p className="text-center text-2xl mb-4">
                IF YOU ARE WILLING TO HELP CFB GRIDS EXPAND AND HAVE CODING EXPERIENCE AND/OR ACCESS TO DATA, PLEASE EMAIL ME (EMAIL IN THE FOOTER).
              </p>
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

export default BasketballModal;
