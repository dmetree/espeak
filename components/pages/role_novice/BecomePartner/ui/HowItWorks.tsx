import React from 'react';
import s from './../.module.scss';

type Props = {
  t: any;
};

export const HowItWorks = ({ t }: Props) => (
  <div className={s.start_wrap}>
    <h3 className={s.h3}>{t.how_it_work}</h3>

    <div>{t.how_it_work_one}</div>

    {/* Uncomment if you want to show this text in future */}
    {/* <div>{t.not_only}</div>
    <br /> */}

    <div>{t.how_it_work_two}</div>
    <div>
        {t.how_it_work_two_instr}
        <ul className={s.list}>
            <li>{t.how_it_work_two_instr_one}</li>
            <li>{t.how_it_work_two_instr_two}</li>
        </ul>
    </div>

  </div>
);
