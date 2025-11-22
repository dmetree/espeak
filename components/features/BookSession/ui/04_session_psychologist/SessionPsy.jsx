import React, { useState, useMemo, useCallback, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import { setDraftAppointment } from '@/store/actions/appointments';

// import GenderSelector from '@/domains/app/components/GenderSelector/GenderSelector';
import { FormWrapper } from '../../helpers/FormWrapper';
import { ExpToPrice } from "@/components/shared/assets/expToPriceDictionary/ExpToPriceDictionary";
import Image from 'next/image';


import Button from "@/components/shared/ui/Button";
import { Input } from '@/components/shared/ui/Input/Input';
import { Tooltip } from '@/components/shared/ui/Tooltip/Tooltip';

import s from './Session.module.css';

export function SessionPsy() {

  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const draftAppointment = useSelector(({ appointments }) => appointments.draftAppointment);
  const t = loadMessages(currentLocale);
  const dispatch = useDispatch();




  const plusRank = useCallback(
    (e) => {
      e.preventDefault();
      if (draftAppointment.psyRank < 10)
        dispatch(setDraftAppointment({
          ...draftAppointment,
          psyRank: draftAppointment.psyRank + 1,
          price: ExpToPrice[draftAppointment.psyRank + 1],
        }));
    },
    [draftAppointment.psyRank]
  );

  const minusRank = useCallback(
    (e) => {
      e.preventDefault();
      if (draftAppointment.psyRank > 1)
        dispatch(setDraftAppointment({
          ...draftAppointment,
          psyRank: draftAppointment.psyRank - 1,
          price: ExpToPrice[draftAppointment.psyRank - 1],
        }));
    },
    [draftAppointment.psyRank]
  );

  // const handleGenderChange = useCallback(
  //   (newGender) => updateFields({ gender: newGender }),
  //   [updateFields]
  // );


  return (
    <FormWrapper title={t.with_who}>
      <div className={s.wrapper}>
        <div className={s.exp}>
          <Button className={s.expBtn} onClick={minusRank}>
            - {t.less}
          </Button>
          <div className={s.priceExpGr}>
            <div className={s.expWrapper}>
              <label className={s.expLabel}>
                {t.rank_level}
                <Tooltip title={t.exp_level_tooltip} />
              </label>

            </div>
            <div className={s.priceWrapper}>
              <label>{t.price}</label>
              <div className={s.priceRank}>${ExpToPrice[draftAppointment.psyRank] / 100}</div>
            </div>
          </div>
          <Button className={s.expBtn} onClick={plusRank}>
            + {t.more}
          </Button>
        </div>

        {/* TODO: Add with logic later  */}
        {/* <GenderSelector
                    gender={gender}
                    setgender={setgender}
                /> */}

        {/* <div className="">
                    <label>Age: {age}</label>
                    <div className="">Age // range</div>
                    <div className="">Doesn't matter</div>
                </div> */}

        {/* TODO: Add with logic later  */}
        {/* <div
                    className={prevPsy ? s.excludePsyTrue : s.excludePsyFalse}
                    onClick={() => setPrevPsy()}
                >{t('hide')}
                </div> */}

        {/* <hr /> */}

        {/* TODO: move to a separate feature*/}
        {/* <div className="">{t('or')}</div>
                <div className={s.byNick}>
                    <Input
                        label={t('select_by_nickname')}
                        id="selectByNickname"
                        type="text"
                        value={nickname}
                        onChange={e => updateFields({ nickname: e.target.value })}
                    />
                </div> */}
      </div>
    </FormWrapper>
  );
}
