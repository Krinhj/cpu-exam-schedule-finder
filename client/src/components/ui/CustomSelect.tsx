import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function CustomSelect({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select...",
  className = "" 
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedOption = options.find(option => option.value === value);

  const handleOptionSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 bg-cpu-beige border border-gray-300 rounded-md cpu-text focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer flex justify-between items-center"
      >
        <span className={selectedOption ? "cpu-blue" : "text-gray-500"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          className={`w-4 h-4 cpu-blue transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isHovered = index === hoveredIndex;
            
            return (
              <div
                key={option.value}
                onClick={() => handleOptionSelect(option.value)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(-1)}
                className={`
                  px-3 py-2 cursor-pointer flex items-center justify-between cpu-text
                  ${isSelected || isHovered ? 'bg-cpu-gold' : ''}
                  ${index === 0 ? 'rounded-t-md' : ''}
                  ${index === options.length - 1 ? 'rounded-b-md' : ''}
                `}
              >
                <span className="cpu-blue">{option.label}</span>
                {isSelected && <Check className="w-4 h-4 cpu-blue" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}