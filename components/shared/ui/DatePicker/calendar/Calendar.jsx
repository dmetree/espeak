import {
  add,
  differenceInDays,
  endOfMonth,
  format,
  setDate,
  startOfMonth,
  sub,
  isToday,
} from 'date-fns';
import React from 'react';

import s from './Calendar.module.scss';

import Cell from '../cell/Cell';

const weeks = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Calendar = ({
  value = new Date(),
  currentDate,
  setCurrentDate,
  onCellClick,
}) => {
  const startDate = startOfMonth(value);
  const endDate = endOfMonth(value);
  const numDays = differenceInDays(endDate, startDate) + 1;

  const prefixDays = startDate.getDay();
  const suffixDays = 6 - endDate.getDay();

  const prevMonth = () => setCurrentDate(sub(value, { months: 1 }));
  const nextMonth = () => setCurrentDate(add(value, { months: 1 }));
  // const prevYear = () => setCurrentDate(sub(value, { years: 1 }));
  // const nextYear = () => setCurrentDate(add(value, { years: 1 }));

  const handleClickDate = (index) => {
    const date = setDate(value, index);
    setCurrentDate(date);
  };

  const daysInMonth = Array.from({ length: numDays }).map((_, index) => {
    return index + 1;
  });

  return (
    <div className={s.calendar}>
      <div className={s.wrapper}>
        {/* <Cell onClick={prevYear}>{"<<"}</Cell> */}
        <Cell className={s.prev_next} onClick={prevMonth}>
          {'<'}
        </Cell>
        <Cell className={`${s.yearMonth}`}>{format(value, 'LLLL yyyy')}</Cell>
        <Cell className={s.prev_next} onClick={nextMonth}>
          {'>'}
        </Cell>
        {/* <Cell onClick={nextYear}>{">>"}</Cell> */}

        {weeks.map((week) => (
          <Cell key={week} className={`${s.dayOfWeek}`} isDayOfWeek={true}>
            {week}
          </Cell>
        ))}

        {Array.from({ length: prefixDays }).map((_, index) => (
          <Cell
            key={`empty-${index}`}
            isDisabled={true} // Disable empty cells
          />
        ))}

        {daysInMonth.map((date) => {
          const isCurrentDate = date === value.getDate();
          const isSelectedDate = currentDate && date === currentDate.getDate();
          const isPastDate =
            new Date(value.getFullYear(), value.getMonth(), date + 1) <
            new Date();
          const isTodayDate = isToday(
            new Date(value.getFullYear(), value.getMonth(), date)
          ); // Check if it's today's date

          return (
            <Cell
              key={date}
              isActive={isCurrentDate}
              isSelected={isSelectedDate}
              isDisabled={isPastDate}
              className={isTodayDate ? s.today : ''} // Add the s.today class if it's today's date
              onClick={() => {
                if (!isPastDate) {
                  handleClickDate(date);
                  onCellClick();
                }
              }}
            >
              {date}
            </Cell>
          );
        })}

        {Array.from({ length: suffixDays }).map((_, index) => (
          <Cell
            key={`empty-${index + prefixDays + daysInMonth.length}`}
            isDisabled={true} // Disable empty cells
          />
        ))}
      </div>
    </div>
  );
};

export default Calendar;
