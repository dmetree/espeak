import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';

import s from './GenderSelector.module.css';

const GenderSelector = ({ gender, setgender }) => {
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);

  return (
    <div className={s.gender}>
      {[
        { label: `${t.male}`, value: 1 },
        { label: `${t.female}`, value: 2 },
        { label: `${t.no_gender}`, value: 0 },
      ].map((option) => (
        <div
          key={option.value}
          className={gender === option.value ? s.genderOn : s.genderOff}
          onClick={() => setgender(option.value)}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
};

export default GenderSelector;
