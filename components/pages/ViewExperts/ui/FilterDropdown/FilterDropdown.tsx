import { useState, useRef, useEffect } from 'react';
import styles from './style.module.scss';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  selectedValue?: string;
  onChange?: (value: string) => void;
}

export function FilterDropdown({
  label,
  options,
  selectedValue,
  onChange,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleOptionClick = (value: string) => {
    onChange?.(value);
    setIsOpen(false);
  };

  return (
    <div className={styles.filterDropdown} ref={dropdownRef}>
      <button
        className={styles.dropdownButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className={styles.buttonText}>
          {selectedOption ? selectedOption.label : label}
        </span>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={isOpen ? styles.chevronUp : styles.chevronDown}
        >
          <path
            d={
              isOpen
                ? 'M18.75 15.375L12 8.625L5.25 15.375'
                : 'M5.25 8.625L12 15.375L18.75 8.625'
            }
            stroke="#161616"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          {options.map((option) => (
            <button
              key={option.value}
              className={styles.radioButton}
              onClick={() => handleOptionClick(option.value)}
              role="radio"
              aria-checked={selectedValue === option.value}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="7" cy="7" r="6.5" stroke="#3F3D56" />
                {selectedValue === option.value && (
                  <circle cx="7" cy="7" r="5" fill="#3F3D56" />
                )}
              </svg>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
