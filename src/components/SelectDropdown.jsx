import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { usePortal } from '../contexts/portal';
import {
  XCircleIcon as XCircleIconOutline,
  MagnifyingGlassIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { XCircleIcon } from '@heroicons/react/24/solid';

const SelectDropdown = ({
  id,
  labelText = 'Label',
  placeholder,
  options = [],
  multiple = false,
  renderOption,
  onChange,
  searchable = false,
  outlined = true,
  disablePortal = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOptions, setSelectedOptions] = useState(multiple ? [] : null);
  const portalElement = usePortal();
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const portalElementClicked =
        portalElement && portalElement.contains(event.target);
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target) &&
        !portalElementClicked
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [portalElement]);

  useEffect(() => {
    setSelectedOptions(multiple ? [] : null);
  }, [multiple]);

  const getOptionLabel = (option) =>
    typeof option === 'object' ? option.label : String(option);

  const filteredOptions = options.filter((option) =>
    getOptionLabel(option).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOptionClick = (option) => {
    setSelectedOptions((prev) =>
      multiple
        ? prev.includes(option)
          ? prev.filter((item) => item !== option)
          : [...prev, option]
        : option
    );
    if (!multiple) setIsOpen(false);
    onChange && onChange(selectedOptions);
  };

  const getHighlightedText = (text) =>
    text.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, index) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <span key={index} className="bg-gray-300">
          {part}
        </span>
      ) : (
        part
      )
    );

  const renderOptionsContent = () => (
    <div className="bg-white w-full rounded-lg border border-gray-200 shadow-lg">
      {searchable && (
        <div className="flex flex-row items-center border-b border-b-gray-200 w-full p-[8px_10px] rounded-tl-lg rounded-tr-lg">
          <MagnifyingGlassIcon className="w-3 h-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="outline-none ml-2 w-[90%]"
          />
          {searchQuery && (
            <button
              type="button"
              className="flex text-gray-500 cursor-pointer ml-auto"
              onClick={() => setSearchQuery('')}
            >
              <XCircleIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
      <ul className="max-h-[40vh] overflow-auto">
        {filteredOptions.length ? (
          filteredOptions.map((option, index) => (
            <li
              key={`option-${index}`}
              onClick={() => handleOptionClick(option)}
              className={`py-[5px] px-[10px] cursor-pointer last:rounded-br-lg last:rounded-bl-lg ${
                (multiple
                  ? selectedOptions.includes(option)
                  : selectedOptions === option) && 'bg-gray-100 font-semibold'
              } ${!searchable && 'first:rounded-tl-lg first:rounded-tr-lg'}`}
            >
              {renderOption
                ? renderOption(option)
                : getHighlightedText(getOptionLabel(option))}
            </li>
          ))
        ) : (
          <li className="p-[10px] text-sm">Not Found</li>
        )}
      </ul>
    </div>
  );

  const renderOptions = () => {
    const parentRect = selectRef.current?.getBoundingClientRect();

    if (disablePortal) {
      return (
        <div className="absolute z-[9999] top-[50px] left-0 w-full">
          {renderOptionsContent()}
        </div>
      );
    }
    return (
      portalElement &&
      ReactDOM.createPortal(
        <div
          style={{
            position: 'absolute',
            top: parentRect?.bottom + 5,
            left: parentRect?.left,
            width: parentRect?.width,
          }}
        >
          {renderOptionsContent()}
        </div>,
        portalElement
      )
    );
  };

  return (
    <div className="flex flex-row items-center gap-20 w-full">
      <label className="w-1/4 font-semibold">{labelText}</label>
      <div
        className="relative flex flex-col min-w-[75%] max-w-[75%] bg-white cursor-pointer"
        ref={selectRef}
        id={id}
      >
        <div
          className={`flex flex-row items-center justify-between gap-5 h-[45px] max-h-[45px] p-[10px] rounded-lg ${outlined ? 'border border-gray-300' : 'bg-gray-300'} `}
          onClick={(ev) => {
            let parentEl = ev.target.parentElement;
            if (
              parentEl.tagName !== 'svg' &&
              parentEl.className &&
              !parentEl.className.includes('remove-option')
            )
              setIsOpen(!isOpen);
          }}
        >
          <div className="flex flex-row gap-[5px] overflow-auto">
            {multiple
              ? selectedOptions && selectedOptions.length > 0
                ? selectedOptions.map((option, idx) => (
                    <span
                      key={`selected-${idx}`}
                      className="flex flex-row items-center gap-[5px] text-sm p-[5px] rounded-lg bg-gray-200"
                    >
                      <p className="line-clamp-1">{getOptionLabel(option)}</p>
                      <button
                        type="button"
                        className="flex text-gray-600 text-base remove-option"
                        onClick={() => handleOptionClick(option)}
                      >
                        <XCircleIconOutline className="w-4 h-4" />
                      </button>
                    </span>
                  ))
                : placeholder
              : selectedOptions
                ? getOptionLabel(selectedOptions)
                : placeholder}
          </div>
          {isOpen ? (
            <ChevronUpIcon className="min-w-4 h-4 stroke-2" />
          ) : (
            <ChevronDownIcon className="min-w-4 h-4 stroke-2" />
          )}
        </div>
        {isOpen && renderOptions()}
      </div>
    </div>
  );
};

export default SelectDropdown;
