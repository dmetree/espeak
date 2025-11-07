import React from 'react';
import Image from 'next/image';

import { useDispatch, useSelector } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import s from './.module.scss';
import Page from "@/components/shared/ui/Page/Page";
import Substrate from "@/components/shared/ui/Substrate/Substrate";

import Belt1 from '@/components/shared/assets/img/belts/e001_belt.webp';
import Belt2 from '@/components/shared/assets/img/belts/e002_belt.webp';
import Belt3 from '@/components/shared/assets/img/belts/e003_belt.webp';
import Belt4 from '@/components/shared/assets/img/belts/e004_belt.webp';
import Belt5 from '@/components/shared/assets/img/belts/e005_belt.webp';
import Belt6 from '@/components/shared/assets/img/belts/e006_belt.webp';
import Belt7 from '@/components/shared/assets/img/belts/e007_belt.webp';
import Belt8 from '@/components/shared/assets/img/belts/e008_belt.webp';
import Belt9 from '@/components/shared/assets/img/belts/e009_belt.webp';
import Belt10 from '@/components/shared/assets/img/belts/e010_belt.webp';




const Rank = () => {
    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const t = loadMessages(currentLocale);

    const beltsMapping = [
        {
            text: `${t.rank_text_1}`,
            image: Belt1,
        },
        {
            text: `${t.rank_text_2}`,
            image: Belt2,
        },
        {
            text: `${t.rank_text_3}`,
            image: Belt3,
        },
        {
            text: `${t.rank_text_4}`,
            image: Belt4,
        },
        {
            text: `${t.rank_text_5}`,
            image: Belt5,
        },
        {
            text: `${t.rank_text_6}`,
            image: Belt6,
        },
        {
            text: `${t.rank_text_7}`,
            image: Belt7,
        },
        {
            text: `${t.rank_text_8}`,
            image: Belt8,
        },
        {
            text: `${t.rank_text_9}`,
            image: Belt9,
        },
        {
            text: `${t.rank_text_10}`,
            image: Belt10,
        },
    ];

    return (
        <Page >
            <Substrate className={s.wrap}>
                <h1 className={s.title}>{t.psy_ranks}</h1>
                <p className={s.rank_why}>{t.psy_rank_why}</p>
                <ul className={s.beltsList}>
                    {beltsMapping.map((belt) => (
                        <li key={beltsMapping.indexOf(belt)} className={s.beltsItem}>
                            <Image
                                className={s.beltImg}
                                src={belt.image}
                                alt={`${t.psy_rank} ${beltsMapping.indexOf(belt) + 1}`}
                                width={100} // Provide appropriate width
                                height={100} // Provide appropriate height
                                priority={beltsMapping.indexOf(belt) === 0} // Optionally, load the first image with priority
                            />
                            <h2 className={s.beltTitle}>
                                {beltsMapping.indexOf(belt) + 1} {t.rank}
                            </h2>
                            <p className={s.text}>{belt.text}</p>
                        </li>
                    ))}
                </ul>
            </Substrate>
        </Page>
    );
};

export default Rank;
