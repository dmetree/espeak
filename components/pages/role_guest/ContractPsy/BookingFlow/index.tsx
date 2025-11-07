import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import s from "./landing.module.scss";

const BookingFlow = () => {
    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const t = useMemo(() => loadMessages(currentLocale), [currentLocale]);
    return (
        <div className={s.bookingFlowWrapper}>
            <h2 className={s.boxHeader}>{t.booking_flow_h}</h2>
            {/* <div className={s.boxPrimary}>Find the Expert You Need</div>
            <div className={s.or}>OR</div>
            <div className={s.boxSecondary}>
                BOOK SESSION BY PARAMS: <br />
                Get Help from an Expert <br />
                Whose Qualification <br />
                Meets Your Description
            </div> */}

            <div className={s.stepBox}>
                <h2>
                    <span className={s.stepNumber}>1.</span>{t.booking_flow_title_01_p1} <br /> {t.booking_flow_title_01_p2}
                </h2>
                <p>
                    {t.booking_flow_step_01_text_01}
                    <br />
                    {t.booking_flow_step_01_text_02}
                </p>
            </div>

            <div className={s.stepBox}>
                <h2>
                    <span className={s.stepNumber}>2.</span> {t.booking_flow_title_02_p1} <br />  {t.booking_flow_title_02_p2}
                </h2>
                <p>
                    {t.booking_flow_title_02_text_01}<br />
                    {t.booking_flow_title_02_text_02}
                    <br /><br />
                    {t.booking_flow_title_02_text_03} <br />
                    {t.booking_flow_title_02_text_04}
                </p>
            </div>

            <div className={s.stepBox}>
                <h2>
                    <span className={s.stepNumber}>3.</span>{t.booking_flow_title_03}
                </h2>
                <p>
                    {t.booking_flow_title_03_text_01}
                    <br /><br />
                    {t.booking_flow_title_03_text_02}
                </p>
            </div>

            <div className={s.stepBox}>
                <h2>
                    <span className={s.stepNumber}>4.</span>{t.booking_flow_title_04}
                </h2>
                <p>
                    {t.booking_flow_title_04_text_01}
                    <br />
                    {t.booking_flow_title_04_text_02}

                    <br /><br />
                    {t.booking_flow_title_04_text_03}
                    <br />
                    {t.booking_flow_title_04_option_01}
                    <br />
                    {t.booking_flow_title_04_option_01_text}
                    <br />
                    {t.booking_flow_title_04_option_02}
                    <br />
                    {t.booking_flow_title_04_option_02_text}
                    <br />
                    {t.booking_flow_title_04_option_03}
                    <br />
                    {t.booking_flow_title_04_option_03_text}
                    <br />===<br />
                    {t.booking_flow_final}
                </p>
            </div>
        </div>
    );
};

export default BookingFlow;
