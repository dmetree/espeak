import React from 'react';
import s from '../OpenPsyRequestItem.module.css';

export const RequestPrice = ({ price}) => (
  <div className={`${s.expPrice} ${s.col3}`}>
    {/* TODO: convertion in USD */}
    <div className={s.price}> {(price / 100)} ADA</div>
  </div>
);
