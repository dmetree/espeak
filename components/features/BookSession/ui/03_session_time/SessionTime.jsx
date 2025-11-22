import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';

import { FormWrapper } from '@/components/features/BookSession/helpers/FormWrapper';
import TimePicker from '@/components/features/BookSession/ui/03_session_time/ui/TimePicker/TimePicker';
import TimeZonePicker from '@/components/shared/ui/TimeZonePicker/TimeZonePicker';

import s from './Session.module.css';

export function SessionTime({
  selectedDate,
  timeZone,
  gmtFormat,
  updateFields,
}) {
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);
  return (
    <FormWrapper title={t.what_time}>
      <div className={s.wrapper}>
        <TimePicker
          selectedDate={selectedDate}
          timeZone={timeZone}
          updateFields={updateFields}
        />

        {/* <div className="">
          Your Timezone: {gmtFormat} {timeZone}
        </div> */}
        {/* <TimeZonePicker
                    timeZone={timeZone}
                    timeZoneOffsetHours={timeZoneOffsetHours}
                    updateFields={updateFields} /> */}
      </div>
    </FormWrapper>
  );
}
