import {
  add,
  addHours,
  differenceInDays,
  endOfMonth,
  format,
  setDate,
  startOfDay,
  startOfMonth,
  sub,
  isToday,
} from 'date-fns';
import { useTranslation } from 'react-i18next';

import s from './Calendar.module.css';
import Cell from './tablecell/TableCell';

const weeks = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const FreeDaysCalendar = ({
  value,
  currentDate,
  setCurrentDate,
  freeHours,
  onCellClick,
}) => {
  const { t } = useTranslation();
  const startDate = startOfMonth(value);
  const endDate = endOfMonth(value);
  const numDays = differenceInDays(endDate, startDate) + 1;

  const prefixDays = startDate.getDay();
  const suffixDays = 6 - endDate.getDay();

  const prevMonth = () => setCurrentDate(sub(value, { months: 1 }));
  const nextMonth = () => setCurrentDate(add(value, { months: 1 }));

  const handleClickDate = (index) => {
    const date = setDate(value, index);
    setCurrentDate(date);
  };

  const daysInMonth = Array.from({ length: numDays }).map((_, index) => {
    return index + 1;
  });

  return (
    <div className={s.calendar}>
      <div className={s.scheduledCalls}>{t('specialist_free_hours')}</div>
      <div className={s.wrapper}>
        <Cell className={s.prev_next} onClick={prevMonth}>
          {'<'}
        </Cell>
        <Cell className={`${s.yearMonth}`}>{format(value, 'LLLL yyyy')}</Cell>
        <Cell className={s.prev_next} onClick={nextMonth}>
          {'>'}
        </Cell>

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

          const startOfDayUnixTime = Math.floor(
            startOfDay(
              new Date(value.getFullYear(), value.getMonth(), date)
            ).getTime() / 1000
          );
          const endOfDayUnixTime = Math.floor(
            addHours(startOfDayUnixTime * 1000, 24).getTime() / 1000
          );

          const hasFreeHours = freeHours?.some((freeHourUnixTime) => {
            return (
              freeHourUnixTime >= startOfDayUnixTime &&
              freeHourUnixTime < endOfDayUnixTime
            );
          });

          return (
            <Cell
              key={date}
              isActive={isCurrentDate}
              isSelected={isSelectedDate}
              isDisabled={isPastDate || !hasFreeHours}
              hasFreeHours={hasFreeHours}
              className={isTodayDate ? s.today : ''} // Add the s.today class if it's today's date
              onClick={() => {
                if (!isPastDate) {
                  handleClickDate(date);
                  onCellClick && onCellClick();
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
      <span className={s.markOpenHours}>{t('specialist_free_hours_desc')}</span>
    </div>
  );
};
