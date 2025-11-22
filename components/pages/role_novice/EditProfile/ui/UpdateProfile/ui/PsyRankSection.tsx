import React from 'react';
import Button from '@/components/shared/ui/Button';
import s from './../.module.scss';

type Props = {
  isAlive: boolean;
  t: any;
};

const PsyRankSection: React.FC<Props> = ({ isAlive, t }) => {

  console.log("Is alive? ", isAlive)
  return (
    <div className={s.psyRankWrapper}>
      <div className={s.formLabel}>
        <span className={s.formLabelTitle}>
          {/* {t.email} */}
          This user is alive: </span>
        <span>{isAlive ? "Yes" : "No"}</span>
        {/* <strong>{isAlive}</strong> */}
      </div>
      {/* <Button size="s">{t.apply_rank}</Button> */}
    </div>
  );
};

export default PsyRankSection;
