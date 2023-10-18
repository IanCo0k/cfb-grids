import React, { useState, Suspense } from 'react';
import CFB from './CFB';
import CBB from './CBB';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";



export default function App() {
  const [selectedComponent, setSelectedComponent] = useState('CFB');

  // TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAdreRzDSZnBZqCZ21yyv80q8vQRv5dQb0",
    authDomain: "cfb-grids.firebaseapp.com",
    projectId: "cfb-grids",
    storageBucket: "cfb-grids.appspot.com",
    messagingSenderId: "1039307534466",
    appId: "1:1039307534466:web:15d09918f2a3305646049b",
    measurementId: "G-V6ZFJVRZGX"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);


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
