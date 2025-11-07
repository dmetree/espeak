import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDraftAppointment } from '@/store/actions/appointments';
import { loadMessages } from '@/components/shared/i18n/translationLoader';

import s from './.module.scss';

import { FormWrapper } from '../../helpers/FormWrapper';

export function SessionServices() {
    const dispatch = useDispatch();
    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const t = loadMessages(currentLocale);

    const draftAppointment = useSelector(({ appointments }) => appointments.draftAppointment);
    const selectedSpecialist = useSelector(({ specialists }) => specialists.selectedSpecialist);

    const handleItemClick = (selectedService) => {
        dispatch(setDraftAppointment({
            ...draftAppointment,
            selectedService: selectedService,
            price: selectedService.price,
        }));
    };

    return (
        <FormWrapper title={t.service_title}>
            <div className={s.wrapper}>
                <div className={s.helpItems}>
                    {draftAppointment?.services.map((service, index) => {
                        const isSelected =
                            draftAppointment?.selectedService?.title?.[currentLocale] ===
                            service.title?.[currentLocale];
                        return (
                            <div
                                key={`${service.title?.[currentLocale]}-${index}`}
                                className={`${s.helpItem} ${isSelected ? s.selected : ''}`}
                                onClick={() => handleItemClick(service)}
                            >
                                <div className={s.serviceItem}>
                                    <h5>{service.title?.[currentLocale]}</h5>

                                    {/* <span>{service.length}  </span> */}
                                    {t.general_el_02}

                                    <h4>${service.price / 100}</h4>
                                </div>

                            </div>
                    )})}
                </div>
            </div>
        </FormWrapper>
    );
}
