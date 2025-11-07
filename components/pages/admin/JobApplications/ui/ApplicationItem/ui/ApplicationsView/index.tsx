import React, { useEffect } from 'react';

import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";

import s from './.module.scss';

export const ApplicationView = () => {
    const router = useRouter();

    const selectedJobApplication = useSelector(({ jobApplications }) => jobApplications.selectedJobApplication);

    return (
        <div className={s.applicationView}>
            <h3>Job Application: </h3>
            {!selectedJobApplication ? (
                <div>Loading...</div>
            ) : (
                <div className={s.applicationsBox}>
                    {selectedJobApplication === 0 && (
                        <div>No new job applications.</div>
                    )}

                    {/* Display User ID */}
                    <div className="">User ID: {selectedJobApplication.uid}</div>
                    <div className="">Appl ID: {selectedJobApplication.id}</div>

                    {/* Display Extra Information */}
                    <h4>User letter: </h4>
                    <div className="">{selectedJobApplication.extra_info}</div>

                    {/* Display Diploma */}
                    <div className="">
                        <h4>Diploma:</h4>
                        <a href={selectedJobApplication.diploma} target="_blank" rel="noopener noreferrer">
                            View Diploma
                        </a>
                        <span className={s.diplomaHours}> {selectedJobApplication.diplomaHours} h</span>
                    </div>

                    {/* Display Certificates */}
                    <div className="">
                        <h4>Certificates:</h4>
                        {selectedJobApplication.certificates.map((cert: any, index: number) => (
                            <div key={index}>
                                <a href={cert} target="_blank" rel="noopener noreferrer">
                                    Certificate {index + 1}
                                </a>
                                : {cert.certificateHours} h
                            </div>
                        ))}
                    </div>

                    {/* Display Therapists */}
                    <div className="">
                        <h4>Therapists:</h4>
                        {selectedJobApplication.therapists.map((therapist: any, index: number) => (
                            <div className={s.therapistContainer} key={index}>
                                <span className={s.therapistBox}>
                                    <div className={s.therapistIndex}>{index + 1}.</div>
                                    <div>{therapist.name}</div>
                                </span>
                                <p>Contact: {therapist.profileLink}</p>
                                <p>Sessions: {therapist.sessions}</p>
                                <span className={s.fromTo}>
                                    <p>From: {therapist.from} --</p>
                                    <p>To: {therapist.to}</p>
                                </span>

                            </div>
                        ))}
                    </div>
                    {/* Calculate total number of sessions */}
                    <h4>Total HH sessions: {selectedJobApplication.therapists.reduce((total: any, therapist: any) => total + therapist.sessions, 0)}</h4>


                    {/*TODO: Calculate total number of hours of cert.certificateHours +  selectedJobApplication.diplomaHours*/}
                    <h4>Total HH education: {
                        selectedJobApplication.certificates.reduce(
                            (total: any, cert: any) => total + (Number(cert.certificateHours) || 0),
                            Number(selectedJobApplication.diplomaHours) || 0
                        )
                    }</h4>
                </div>
            )}
        </div>
    )
}

