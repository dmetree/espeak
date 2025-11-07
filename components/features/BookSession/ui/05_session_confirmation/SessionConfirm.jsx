import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import { setDraftAppointment } from '@/store/actions/appointments';

import { ExpToPrice } from "@/components/shared/assets/expToPriceDictionary/ExpToPriceDictionary";
import { EGender } from '@/components/shared/types';

import s from './Session.module.css';

import { FormWrapper } from '../../helpers/FormWrapper';

export function SessionConfirm() {

  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);
  const draftAppointment = useSelector(({ appointments }) => appointments.draftAppointment);

  return (
    <FormWrapper title={t.check_and_confirm}>
      <div className={s.wrapper}>
        <div className={s.req_main}>
          <div className={s.main_item}>
            {t.subject}
            <b>{t[draftAppointment.subject]}</b>
          </div>
          <div className={s.main_item}>
            {t.date}
            <b>{draftAppointment.selectedDate}</b>
          </div>
          <div className={s.main_item}>
            {t.time}
            <b>
              {draftAppointment.selectedHour}:00 - {draftAppointment.selectedHour}:55
            </b>
          </div>
          <div className={s.main_item}>
            {t.consultant_rank}
            <b>
              {t.psyworker_lvl}
              {draftAppointment.psyRank}
            </b>
          </div>
          {/* {gender && (
            <div className={s.main_item}>
              {t.gender}
              <b>{EGender[gender]}</b>
            </div>
          )} */}
        </div>
        {/* <div className="">Age: {age}</div> */}
        {/* {prevPsy ? <div className={s.hide_req}>{t.hidden_request}</div> : ''} */}
        {draftAppointment.nickname ? (
          <div className={s.private}>
            {t.exclusive_sent}
            {draftAppointment.nickname}
          </div>
        ) : (
          ''
        )}
        <hr className={s.hr} />
        <div className={s.price_item}>
          {t.price}
          <div className={s.price}>$ {draftAppointment.price === null ? ExpToPrice[draftAppointment.psyRank] / 100 : draftAppointment.price / 100}</div>
        </div>

        <hr className={s.hr} />
        <div className={s.confirmation}>{t.agree_with_terms}</div>
      </div>
    </FormWrapper>
  );
}
