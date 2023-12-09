import React, { useState, Suspense } from 'react';
import CFB from './CFB';




export default function App() {
  const [selectedComponent, setSelectedComponent] = useState('CFB');


  return (
    <div className="bg-gray-800">
      <CFB />
    </div>
  );
}
