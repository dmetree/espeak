import { format } from 'date-fns';
import { FC, useEffect, useMemo, useState } from 'react';

import s from './TableDay.module.css';
import DayRow from './dayrow/DayRow';

import { THourSchedule } from '@/components/shared/types/index';
import { getRequestColor } from '@/components/shared/utils/req-color';

type THoursManagerProps = {
  currentDate: Date;
  selectedDaySchedule: THourSchedule[];
  specialistActualFreeTimeslots: any;
  onCellClick?: (hourSchedule: THourSchedule) => void;
};


const HoursManager: FC<THoursManagerProps> = ({
  currentDate,
  selectedDaySchedule,
  specialistActualFreeTimeslots,
  onCellClick,
}) => {
  const formattedDate = useMemo(
    () => format(currentDate, 'EEE MMM dd yyyy'),
    [currentDate]
  );

  const formattedCurrentDate = useMemo(
    () => format(currentDate, 'EEE MMM dd yyyy'),
    [currentDate]
  );

  const currentTime = new Date();
  const todayFormatted = format(currentTime, 'EEE MMM dd yyyy');


  const currentHour = currentTime.getHours();


  const handleSelectTime = (dayTimeActivityItem: THourSchedule) => {
    onCellClick && onCellClick(dayTimeActivityItem);
  };

  const dayView = selectedDaySchedule
    ?.filter((item) => item.mark !== 'busy')
    .map((item) => {
      const isPastHour = formattedCurrentDate === todayFormatted && item.hour < currentHour + 2;
      return (
        <DayRow
          key={item.hour}
          handleClick={isPastHour ? () => { } : () => handleSelectTime(item)} // Disable click for past hours
          hour={item.hour}
          mark={item.mark}
          // specialistActualFreeTimeslots={specialistActualFreeTimeslots}
          psyRequest={item.request}
          bgColor={getRequestColor(item?.request?.status)}
          request={item?.request}
          isPastHour={isPastHour}
        />
      );
    });

  return (
    <div className={s.tableDay}>
      <div className={s.selectedDay}>{formattedDate}</div>
      {dayView}
    </div>
  );
};

export default HoursManager;
