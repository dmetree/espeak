import React from 'react';
import s from '../OpenPsyRequestItem.module.css';

export const RequestDateTime = ({ isTimeZoneLoaded, isDateTimeLoaded, reqDate, reqTime, t }) => (
  <div className={`${s.dateTime} ${s.col2}`}>
    {isTimeZoneLoaded ? (
      isDateTimeLoaded && reqDate && reqTime ? (
        <div className={`${s.reqField} ${s.date}`}>
          {reqTime}<br />{reqDate}
        </div>
      ) : (
        <div>{t.loading}</div>
      )
    ) : (
      <div>{t.loading}</div>
    )}
  </div>
);
