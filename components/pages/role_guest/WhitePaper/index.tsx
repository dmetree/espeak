import React from 'react'

import { useDispatch, useSelector } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import s from './.module.scss';
import Page from "@/components/shared/ui/Page/Page";
import Substrate from "@/components/shared/ui/Substrate/Substrate";

import S1 from './sections/S1/Section1';
import S2 from './sections/S2/Section2';
import S3 from './sections/S3/Section3';
import S4 from './sections/S4/Section4';
import FAQSection from '@/components/pages/role_guest/WhitePaper/sections/FAQ';

const WhitePaper = () => {

    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const t = loadMessages(currentLocale);

    return (
        <Page>
            <Substrate color="transparent">
                <div color="bg-color" className={s.whitePaper}>
                    <h2 className={s.header}>{t.white_paper}</h2>
                </div>
                <S1 />
                <S2></S2>
                <S3 />
                <S4 />
            </Substrate>
        </Page>
    )
}

export default WhitePaper
