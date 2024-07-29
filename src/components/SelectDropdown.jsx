import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

const SelectDropdown = ({
  labelText = 'Label',
  placeholder,
  options = [],
  multiple = false,
  renderOption,
  onChange,
  searchable = false,
  disablePortal = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOptions, setSelectedOptions] = useState(multiple ? [] : null);
  const [portalElement, setPortalElement] = useState(null);
  const selectRef = useRef(null);

  useEffect(() => {
    if (!disablePortal) {
      const el = document.createElement('div');
      document.body.appendChild(el);
      setPortalElement(el);

      return () => {
        document.body.removeChild(el);
      };
    }
  }, [disablePortal]);

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
    <div className="bg-white w-full border border-gray-400 rounded-lg shadow-popover">
      {searchable && (
        <div className="flex flex-row items-center border-b border-b-gray-400 w-full p-[8px_10px] rounded-tl-lg rounded-tr-lg">
          <ion-icon name="search-outline"></ion-icon>
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
              <ion-icon name="close-circle"></ion-icon>
            </button>
          )}
        </div>
      )}
      <div className="max-h-[40vh] overflow-auto">
        {filteredOptions.length ? (
          filteredOptions.map((option, index) => (
            <div
              key={index}
              onClick={() => handleOptionClick(option)}
              className={`py-[5px] px-[10px] cursor-pointer last:rounded-br-lg last:rounded-bl-lg ${
                (multiple
                  ? selectedOptions.includes(option)
                  : selectedOptions === option) && 'bg-gray-100'
              } ${!searchable && 'first:rounded-tl-lg first:rounded-tr-lg'}`}
            >
              {renderOption
                ? renderOption(option)
                : getHighlightedText(getOptionLabel(option))}
            </div>
          ))
        ) : (
          <p className="p-[10px] text-sm">Not Found</p>
        )}
      </div>
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
    return portalElement
      ? ReactDOM.createPortal(
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
      : null;
  };

  return (
    <div className="flex flex-row items-center gap-20 w-full">
      <label className="w-1/4 font-semibold">{labelText}</label>
      <div
        className="relative flex flex-col min-w-[75%] max-w-[75%] bg-white cursor-pointer"
        ref={selectRef}
      >
        <div
          className="flex flex-row items-center justify-between gap-5 h-[45px] max-h-[45px] p-[10px] rounded-lg border border-gray-500"
          onClick={(ev) =>
            !ev.target.className.includes('remove-option') && setIsOpen(!isOpen)
          }
        >
          <div className="flex flex-row gap-[5px] overflow-auto">
            {multiple
              ? selectedOptions.length > 0
                ? selectedOptions.map((option, idx) => (
                    <span
                      key={`selected-${idx}`}
                      className="flex flex-row items-center gap-[5px] text-sm p-[5px] rounded-lg bg-gray-200"
                    >
                      {getOptionLabel(option)}
                      <button
                        type="button"
                        className="flex text-gray-600 text-base"
                        onClick={() => handleOptionClick(option)}
                      >
                        <ion-icon
                          name="close-circle-outline"
                          class="remove-option"
                        ></ion-icon>
                      </button>
                    </span>
                  ))
                : placeholder
              : selectedOptions
              ? getOptionLabel(selectedOptions)
              : placeholder}
          </div>
          <ion-icon
            name={`chevron-${isOpen ? 'up' : 'down'}-outline`}
          ></ion-icon>
        </div>
        {isOpen && renderOptions()}
      </div>
    </div>
  );
};

export default SelectDropdown;
