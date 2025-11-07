import { format } from 'date-fns';
import { FC, useEffect, useMemo, useState } from 'react';

import s from './TableDay.module.css';
import DayRow from './dayrow/DayRow';

import { THourSchedule } from '@/components/shared/types/index';
import { getRequestColor } from '@/components/shared/utils/req-color';

type THoursManagerProps = {
  currentDate: Date;
  selectedDaySchedule: THourSchedule[];
  onCellClick?: (hourSchedule: THourSchedule) => void;
};


const HoursManager: FC<THoursManagerProps> = ({
  currentDate,
  selectedDaySchedule,
  // specialistActualFreeTimeslots,
  onCellClick,
}) => {



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


  const dayView = selectedDaySchedule?.map((item) => {
    const isPastHour = formattedCurrentDate === todayFormatted && item.hour < currentHour + 2;

    return (
      <DayRow
        key={item.hour}
        isPastHour={isPastHour}
        handleClick={isPastHour ? () => { } : () => handleSelectTime(item)} // Disable click for past hours
        hour={item.hour}
        mark={item.mark}
        bgColor={getRequestColor(item?.request?.status)}
        request={item?.request}
      />
    );
  });

  return (
    <div className={s.tableDay}>
      <div className={s.selectedDay}>{formattedCurrentDate}</div>
      {dayView}
    </div>
  );
};

export default HoursManager;
