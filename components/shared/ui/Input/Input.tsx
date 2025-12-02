import React, { useState, forwardRef, InputHTMLAttributes } from 'react';
import { Eye, EyeOff, ChevronDown } from 'lucide-react';
import classNames from '@/components/shared/utils/utils';
import cls from './Input.module.scss';

type InputMode = 'basic' | 'password' | 'phone' | 'verification';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  mode?: InputMode;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  success?: boolean;
  countryCode?: string;
  onSendCode?: () => void;
  placeholder?: string;
  formLabel?: boolean;
  inputClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      mode = 'basic',
      label,
      value,
      onChange,
      error,
      success,
      countryCode = '+380',
      onSendCode,
      placeholder,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [sent, setSent] = useState(false);

    const getBorderColor = () => {
      if (error) return cls.error;
      if (success) return cls.success;
      return cls.defaultBorder;
    };

    const handleSendCode = () => {
      if (onSendCode) onSendCode();
      setSent(true);
    };

    return (
      <div className={cls.wrapper}>
        {label && <label className={cls.label}>{label}</label>}

        {/* === BASIC INPUT === */}
        {mode === 'basic' && (
          <input
            {...props}
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={classNames(cls.input, getBorderColor())}
            placeholder={placeholder}
          />
        )}

        {/* === PASSWORD INPUT === */}
        {mode === 'password' && (
          <div className={classNames(cls.inputWrapper, getBorderColor())}>
            <input
              {...props}
              type={showPassword ? 'text' : 'password'}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder || 'Password'}
              className={cls.inputInner}
              ref={ref}
            />
            <button
              type="button"
              className={cls.iconButton}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        )}

        {/* === PHONE INPUT === */}
        {mode === 'phone' && (
          <div className={cls.phoneWrapper}>
            <div className={cls.countryBox}>
              <span>{countryCode}</span>
              <ChevronDown size={16} />
            </div>
            <input
              {...props}
              type="tel"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder || 'Phone number'}
              className={classNames(cls.inputPhone, getBorderColor())}
              ref={ref}
            />
          </div>
        )}

        {/* === VERIFICATION INPUT === */}
        {mode === 'verification' && (
          <div className={cls.verificationWrapper}>
            <input
              {...props}
              type="text"
              maxLength={6}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder || 'xxxxx'}
              className={classNames(cls.inputVerification, getBorderColor())}
              ref={ref}
            />
            <button
              type="button"
              onClick={handleSendCode}
              disabled={sent}
              className={classNames(cls.sendButton, { [cls.disabled]: sent })}
            >
              {sent ? 'Sent' : 'Send'}
            </button>
          </div>
        )}

        {error && <span className={cls.errorText}>{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
