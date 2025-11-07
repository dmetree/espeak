import React, { useEffect, useState, useRef, ChangeEvent, KeyboardEvent } from "react";

import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";

import { ISpecProfile } from "@/components/shared/types";
import { findSpecialists, clearSpecialists, findRandomSpecialists } from '@/store/actions/specialists';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import Button from '@/components/shared/ui/Button';
import { SingleInput } from "@/components/shared/ui/SingleInput/SingleInput";
import SpecialistCard from './TherapistCard';


import s from "./.module.scss";


const FindTherapist = () => {

    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const t = loadMessages(currentLocale);
    const router = useRouter();
    const dispatch: AppDispatch = useDispatch<AppDispatch>();
    const userUid = useSelector(({ user }) => user.uid);
    const isModalOpen = useSelector(({ modal }: { modal: { isOpen: boolean } }) => modal.isOpen);

    const [searchValue, setSearchValue] = useState<string>('');
    const specialistList = useSelector(
        ({ specialists }: { specialists: { specialistList: ISpecProfile[] } }) =>
            specialists.specialistList
    );

    const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.currentTarget.value);
    };

    const handleTherapistSearch = () => {
        dispatch(findSpecialists(searchValue));
    }

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleTherapistSearch();
        }
    };

    useEffect(() => {
        if (!isModalOpen) {
            setSearchValue("");
            dispatch(clearSpecialists()); // Clears the specialist list properly
        }
    }, [isModalOpen, dispatch]);

    // Check if there are no therapists or all are missing nicknames
    const noTherapistFound = !specialistList?.length || specialistList.every(s => !s.nickname);

    useEffect(() => {
        if (specialistList.length === 0) {
            dispatch(findRandomSpecialists(userUid));
        }
    }, [])

    return (
        <div className={s.searchContainer}>
            <span>{t.search_therapist}</span>
            <div className={s.searchBox}>
                <SingleInput placeholder="" onChange={onSearchChange} value={searchValue} onKeyDown={handleKeyPress} />
                <Button
                    onClick={handleTherapistSearch}
                    className={s.searchBtn}>{t.search}</Button>
            </div>

            <div className={s.specialistList}>
                {noTherapistFound ? (
                    <p className={s.noTherapist}>{t.no_therapist_found || "There is no therapist with that nickname"}</p>
                ) : (
                    specialistList.map(({ uid, ...specialist }) => (
                        <SpecialistCard key={uid} uid={uid as string} {...specialist} />
                    ))
                )}
            </div>
        </div>
    )
}

export default FindTherapist;
