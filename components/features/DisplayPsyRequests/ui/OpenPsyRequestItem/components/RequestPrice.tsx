import React from 'react';
import { ExpToPrice } from '@/components/shared/assets/expToPriceDictionary/ExpToPriceDictionary';
import s from '../OpenPsyRequestItem.module.css';

export const RequestPrice = ({ psyRank, price, t }) => (
  <div className={`${s.expPrice} ${s.col3}`}>
    {/* <div className={s.reqField}>{t.exp} {psyRank}</div> */}
    <div className={s.price}>$ {price ? price / 100 : ExpToPrice[psyRank] / 100}</div>
  </div>
);
