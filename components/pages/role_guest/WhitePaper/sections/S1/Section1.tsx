import React from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import s from './.module.scss';

import FaceOne from '@/components/shared/assets/img/head_01.webp';


const Section1 = () => {
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);

  return (
    <div className={s.s1}>
      <div className={s.vision_wrap}>
        <h2 className={s.s_h}>{t.aim}</h2>
        <p className={s.vision_text}>{t.aim_details}</p>
      </div>
      <Image className={s.vision_img} src={FaceOne} alt='image' loading="lazy"/>
    </div>
  );
};

export default Section1;
