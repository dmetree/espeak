import React from 'react';
import { useRouter } from 'next/router';

import s from './SidebarItem.module.scss';

const SidebarItem = ({
  icon,
  title,
  linkto,
  isActive,
  isSidebarOpen,     // Mobile: boolean
  sidebarWidth,      // Desktop: e.g. '60px'
  tooltip,           // Optional: only used when sidebar is collapsed
  showBell = false
}) => {
  const router = useRouter();
  const onClickHandler = () => {
    router.push(linkto);
  };

  // Determine narrow mode based on either prop
  const isNarrow = sidebarWidth === '60px' || isSidebarOpen === false;

  return (
    <div
      className={`${s.sidebar_item} ${isActive ? s.active : ''} ${isNarrow ? s.narrowItem : ''}`}
      onClick={onClickHandler}
    >
      <span className={s.sidebar_icon}>{icon}</span>
      <span className={`${s.item_text} ${isActive ? s.active : ''} ${isNarrow ? s.narrowText : ''}`}>
        {title}
      </span>
      {showBell && <span className={`${s.bellIcon} ${s.showBell}`}>🔔</span>}

      {isNarrow && tooltip && (
        <span className={s.tooltipText}>{tooltip}</span>
      )}
    </div>
  );
};

export default SidebarItem;
