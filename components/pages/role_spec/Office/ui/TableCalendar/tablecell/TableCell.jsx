import s from './TableCell.module.css';

import { StatusIndicators } from '@/components/shared/status-indicator';

const TableCell = ({
  onClick,
  children,
  className,
  statuses,
  isActive = false,
  isSelected = false,
  isDisabled = false,
  isDayOfWeek = false,
  specHasFreeTimeslot,
}) => {
  const cellClasses = `${s.cell} 
    ${className} 
    ${isSelected ? s.selected : ''} 
    ${isDisabled ? s.disabled : ''} 
    ${isDayOfWeek ? s.dayOfWeek : ''}
    ${specHasFreeTimeslot ? s.specHasFreeTimeslot : ''}`;


  return (
    <div onClick={!isDisabled ? onClick : undefined} className={cellClasses}>
      {children}
      {statuses && <StatusIndicators statuses={statuses} />}
    </div>
  );
};

export default TableCell;
