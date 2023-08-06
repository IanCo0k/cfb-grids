import React, { useState } from 'react';

export default function Dropdown({ options, onChange }) {
  const [selectedOption, setSelectedOption] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);

  const handleChange = (event) => {
    const userInput = event.target.value;
    setSelectedOption(userInput);
    const filtered = options.filter((option) =>
      option.toLowerCase().includes(userInput.toLowerCase())
    );
    setFilteredOptions(filtered);
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
    setFilteredOptions([]);
    onChange(option);
    setSelectedOption(''); // Clear the input field after selection
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={selectedOption}
        onChange={handleChange}
        placeholder="Type to search..."
        className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500"
      />
      {filteredOptions.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              onClick={() => handleSelect(option)}
              className="cursor-pointer px-4 py-2 text-gray-800 hover:bg-gray-100"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
