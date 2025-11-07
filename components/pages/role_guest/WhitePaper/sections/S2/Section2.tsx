import React from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import s from './.module.scss';

import FaceTwo from '@/components/shared/assets/img/head_02.webp';

const Section2 = () => {
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);

  return (
    <div className={s.s2}>
      <Image className={s.demand_img} src={FaceTwo} alt='image' loading="lazy"/>
      <div className={s.demand_wrap}>
        <h2 className={s.s_h}>{t.demand}</h2>
        <div className={s.demand_items}>
          <p className={s.demand_text}>{t.demand_details_1}</p>
          <p className={s.demand_text}>{t.demand_details_2}</p>
        </div>
      </div>
    </div>
  );
};

export default Section2;
