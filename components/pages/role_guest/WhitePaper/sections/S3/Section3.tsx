import React from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import s from './.module.scss';

import Man01 from '@/components/shared/assets/img/faces/man_01.webp';
import Man02 from '@/components/shared/assets/img/faces/man_02.webp';
import Man03 from '@/components/shared/assets/img/faces/man_03.webp';
import Woman01 from '@/components/shared/assets/img/faces/woman_01.webp';
import Woman02 from '@/components/shared/assets/img/faces/woman_02.webp';
import Woman03 from '@/components/shared/assets/img/faces/woman_03.webp';


const Section3 = () => {
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);

  return (
    <div className={s.problems}>
      <h2 className={`${s.problems_title} ${s.s_h}`}>{t.problems_title}</h2>
      <div className={s.s_items}>
        <div className={`${s.s_item} ${s.s_row1}`}>
          <span className={s.s_number}>1</span>
          <div className={s.s_item_w}>
            <h4 className={s.s_inner_title}>{t.problem_title_1}</h4>
            <p className={s.problems_text}>{t.problem_text_1}</p>
          </div>
        </div>

        <Image className={s.man_01} src={Man01} alt="Man01" loading="lazy"/>

        <div className={s.s_item + ` ` + s.s_row2}>
          <span className={s.s_number}>2</span>
          <div className={s.s_item_w}>
            <h4 className={s.s_inner_title}>{t.problem_title_2}</h4>
            <p className={s.problems_text}>{t.problem_text_2}</p>
          </div>
        </div>

        <Image className={s.woman_01} src={Woman01} alt="Man01" loading="lazy"/>

        <div className={s.s_item + ` ` + s.s_row3}>
          <span className={s.s_number}>3</span>
          <div className={s.s_item_w}>
            <h4 className={s.s_inner_title}>{t.problem_title_3}</h4>
            <p className={s.problems_text}>{t.problem_text_3}</p>
          </div>
        </div>

        <Image className={s.man_02} src={Man02} alt="Man02" loading="lazy"/>

        <div className={s.s_item + ` ` + s.s_row4}>
          <span className={s.s_number}>4</span>

          <div className={s.s_item_w}>
            <h4 className={s.s_inner_title}>{t.problem_title_4}</h4>
            <p className={s.problems_text}>{t.problem_text_4}</p>
          </div>
        </div>

        <Image className={s.woman_02} src={Woman02} alt="Woman02" loading="lazy"/>

        <div className={s.s_item + ` ` + s.s_row5}>
          <span className={s.s_number}>5</span>
          <div className={s.s_item_w}>
            <h4 className={s.s_inner_title}>{t.problem_title_5}</h4>
            <p className={s.problems_text}>{t.problem_text_5}</p>
          </div>
        </div>

        <Image className={s.man_03} src={Man03} alt="Man03" loading="lazy"/>

        <div className={s.s_item + ` ` + s.s_row6}>
          <span className={s.s_number}>6</span>
          <div className={s.s_item_w}>
            <h4 className={s.s_inner_title}>{t.problem_title_6}</h4>
            <p className={s.problems_text}>{t.problem_text_6}</p>
          </div>
        </div>

        <Image className={s.woman_03} src={Woman03} alt="Woman02" loading="lazy"/>
      </div>
    </div>
  );
};

export default Section3;
