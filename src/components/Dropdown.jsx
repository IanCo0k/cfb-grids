import React, { useState } from 'react';
import { FixedSizeList } from 'react-window';
import debounce from 'lodash/debounce';

export default function Dropdown({ options, onChange }) {
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleChange = (event) => {
    const userInput = event.target.value;
    setInputValue(userInput);

    // Clear filtered options if there's no input
    if (userInput.trim() === '') {
      setFilteredOptions([]);
    } else {
      // Debounce the filtering operation
      debounceFilter(userInput);
    }
  };

  const debounceFilter = debounce((userInput) => {
    const filtered = options.filter((option) =>
      option.toLowerCase().includes(userInput.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, 300); // Adjust the debounce delay as needed

  const handleSelect = (option) => {
    setInputValue(option); // Set the input value to the selected option
    setFilteredOptions([]);
    onChange(option);
  };

  const Row = ({ index, style }) => (
    <div
      style={style}
      onClick={() => handleSelect(filteredOptions[index])}
      className="cursor-pointer px-4 py-2 text-gray-800 hover:bg-gray-100"
    >
      {filteredOptions[index]}
    </div>
  );

  return (
    <div className="relative text-gray-500">
      <input
        type="search"
        value={inputValue}
        onChange={handleChange}
        placeholder="Type to search..."
        className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500"
        autoFocus
      />
      {filteredOptions.length > 0 && (
        <FixedSizeList
          height={Math.min(200, filteredOptions.length * 40)}
          width="100%"
          itemCount={filteredOptions.length}
          itemSize={40}
          className='bg-gray-300'
        >
          {Row}
        </FixedSizeList>
      )}
    </div>
  );
}
