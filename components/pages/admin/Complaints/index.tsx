import React, { useEffect } from 'react'
import Page from "@/components/shared/ui/Page/Page";

import { useDispatch, useSelector } from "react-redux";
import Substrate from "@/components/shared/ui/Substrate/Substrate";
import Button from "@/components/shared/ui/Button";
import { AppDispatch } from "@/store";
import { fetchComplaintRequests } from '@/store/actions/appointments';
import { RequestList } from '@/components/features/DisplayPsyRequests/ui/PsyRequestList/PsyRequestList';

export const ComplaintsCheck = () => {
    const dispatch: AppDispatch = useDispatch<AppDispatch>();
    const userData = useSelector(({ user }) => user?.userData);
    const complaintRequests = useSelector(({ appointments }) => appointments?.complaintRequests);


    useEffect(() => {
        dispatch(fetchComplaintRequests());
    }, [dispatch]);

    return (
        <Page className=''>
            <Substrate className='' color="bg-color">
                <h3>Complaints check</h3>
                <RequestList requests={complaintRequests} />
            </Substrate>
        </Page>
    )
}

