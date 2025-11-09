import React, { useContext } from 'react';
import { RadioButtonGroupContext } from './RadioButtonGroup';
import styles from './radioButton.module.scss';

interface RadioButtonProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const RadioButton: React.FC<RadioButtonProps> = ({
  value,
  children,
  disabled = false,
  className,
}) => {
  const context = useContext(RadioButtonGroupContext);

  if (!context) {
    throw new Error('RadioButton must be used within a RadioButtonGroup');
  }

  const { selectedValue, onValueChange } = context;
  const isSelected = selectedValue === value;

  const handleClick = () => {
    if (!disabled && !isSelected) {
      onValueChange(value);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || isSelected}
      className={[
        styles.base,
        isSelected ? styles.selected : styles.normal,
        disabled ? styles.disabled : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </button>
  );
};
