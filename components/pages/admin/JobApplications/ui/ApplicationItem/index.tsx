import React, { useEffect } from 'react';

import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Page from "@/components/shared/ui/Page/Page";
import Substrate from "@/components/shared/ui/Substrate/Substrate";
import Button from "@/components/shared/ui/Button";
import s from './.module.scss';
import { ApplicationView } from './ui/ApplicationsView';
import EditUserToSpec from './ui/EditUserToSpec';

export const JobApplicationItem = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    const userUid = useSelector(({ user }) => user.uid);
    const selectedJobApplication = useSelector(({ jobApplications }) => jobApplications.selectedJobApplication);


    return (
        <Page className=''>
            <Substrate className='' color="bg-color">

                <div className={s.layout}>
                    <ApplicationView />
                    <EditUserToSpec selectedJobApplicationUserId={selectedJobApplication?.uid} />
                </div>

            </Substrate>
        </Page>
    )
}

