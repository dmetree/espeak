import { useEffect, useRef, useState } from 'react';

import s from './Tooltip.module.css';

export const Tooltip = (props) => {
  const { className, title, ...other } = props;

  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const closeTooltipOnOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (tooltipRef.current && target && !tooltipRef.current.contains(target)) {
        setIsVisible(false);
      }
    };

    document.addEventListener('click', closeTooltipOnOutsideClick);

    return () => {
      document.removeEventListener('click', closeTooltipOnOutsideClick);
    };
  }, []);

  return (
    <div className={s.tooltipWrapper} ref={tooltipRef}>
      <div className={s.tooltipToggle} onClick={() => setIsVisible(!isVisible)}></div>
      {isVisible ? <div className={s.tooltip}>{title}</div> : ''}
    </div>
  );
};
