import { useState, useRef, useEffect } from 'react';
import styles from './style.module.scss';

interface PriceRangeFilterProps {
  minPrice?: number;
  maxPrice?: number;
  onChange?: (min: number, max: number) => void;
}

export function PriceRangeFilter({
  minPrice = 4,
  maxPrice = 80,
  onChange,
}: PriceRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [min, setMin] = useState(minPrice);
  const [max, setMax] = useState(maxPrice);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleMinChange = (value: number) => {
    const newMin = Math.min(value, max - 1);
    setMin(newMin);
    onChange?.(newMin, max);
  };

  const handleMaxChange = (value: number) => {
    const newMax = Math.max(value, min + 1);
    setMax(newMax);
    onChange?.(min, newMax);
  };

  const minPercent = ((min - 4) / (80 - 4)) * 100;
  const maxPercent = ((max - 4) / (80 - 4)) * 100;

  return (
    <div className={styles.priceRangeFilter} ref={dropdownRef}>
      <button
        className={styles.dropdownButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>Lesson price</span>
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
          <div className={styles.sliderContainer}>
            <div className={styles.sliderTrack}>
              <div
                className={styles.sliderRange}
                style={{
                  left: `${minPercent}%`,
                  width: `${maxPercent - minPercent}%`,
                }}
              />
              <input
                type="range"
                min="4"
                max="80"
                value={min}
                onChange={(e) => handleMinChange(Number(e.target.value))}
                className={styles.sliderThumb}
                aria-label="Minimum price"
              />
              <input
                type="range"
                min="4"
                max="80"
                value={max}
                onChange={(e) => handleMaxChange(Number(e.target.value))}
                className={styles.sliderThumb}
                aria-label="Maximum price"
              />
            </div>
            <div className={styles.priceLabel}>
              {min}$-{max}$
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
