import React, { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from "@/store";
import { fetchVacantAppointments } from '@/store/actions/appointments';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import DisplayPsyRequests from '@/components/features/DisplayPsyRequests';
import Page from "@/components/shared/ui/Page/Page";
import Substrate from "@/components/shared/ui/Substrate/Substrate";
import { TableHead } from '@/components/shared/ui/TableHead/TableHead';
import s from "./.module.scss";


const PsyRequests = () => {
    const dispatch: AppDispatch = useDispatch<AppDispatch>();
    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const t = loadMessages(currentLocale);
    const userUid = useSelector(({ user }) => user.uid);
    const userPsyRank = useSelector(({ user }) => user?.userData?.psyRank);
    const userLangs = useSelector(({ user }) => user?.userData?.languages);

    const { vacantAppointments } = useSelector(({ appointments }) => appointments);

    const vacantAppointmentsWithinRank = vacantAppointments.filter(
        (req) => req.psyRank <= userPsyRank
    );

    const vacantAppointmentsWithinLangs = vacantAppointmentsWithinRank.filter(
        (req) => req.lang.some((lang: string) => userLangs.includes(lang))
    );

    useEffect(() => {
        if (userUid && userPsyRank) {
            dispatch(fetchVacantAppointments(userUid, userPsyRank));
        }
    }, [dispatch, userUid, userPsyRank]);




    return (
        <Page className={s.userboardPage}>
            <Substrate className={s.userboard}>
                <h3 className={s.header}>{t.seek_help}</h3>
                <TableHead />
                <DisplayPsyRequests requests={vacantAppointmentsWithinLangs} />
            </Substrate>
        </Page>
    )
}

export default PsyRequests
