import { useEffect, useRef, useState } from 'react';

import s from './Tooltip.module.css';

export const Tooltip = (props) => {
  const { className, title, ...other } = props;

  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef();

  useEffect(() => {
    const closeTooltipOnOutsideClick = (e) => {
      // @ts-ignore
      if (tooltipRef.current && !tooltipRef.current.contains(e.target)) {
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
