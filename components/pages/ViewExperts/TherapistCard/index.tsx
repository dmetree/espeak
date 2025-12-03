
import React, { FC } from 'react';
import { useRouter } from 'next/router';

import Image from "next/image";
import { useDispatch, useSelector } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import { EModalKind } from '@/components/shared/types/types';
import { hideModal } from '@/store/actions/modal';
import { setSelectedSpecialist } from '@/store/actions/specialists';
import Button from "@/components/shared/ui/Button";

import s from './TherapistCard.module.scss';

type TSpecialistCardProps = {
    nickname?: string;
    inProfessionSince?: number;
    psyRank?: number;
    timeZone?: string;
};

const SpecialistCard = ({
    ...specialist
}) => {
    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const t = loadMessages(currentLocale);

    const dispatch = useDispatch();
    const router = useRouter();


    const onProfileClick = () => {
        if (specialist.nickname) {
            const formattedNickname = specialist.nickname.trim().replace(/\s+/g, '-');
            dispatch(setSelectedSpecialist(specialist));
            router.push(`/specialist-profile/${formattedNickname}`);
        } else {
            console.warn('Nickname is missing for navigation');
        }
        dispatch(hideModal(EModalKind.FindSpecialist));
    };

    return (
        <div className={s.specialistCard}>
            <div className={s.specialistInfoLeft}>

                {/* <img src={specialist.avatar} alt={specialist.nickname} className={s.avatar} /> */}
                <Image width="50" height="50" src={specialist?.avatar} alt="Avatar" className={s.avatarNav} />
                <div className={s.langAndRank}>
                    <div className={s.infoRow}>
                        <strong>{t.specialist_languages}</strong>
                        <span>{specialist?.languages?.join(', ') || '—'}</span>
                    </div>

                    <p className={s.rank}>
                        {t.consultant_rank} {specialist?.psyRank}
                    </p>
                </div>

            </div>
            <div className={s.specialistInfoRight}>
                <p className={s.nickname}>{specialist.nickname
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}</p>
                <div className={s.infoRow}>
                    <strong>{t.consultant_work_years}</strong>
                    <span>{specialist?.inProfessionSince || '—'}</span>
                </div>

                <div className={s.infoRow}>
                    {specialist?.methodCreator?.length > 0 && <strong>{t.specialist_author_of_methods}</strong>}
                    <span>{specialist?.methodCreator?.length > 0 && specialist.methodCreator.join(', ')}</span>
                </div>
                <div className={s.infoRow}>
                    <strong>{t.specialist_psy_methods}</strong>
                    <span>{specialist?.psyMethods?.length ? specialist.psyMethods.join(', ') : '—'}</span>
                </div>
                <div className={s.infoRow}>
                    <strong>{t.specialist_specialization}</strong>
                    <span>
                        {specialist?.psySpecialities?.length
                            ? specialist.psySpecialities
                                .map((speciality: string) => t['psy-speciality'][speciality] || speciality)
                                .join(', ')
                            : '—'}
                    </span>
                </div>
            </div>

            <div className={s.buttonContainer}>
                <div role="button" onClick={onProfileClick} className={s.goToProfileBtn}>
                    {t.look_the_profile}
                </div>
            </div>
        </div>
    );
};
export default SpecialistCard;
