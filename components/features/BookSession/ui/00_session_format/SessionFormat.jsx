import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDraftAppointment } from '@/store/actions/appointments';
import { loadMessages } from '@/components/shared/i18n/translationLoader';

import s from './.module.scss';

import { FormWrapper } from '../../helpers/FormWrapper';

export function SessionFormat() {
    const dispatch = useDispatch();
    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const t = loadMessages(currentLocale);

    const draftAppointment = useSelector(({ appointments }) => appointments.draftAppointment);


    const formats = [
        "video-call",
        "audio-call",
        "online-chat",
    ];

    const handleItemClick = (selectedFormat) => {
        dispatch(setDraftAppointment({
            ...draftAppointment,
            format: selectedFormat,

            // // selectedDate: ,
            // specUid: selectedSpecialist.uID,
            // specNickname: selectedSpecialist.nickname,
            // specAvatar: selectedSpecialist.avatar,
        }));
    };

    return (
        <FormWrapper title={t.format_title}>
            <div className={s.wrapper}>
                <div className={s.helpItems}>
                    {formats.map((format) => (
                        <div
                            key={format}
                            className={`${s.helpItem} ${draftAppointment.format === format ? s.selected : ''
                                }`}
                            onClick={() => handleItemClick(format)}
                        >
                            {t[format]}
                        </div>
                    ))}
                </div>
            </div>
        </FormWrapper>
    );
}
