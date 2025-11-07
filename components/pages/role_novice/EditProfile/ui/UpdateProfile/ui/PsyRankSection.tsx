import React from 'react';
import Button from '@/components/shared/ui/Button';
import s from './../.module.scss';

type Props = {
  psyRank: number;
  t: any;
};

const PsyRankSection: React.FC<Props> = ({ psyRank, t }) => {
  return (
    <div className={s.psyRankWrapper}>
      <div className={s.formLabel}>
        <span className={s.formLabelTitle}>{t.your_psy_rank} </span>
        <strong>{psyRank}</strong>
      </div>
      {/* <Button size="s">{t.apply_rank}</Button> */}
    </div>
  );
};

export default PsyRankSection;
