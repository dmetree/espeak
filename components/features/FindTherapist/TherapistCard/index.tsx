
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import { EModalKind } from '@/components/shared/types/types';
import { hideModal } from '@/store/actions/modal';
import { setSelectedSpecialist } from '@/store/actions/specialists';
import Button from "@/components/shared/ui/Button";
import { useRouter } from 'next/router';

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
                <p className={s.nickname}>{specialist.nickname
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}</p>
                <p className={s.rank}>
                    {t.consultant_rank} {specialist.psyRank}
                </p>
            </div>
            <div className={s.specialistInfoRight}>
                <p className={s.timeZone}>{specialist.timeZone}</p>
                {/* <p className={s.professionSince}>
                    {t.consultant_work_years} {inProfessionSince}
                </p> */}
            </div>
            <div className={s.buttonContainer}>
                <div
                    onClick={onProfileClick}
                    className={s.goToProfileBtn}>
                    {t.look_the_profile}
                </div>
            </div>
        </div>
    );
};
export default SpecialistCard;
