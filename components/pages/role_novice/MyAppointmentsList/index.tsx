import React, { useEffect } from 'react'

import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { fetchMyAppointments } from '@/store/actions/appointments';

import { TableHead } from '@/components/shared/ui/TableHead/TableHead';
import DisplayPsyRequests from '@/components/features/DisplayPsyRequests';

import Page from "@/components/shared/ui/Page/Page";
import Substrate from "@/components/shared/ui/Substrate/Substrate";

const MyAppointmentsList = () => {
    const dispatch: AppDispatch = useDispatch<AppDispatch>();
    const userUid = useSelector(({ user }) => user.uid);
    const myAppointments = useSelector(({ appointments }) => appointments.myAppointments);

    useEffect(() => {
        dispatch(fetchMyAppointments(userUid));
    }, [dispatch, userUid]);


    return (
        <Page>
            <Substrate color="bg-color">
                <TableHead />
                <DisplayPsyRequests requests={myAppointments} />
            </Substrate>
        </Page>
    )
}

export default MyAppointmentsList;
