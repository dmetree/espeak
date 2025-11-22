import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import { setDraftAppointment } from '@/store/actions/appointments';

import s from './Session.module.scss';

import { FormWrapper } from '../../helpers/FormWrapper';

export function SessionSubject() {
  const dispatch = useDispatch();
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);
  const draftAppointment = useSelector(({ appointments }) => appointments.draftAppointment);


  const subjects = [
    'career_coaching',
    'business_coaching',
    'strange_feelings',
    'family_relationships',
    'sexual_relationships',
    'loneliness',
    'crypto_addiction',
    'social_media_addiction',
    'life_work_balance',
    'money_management',
    'supervision',
    'other',
  ];

  const handleItemClick = (selectedSubject) => {
    dispatch(setDraftAppointment({
      ...draftAppointment,
      subject: selectedSubject
    }));
  };

  return (
    <FormWrapper title={t.talk_title}>
      <div className={s.wrapper}>
        <div className={s.helpItems}>
          {subjects.map((subject) => (
            <div
              key={subject}
              className={`${s.helpItem} ${draftAppointment.subject === subject ? s.selected : ''
                }`}
              onClick={() => handleItemClick(subject)}
            >
              {t[subject]}
            </div>
          ))}
        </div>
      </div>
    </FormWrapper>
  );
}
