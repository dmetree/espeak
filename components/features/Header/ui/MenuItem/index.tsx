import React, { useState } from 'react';
import s from './MenuItem.module.css';

interface MenuItemProps {
  icon: React.ReactNode; // ReactNode allows JSX elements or strings
  type: 'stroke' | 'fill'; // Restricting to the specific types used
  tooltip: string; // Tooltip text
  userRole?: string; // Optional if not used in the component
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  type,
  tooltip,
  userRole
}) => {

  const [isActive, setIsActive] = useState(false);

  const handleMouseEnter = () => {
    setIsActive(true);
  };

  const handleMouseLeave = () => {
    setIsActive(false);
  };

  return (
    <div
      className={`
        ${s.sidebar_item}
        ${type === 'stroke' ? s.stroke : s.fill}
        ${isActive ? s.active : ''}
    `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className={s.sidebar_icon}>{icon}</span>
      <span className={s.tooltipText}>{tooltip}</span>
    </div>
  );
};

export default MenuItem;
