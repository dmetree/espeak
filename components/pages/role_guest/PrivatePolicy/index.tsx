import React from 'react'
import Image from 'next/image';

import { useDispatch, useSelector } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import Page from "@/components/shared/ui/Page/Page";
import Substrate from "@/components/shared/ui/Substrate/Substrate";

import s from './.module.scss';

const PrivatePolicy = () => {
    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const t = loadMessages(currentLocale);
    // { t.psy_contract }
    return (
        <Page>
            <Substrate color="bg-color" className={s.wrapper}>
                <h2 className={s.header}>{t.privacy_policy}</h2>
                <div className={s.content}>

                </div>
            </Substrate>
        </Page>
    )
}

export default PrivatePolicy
