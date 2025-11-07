// components/Profile/GenderSelectorBlock.tsx
import React from 'react';
import GenderSelector from '@/components/shared/ui/GenderSelector/GenderSelector';
import s from './../.module.scss';

type Props = {
  gender: string;
  onChange: (value: string) => void;
  t: any;
};

const GenderSelectorBlock: React.FC<Props> = ({ gender, onChange, t }) => {
  return (
    <div className={s.formLabel}>
      <label className={`${s.formLabelTitle} ${s.labelWithTooltip}`}>{t.your_gender}</label>
      <GenderSelector gender={gender} setgender={onChange} />
    </div>
  );
};

export default GenderSelectorBlock;
