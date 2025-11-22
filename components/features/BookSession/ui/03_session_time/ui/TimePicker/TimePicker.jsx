
import React, { useState, useEffect } from 'react';

import spacetime from 'spacetime';

import { useDispatch, useSelector } from "react-redux";
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import { fetchMyAppointments, setDraftAppointment } from '@/store/actions/appointments';


import s from './TimePicker.module.css';

const TimePicker = () => {
  const dispatch = useDispatch();
  const userUid = useSelector(({ user }) => user.uid);
  const myAppointments = useSelector(({ appointments }) => appointments.myAppointments);
  const draftAppointment = useSelector(({ appointments }) => appointments.draftAppointment);

  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);

  const isTimeSlotBooked = (item) => {
    const selectedTime = spacetime(draftAppointment.selectedDate).hour(item).startOf('hour');
    const selectedTimeUnix = selectedTime.epoch / 1000;
    return myAppointments.some(
      (request) => request.scheduledUnixtime === selectedTimeUnix
    );
  };

  const isTimeSlotPastHour = (item) => {
    const currentTime = spacetime.now();
    const currentHour = currentTime.hour();
    const currentDay = currentTime.date();
    const currentMonth = currentTime.month();
    const currentYear = currentTime.year();

    const slotTime = spacetime(draftAppointment.selectedDate).hour(item).startOf('hour');
    const slotHour = slotTime.hour();
    const slotDay = slotTime.date();
    const slotMonth = slotTime.month();
    const slotYear = slotTime.year();

    return (
      slotYear < currentYear ||
      (slotYear === currentYear &&
        (slotMonth < currentMonth ||
          (slotMonth === currentMonth &&
            (slotDay < currentDay ||
              (slotDay === currentDay && slotHour < currentHour + 2)))))
    );
  };

  const timeCells = Array.from({ length: 24 }, (_, i) => i);

  const handleSelectTime = (item) => {
    dispatch(setDraftAppointment({
      ...draftAppointment,
      selectedHour: item
    }));
  };

  useEffect(() => {
    if (userUid) {
      dispatch(fetchMyAppointments(userUid));
    }
  }, [userUid]);



  const dayView = timeCells.map((item) => {
    const isPastTime = isTimeSlotPastHour(item);
    const isBooked = isTimeSlotBooked(item);

    return (
      <div
        key={item}
        className={`${s.hourCell} ${isPastTime ? s.disabled : ''} ${isBooked ? s.booked : ''
          } ${draftAppointment.selectedHour === item ? s.selected : ''}`}
        onClick={() => handleSelectTime(item)}
      >
        {item}:00
      </div>
    );
  });

  return (
    <div className={s.wrapper}>
      <div className={s.dayView}>{dayView}</div>
      <h6 className={s.session_time}>{t.session_time}</h6>
    </div>
  );
};

export default TimePicker;
