import React from 'react';
import { Input } from '@/components/shared/ui/Input/Input';
import s from './../.module.scss';

type Props = {
  price: string;
  onChange: (value: string) => void;
  t: any;
};

const PriceInput: React.FC<Props> = ({ price, onChange, t }) => (
  <div className={s.priceWrapper}>
    <label className={s.label}>{t.specialist_price}</label>
    <div className={s.inputContainer}>
      <span className={s.inputPrefix}>$</span>
      <Input
        className={s.serviceParamInput}
        type="number"
        name="price"
        value={price}
        onChange={(e) => onChange((e.target as HTMLInputElement).value)}
        placeholder="5"
      />
    </div>
  </div>
);

export default PriceInput;
