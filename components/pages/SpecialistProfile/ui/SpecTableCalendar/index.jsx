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

import { Tooltip } from '@/components/shared/ui/Tooltip/Tooltip';
import { useDispatch, useSelector } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';

import s from './Calendar.module.css';
import Cell from './tablecell/TableCell';

const weeks = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const TableCalendar = ({
  currentDate,
  setCurrentDate,
  displayList,
  onCellClick,
  freeTimestamps,
  specialistActualFreeTimeslots
}) => {
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);

  const startDate = startOfMonth(currentDate);
  const endDate = endOfMonth(currentDate);
  const numDays = differenceInDays(endDate, startDate) + 1;

  const prefixDays = startDate.getDay();
  const suffixDays = 6 - endDate.getDay();

  const prevMonth = () => setCurrentDate(sub(currentDate, { months: 1 }));
  const nextMonth = () => setCurrentDate(add(currentDate, { months: 1 }));

  const handleClickDate = (index) => {
    const date = setDate(currentDate, index);
    setCurrentDate(date);
  };

  const daysInMonth = Array.from({ length: numDays }).map((_, index) => {
    return index + 1;
  });

  const currentTime = new Date();
  const formattedCurrentMonth = format(currentTime, 'LLLL yyyy');
  const formattedDisplayedMonth = format(currentDate, 'LLLL yyyy');


  return (
    <div className={s.calendar}>
      {/* <div className={s.scheduledCalls}>{t.scheduled_calls}</div> */}
      <div className={s.wrapper}>
        <Cell
          className={`${s.prev_next} ${formattedCurrentMonth === formattedDisplayedMonth ? s.prevMonthDisabled : ''}`}
          onClick={formattedCurrentMonth === formattedDisplayedMonth ? null : prevMonth}
        >
          {'<'}
        </Cell>
        <Cell className={`${s.yearMonth}`}>
          {format(currentDate, 'LLLL yyyy')}
        </Cell>
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
          const isCurrentDate = date === currentDate.getDate();

          const isFreeTimeslot =
            freeTimestamps &&
            freeTimestamps.some(
              (freeTimestamp) =>
                new Date(freeTimestamp * 1000).getDate() === date
            );

          const startOfDayUnixTime = Math.floor(
            startOfDay(
              new Date(currentDate.getFullYear(), currentDate.getMonth(), date)
            ).getTime() / 1000
          );
          // console.log("Start of day Unix time:", startOfDayUnixTime);

          const endOfDayUnixTime = Math.floor(
            addHours(startOfDayUnixTime * 1000, 24).getTime() / 1000
          );
          // console.log("End of day Unix time:", endOfDayUnixTime);

          const isSelectedDate = currentDate && date === currentDate.getDate();
          const isPastDate =
            new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              date + 1
            ) < new Date();
          const isTodayDate = isToday(
            new Date(currentDate.getFullYear(), currentDate.getMonth(), date)
          ); // Check if it's today's date


          const todayUnixTime = Math.floor(startOfDay(new Date()).getTime() / 1000);

          const specHasFreeTimeslot = specialistActualFreeTimeslots?.some(
            (timestamp) =>
              timestamp >= todayUnixTime && // Ensure the timestamp is not in the past
              timestamp >= startOfDayUnixTime &&
              timestamp < endOfDayUnixTime
          );

          const reqsForCurrentDay = displayList?.filter(
            ({ scheduledUnixtime }) => {
              const itemUnixTime = scheduledUnixtime;

              return (
                itemUnixTime >= startOfDayUnixTime &&
                itemUnixTime < endOfDayUnixTime
              );
            }
          );

          const statuses = reqsForCurrentDay
            ? reqsForCurrentDay.map(({ status }) => status)
            : undefined;

          return (
            <Cell
              key={date}
              isActive={isCurrentDate}
              isSelected={isSelectedDate}
              isDisabled={isPastDate}
              statuses={statuses}
              specHasFreeTimeslot={specHasFreeTimeslot}
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

      <div className={s.toolTipBox}>
        <Tooltip title={t.spec_open_hours} />
      </div>
    </div>
  );
};

export default TableCalendar;
