import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import classNames from '@/components/shared/utils/utils';
import cls from './Button.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  variant?: 'filled' | 'outlined' | 'text'; // Add more variants as needed
  circle_ring_ring?: boolean;
  circle?: boolean;
  loginWithGoogle?: boolean;
  square?: boolean;
  fullWidth?: boolean;
  size?: 's' | 'm' | 'l'; // Add more sizes as needed
  addonLeft?: React.ReactNode;
  addonRight?: React.ReactNode;
  color?: 'normal' | 'primary' | 'secondary'; // Add more colors as needed
  cancel?: boolean;
  backbtn?: boolean;
  lang_btn?: boolean;
  tiny?: boolean;
  profileBtn?: boolean;
  dayRowBtn?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    className,
    children,
    variant = 'filled',
    circle_ring_ring,
    circle,
    loginWithGoogle,
    square,
    disabled,
    fullWidth,
    size = 'm',
    addonLeft,
    addonRight,
    color = 'normal',
    cancel,
    backbtn,
    lang_btn,
    tiny,
    profileBtn,
    dayRowBtn,
    onClick,
    ...otherProps
  } = props;

  const mods = {
    [cls.dayRowBtn]: dayRowBtn,
    [cls.profileBtn]: profileBtn,
    [cls.tiny]: tiny,
    [cls.lang_btn]: lang_btn,
    [cls.backbtn]: backbtn,
    [cls.cancel]: cancel,
    [cls.circle_ring_ring]: circle_ring_ring,
    [cls.circle]: circle,
    [cls.loginWithGoogle]: loginWithGoogle,
    [cls.square]: square,
    [cls.disabled]: disabled,
    [cls.fullWidth]: fullWidth,
    [cls.withAddon]: Boolean(addonLeft) || Boolean(addonRight),
  };

  return (
    <button
      type="button"
      className={classNames(cls.Button, mods, [
        className,
        cls[variant],
        cls[size],
        cls[color],
      ])}
      disabled={disabled}
      onClick={onClick}
      {...otherProps}
      ref={ref}
    >
      <div className={cls.addonLeft}>{addonLeft}</div>
      {children}
      <div className={cls.addonRight}>{addonRight}</div>
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
