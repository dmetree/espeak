import React from 'react'
import { useRouter } from "next/router";
import { useDispatch, useSelector } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import s from './.module.scss';

const Footer = () => {
    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const t = loadMessages(currentLocale);
    const router = useRouter();

    const goToTOU = () => {
        router.push('/tou');
    }

    const goToPP = () => {
        router.push('/privacy_policy');
    }

    const goToEP = () => {
        router.push('/expert_policy');
    }


    return (
        <div className={s.wrapper}>
            <div className={s.footerItems}>
                <div className={s.f_element} onClick={goToTOU}>{t.terms_of_use}</div>
                <div className={s.vertialLine}></div>
                {/* <div className={s.f_element} onClick={goToPP}>{t.privacy_policy}</div> */}
                <div className={s.vertialLine}></div>
                <div className={s.f_element} onClick={goToEP}>{t.expert_policy_header}</div>
            </div>

        </div>
    )
}

export default Footer;