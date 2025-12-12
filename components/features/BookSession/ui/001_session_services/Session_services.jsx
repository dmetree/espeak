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

    const services = draftAppointment?.services || selectedSpecialist?.services || [];
    const hasServices = Array.isArray(services) && services.length > 0;

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
                {!hasServices ? (
                    <p className={s.noServices}>
                        There are no available services, so you wouldn't be able to book a lesson from this teacher
                    </p>
                ) : (
                    <div className={s.helpItems}>
                        {services.map((service, index) => {
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
                            )
                        })}
                    </div>
                )}
            </div>
        </FormWrapper>
    );
}
