import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import classNames from '@/components/shared/utils/utils';
import cls from './Button.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  variant?: 'main' | 'secondary';
  size?: 's' | 'm' | 'l';
  fullWidth?: boolean;
  addonLeft?: React.ReactNode;
  addonRight?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = 'main',
      size = 'l',
      fullWidth = false,
      disabled = false,
      addonLeft,
      addonRight,
      onClick,
      ...otherProps
    },
    ref
  ) => {
    const mods = {
      [cls.fullWidth]: fullWidth,
      [cls.withAddon]: Boolean(addonLeft) || Boolean(addonRight),
    };

    return (
      <button
        ref={ref}
        type="button"
        className={classNames(cls.Button, mods, [
          className,
          cls[variant],
          cls[size],
        ])}
        disabled={disabled}
        onClick={onClick}
        {...otherProps}
      >
        {addonLeft && <span className={cls.addonLeft}>{addonLeft}</span>}
        <span className={cls.content}>{children}</span>
        {addonRight && <span className={cls.addonRight}>{addonRight}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
