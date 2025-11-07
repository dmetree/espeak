import React from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import s from './.module.scss';

import VisionImg from '@/components/shared/assets/img/vision.webp';



const Section4 = () => {
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);

  return (
    <div className={s.s2}>
      <Image className={s.solution_img} src={VisionImg} alt="Vision" loading="lazy"/>
      <div className={s.solution_text_block}>
        <h2 className={s.s_h}>{t.solution}</h2>
        <div className={s.solution_items}>
          <p className={s.solution_text}>{t.solution_text_1}</p>
          <p className={s.solution_text}>{t.solution_text_2}</p>
          <p className={s.solution_text}>{t.solution_text_3}</p>
        </div>
      </div>
    </div>
  );
};

export default Section4;
