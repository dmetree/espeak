import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SUPPORTED_LOCALES, SUPPORTED_LOCALES2 } from '@/components/shared/i18n/locales';
import { setLocale } from '@/store/actions/locale';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import { hideModal } from '@/store/actions/modal'; // Assuming actions are in this file
import { EModalKind } from "@/components/shared/types";

import s from './.module.scss';

const locales = Object.entries(SUPPORTED_LOCALES2);

export default function LangModal() {
    const dispatch = useDispatch();
    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const t = loadMessages(currentLocale);

    const handleLocaleClick = (nextLocale: string) => {
        dispatch(setLocale(nextLocale)); // Dispatch Redux action to update locale state
        dispatch(hideModal(EModalKind.LangModal));
    };

    const hideIt = () => {
        dispatch(hideModal(EModalKind.LangModal));
    }


    return (
        <div className={s.modalOverlay} onClick={hideIt}>
            <div
                className={s.modalContent}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <div className={s.modalHeader}>
                    <h3 className={s.modalHeader_title}>{t.select_language}</h3>
                    <button onClick={hideIt} className={s.closeButton}>X</button>
                </div>
                <div className={s.localeList}>
                    {locales.map(([code, label]) => (
                        <div
                            key={code}
                            onClick={() => handleLocaleClick(code)}
                            className={`${s.localeOption}
                    ${currentLocale === code ? s.localeOptionActive : ''}
                    ${currentLocale === code ? s.bold : ''}`}
                        >
                            {label}
                        </div>
                    ))}
                </div>
            </div>
        </div>

    );
}
