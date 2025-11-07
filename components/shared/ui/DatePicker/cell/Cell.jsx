import s from './Cell.module.css';

const Cell = ({
  onClick,
  children,
  className,
  isActive = false,
  isSelected = false,
  isDisabled = false,
  isDayOfWeek = false,
}) => {
  const cellClasses = `${s.cell} ${className} ${isSelected ? s.selected : ''} ${
    isDisabled ? s.disabled : ''
  } ${isDayOfWeek ? s.dayOfWeek : ''}`;

  return (
    <div onClick={!isDisabled ? onClick : undefined} className={cellClasses}>
      {children}
    </div>
  );
};

export default Cell;
