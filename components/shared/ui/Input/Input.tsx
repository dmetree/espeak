import React, { forwardRef, HTMLAttributes } from 'react';

import classNames from '@/components/shared/utils/utils';

import cls from './Input.module.css';

type TInputProps = Partial<{
  label: string;
  type: string;
  value: string;
  placeholder: string;
  inputClassName: string;
  labelClassName: string;
  visuallyHidden: boolean;
  formLabel: string | boolean;
  required?: boolean;
  min?: string;
  max?: string;
  readOnly?: boolean; // Add this line
}> &
  HTMLAttributes<HTMLInputElement> & {
    name?: string;
  };

export const Input = forwardRef<HTMLInputElement, TInputProps>(
  (
    {
      label,
      type = 'text',
      id,
      value,
      placeholder,
      inputClassName,
      labelClassName,
      visuallyHidden = false,
      formLabel,
      ...props
    },
    ref
  ) => {
    // Handle class modifiers for the label
    const labelMods = {
      [cls.visuallyHidden]: visuallyHidden,
      [cls.formLabel]: !!formLabel, // Convert formLabel to boolean for classNames
    };

    return (
      <div className={cls.inputWrapper}>
        {/* Only render the label if formLabel is truthy */}
        {formLabel && (
          <label
            className={classNames(cls.Label, labelMods, [labelClassName])}
            htmlFor={id}
          >
            {typeof formLabel === 'string' ? formLabel : label}
          </label>
        )}
        <input
          className={classNames(cls.Input, {}, [inputClassName])}
          id={id}
          ref={ref}
          value={value}
          type={type}
          placeholder={placeholder}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';
