import React, { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from "@/store";
import { fetchWorkAppointments } from '@/store/actions/appointments';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import DisplayPsyRequests from '@/components/features/DisplayPsyRequests';
import Page from "@/components/shared/ui/Page/Page";
import Substrate from "@/components/shared/ui/Substrate/Substrate";
import { TableHead } from '@/components/shared/ui/TableHead/TableHead';
import s from "./.module.scss";


const ClaimRewards = () => {
    const dispatch: AppDispatch = useDispatch<AppDispatch>();
    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const t = loadMessages(currentLocale);
    const userUid = useSelector(({ user }) => user.uid);
    const userPsyRank = useSelector(({ user }) => user?.userData?.psyRank);
    const userLangs = useSelector(({ user }) => user?.userData?.languages);

    const workAppointments = useSelector(({ appointments }) => appointments.workAppointments);

    const currentTime = Math.floor(Date.now() / 1000); // Get current time in Unix timestamp (seconds)

    const completedWorkAppointments = workAppointments
        ? workAppointments.filter(appointment => appointment.scheduledUnixtime < currentTime)
        : [];

    useEffect(() => {
        if (userUid) {
            dispatch(fetchWorkAppointments(userUid));
        }
    }, [dispatch, userUid]);

    return (
        <Page className={s.userboardPage}>
            <Substrate className={s.userboard}>
                <h3 className={s.header}>{t.collect_rewards}</h3>

                <TableHead />
                <DisplayPsyRequests requests={completedWorkAppointments} />
            </Substrate>
        </Page>
    )
}

export default ClaimRewards;
