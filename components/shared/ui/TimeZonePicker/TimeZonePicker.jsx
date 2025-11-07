import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import spacetime from 'spacetime';

import s from './TimeZonePicker.module.css';

const TimeZonePicker = ({ timeZone, updateFields, handleTimeZoneChange }) => {
  const [isTimeZoneOptionsVisible, setTimeZoneOptionsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // State to hold the search query
  const [hoursOffset, setHoursOffset] = useState(null);
  const timeZones = spacetime.timezones();
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);

  const updateTZ = (zoneName, hoursOffset) => {
    if (updateFields) {
      updateFields({ timeZone: zoneName });
    }
    if (handleTimeZoneChange) {
      handleTimeZoneChange(zoneName);
      setHoursOffset(hoursOffset);
    }
    setTimeZoneOptionsVisible(false); // Close the time zone options
    setSearchQuery('');
  };

  const showTimezoneOptions = () => {
    setTimeZoneOptionsVisible(!isTimeZoneOptionsVisible);
  };

  // Filter time zones based on search query
  const filteredTimeZones = Object.entries(timeZones).filter(([zoneName, _]) =>
    zoneName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    // Get "(GMT+3)" from "Europe/Moscow"
    const currentTimeInTargetZone = spacetime.now(timeZone);
    const timeZoneOffsetMinutes = currentTimeInTargetZone.offset();
    const timeZoneOffsetHours = timeZoneOffsetMinutes / 60;
    setHoursOffset(timeZoneOffsetHours);
  }, [timeZone]);

  return (
    <div className={s.wrapper}>
      <div className={s.time_zone} onClick={() => showTimezoneOptions()}>
        {t.your_time_zone}
        <div className="">
          <b>
            (GMT{hoursOffset >= 0 ? `+${hoursOffset}` : `-${Math.abs(hoursOffset)}`}) {timeZone}
          </b>
        </div>
      </div>

      {isTimeZoneOptionsVisible && (
        <>
          <div className={`${s.options} ${isTimeZoneOptionsVisible ? s.active : ''}`}>
            <div>
              {filteredTimeZones.map(([zoneName, zoneInfo]) => {
                // Split zoneName by '/' and capitalize each part
                const capitalizedZoneName = zoneName
                  .split('/')
                  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                  .join('/');

                return (
                  <div
                    className={s.zoneItem}
                    key={zoneName}
                    onClick={() => updateTZ(capitalizedZoneName, zoneInfo.offset)}
                  >
                    (GMT
                    {zoneInfo.offset >= 0 ? `+${zoneInfo.offset}` : `-${Math.abs(zoneInfo.offset)}`}
                    ){` ${capitalizedZoneName}`}
                  </div>
                );
              })}
            </div>
          </div>
          {/* Search input */}
          <input
            type="text"
            placeholder="Search time zone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${s.searchInput} ${isTimeZoneOptionsVisible ? s.active : ''}`}
          />
        </>
      )}
    </div>
  );
};

export default TimeZonePicker;
