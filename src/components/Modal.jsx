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
          <div className="bg-white p-6 rounded shadow-md z-10" style={{ width: '80%', maxHeight: '500px', overflowY: 'auto' }}>
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
            <div style={{ borderRadius: '12px', margin: '1em' }}>
              <iframe
                src="https://open.spotify.com/embed/show/3PxjY8VH1h4Q4Cb2shJqRQ?utm_source=generator"
                width="100%"
                height="352"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="Spotify Embed"
              ></iframe>
            </div>
            <p className="text-center text-2xl mb-4">TODAY'S PLAYERS ARE BACK TO BETWEEN 1956-2022/23 SEASON</p>
            <p className="text-center text-2xl mb-4">Should also accept transfer players, granted they met the career total with the school.</p>
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
