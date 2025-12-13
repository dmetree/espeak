import React, { useId } from 'react';
import classNames from '@/components/shared/utils/utils';
import s from './loader.module.scss';

type LoaderProps = {
  className?: string;
  /** Diameter in px */
  size?: number;
  /** Makes the wrapper fill the viewport and center the spinner */
  fullScreen?: boolean;
  ariaLabel?: string;
};

export default function Loader({
  className,
  size = 64,
  fullScreen = true,
  ariaLabel = 'Loading',
}: LoaderProps) {
  const gradientId = useId();

  return (
    <div
      className={classNames(s.wrapper, { [s.fullScreen]: fullScreen }, [className])}
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
    >
      <svg
        className={s.spinner}
        width={size}
        height={size}
        viewBox="0 0 50 50"
        focusable="false"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0965c8" />
            <stop offset="50%" stopColor="#1945f3" />
            <stop offset="100%" stopColor="#0a0dbd" />
          </linearGradient>
        </defs>

        <circle
          className={s.circle}
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="5"
        />
      </svg>

      <span className={s.srOnly}>{ariaLabel}</span>
    </div>
  );
}
