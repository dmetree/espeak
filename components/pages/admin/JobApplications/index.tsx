import React, { useEffect } from 'react';

import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { fetchJobApplications } from '@/store/actions/jobApplications';
import { setSelectedJobApplication } from '@/store/actions/jobApplications';

import { IJobRequestStatus } from '@/components/shared/types';
import Page from "@/components/shared/ui/Page/Page";
import Substrate from "@/components/shared/ui/Substrate/Substrate";
import Button from "@/components/shared/ui/Button";
import s from './.module.scss';

export const JobApplications = () => {
    const router = useRouter();
    const dispatch: AppDispatch = useDispatch<AppDispatch>();

    const userUid = useSelector(({ user }) => user.uid);
    const jobApplicationsList = useSelector(({ jobApplications }) => jobApplications.jobApplicationsList);


    const jobApplicationViewHandler = (jobApplication: any) => {
        dispatch(setSelectedJobApplication(jobApplication)); // TOD) create action in Redux to set selectedJobApplication
        router.push(`/admin/job_applications/${jobApplication.id}`);
    }

    IJobRequestStatus.Accepted
    IJobRequestStatus.Declined

    useEffect(() => {
        dispatch(fetchJobApplications());
    }, []);

    return (
        <Page className=''>
            <Substrate className='' color="bg-color">
                <h3>Job Application check</h3>
                {jobApplicationsList.isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <div className={s.applicationsBox}>
                        {jobApplicationsList.length === 0 && <div>No new job applications.</div>}
                        {jobApplicationsList.map((jobApplication: any, index: number) => (
                            <div
                                className={`${s.applicationItem} ${jobApplication.status === "Accepted" ? s.accepted : jobApplication.status === "Declined" ? s.declined : ""}`}
                                key={index}
                            >
                                <div className={s.uid}><span> id: {jobApplication.uid}</span> <span>status: {jobApplication.status}</span></div>
                                <div className="">{jobApplication.extra_info}</div>
                                <div className="">
                                    <Button
                                        className={s.articleBtn}
                                        onClick={() => jobApplicationViewHandler(jobApplication)}>View</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Substrate>
        </Page>
    )
}

