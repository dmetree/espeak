import React, { useEffect, useState, useRef, ChangeEvent, KeyboardEvent } from "react";
import { useRouter } from "next/router";
import { motion } from 'framer-motion';

import { EModalKind, IJobRequestStatus } from '@/components/shared/types';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import Page from "@/components/shared/ui/Page/Page";
import Substrate from "@/components/shared/ui/Substrate/Substrate";
import Button from '@/components/shared/ui/Button';
import { SingleInput } from "@/components/shared/ui/SingleInput/SingleInput";
import { ISpecProfile } from "@/components/shared/types";
import SpecialistCard from './TherapistCard';

import { showModal, hideModal, toggleModal } from '@/store/actions/modal'; // Assuming actions are in this file

import s from './ViewExperts.module.scss';
import Link from 'next/link';
import { findRandomSpecialists, findSpecialists } from '@/store/actions/specialists';
import Sidebar from "@/components/features/SidebarES";


const ViewExperts = () => {
    const router = useRouter();
    const dispatch: AppDispatch = useDispatch<AppDispatch>();

    const userUid = useSelector(({ user }) => user.uid);
    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const t = loadMessages(currentLocale);


    const [searchValue, setSearchValue] = useState<string>('');
    const specialistList = useSelector(
        ({ specialists }: { specialists: { specialistList: ISpecProfile[] } }) =>
            specialists.specialistList
    );

    const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.currentTarget.value);
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleTherapistSearch();
        }
    };

    const handleTherapistSearch = () => {
        dispatch(findSpecialists(searchValue));
    }

    const noTherapistFound = !specialistList?.length || specialistList.every(s => !s.nickname);


    useEffect(() => {
        if (specialistList.length === 0) {
            dispatch(findRandomSpecialists(userUid));
        }
    }, [])


    return (
        <motion.div
            className={`${s.container} ${s.second}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >

            <div className={s.page}>
                <Sidebar />
                <div className={s.main}>
                    <h2 className={s.header}>Learn languages with our certified teachers and native speakers</h2>
                    <div className={s.searchBox_wrap}>
                        <span>{t.search_therapist}</span>
                        <div className={s.searchBox}>
                            <SingleInput placeholder="" onChange={onSearchChange} value={searchValue} onKeyDown={handleKeyPress} />
                            <div
                                onClick={handleTherapistSearch}
                                className={s.searchBtn}>{t.search}</div>
                        </div>
                    </div>



                    <div className={s.specialistList}>
                        {noTherapistFound ? (
                            <p className={s.noTherapist}>{t.no_therapist_found || "There is no therapist with that nickname"}</p>
                        ) : (
                            specialistList.map(({ uid, ...specialist }) => {
                                console.log('specialist', specialist)
                                return (
                                    <SpecialistCard key={uid} uid={uid as string} {...specialist} />
                                )
                            })
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default ViewExperts
