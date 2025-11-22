import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import Calendar from '@/components/shared/ui/DatePicker/DatePicker';
import s from './Session.module.scss';
import { FormWrapper } from '../../helpers/FormWrapper';

export function SessionDate() {

  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);

  return (
    <FormWrapper title={t.when}>
      <div className={s.wrapper}>
        <Calendar />
      </div>
    </FormWrapper>
  );
}
