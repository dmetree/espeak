import React, { useEffect, useState, ChangeEvent, KeyboardEvent } from "react";
import { useRouter } from "next/router";
import { motion } from 'framer-motion';

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import Button from '@/components/shared/ui/Button';
import { SingleInput } from "@/components/shared/ui/SingleInput/SingleInput";
import { ISpecProfile } from "@/components/shared/types";

import { findRandomSpecialists, findSpecialists } from '@/store/actions/specialists';
import Sidebar from "@/components/features/SidebarES";
import { FiltersBar, FiltersState } from "@/components/pages/ViewExperts/ui/FiltersBar/FiltersBar";
import SpecialistCardNew from "@/components/pages/ViewExperts/ui/SpecialistsCardNew";

import s from './ViewExperts.module.scss';


const ViewExperts = () => {
    const router = useRouter();
    const dispatch: AppDispatch = useDispatch<AppDispatch>();

    const userUid = useSelector(({ user }) => user.uid);
    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const t = loadMessages(currentLocale);


    const [searchValue, setSearchValue] = useState<string>('');
    const [filters, setFilters] = useState<FiltersState | null>(null);
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

    const filteredSpecialists = (specialistList || []).filter((spec) => {
        if (!filters) return true;

        const langs: string[] = Array.isArray((spec as any).languages)
            ? (spec as any).languages
            : [];

        // Filter by language the student wants to learn
        if (filters.learnLanguage) {
            const targetLang = (spec as any).teacherApplication?.targetLang;
            const teachesRequestedLang =
                targetLang === filters.learnLanguage || langs.includes(filters.learnLanguage);
            if (!teachesRequestedLang) return false;
        }

        // Filter by language the teacher speaks
        if (filters.speaksLanguage) {
            if (!langs.includes(filters.speaksLanguage)) return false;
        }

        // Filter by teacher type (very simple heuristic based on teacherApplication.teacherType)
        if (filters.teacherType && filters.teacherType !== 'Both') {
            const teacherType = (spec as any).teacherApplication?.teacherType || '';
            const isPro = teacherType === 'pro';

            if (filters.teacherType === 'Teacher' && !isPro) return false;
            if (filters.teacherType === 'Tutor' && isPro) return false;
        }

        // Filter by price range (price stored in cents)
        const rawPrice = Number((spec as any).price);
        const priceValue = Number.isFinite(rawPrice) ? rawPrice / 100 : null;

        if (
            priceValue !== null &&
            (priceValue < filters.minPrice || priceValue > filters.maxPrice)
        ) {
            return false;
        }

        return true;
    });


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
                        <span>Find teacher with particular nickname</span>
                        <div className={s.searchBox}>
                            <SingleInput placeholder="" onChange={onSearchChange} value={searchValue} onKeyDown={handleKeyPress} />
                            <Button
                                onClick={handleTherapistSearch}
                                className={s.searchBtn}>{t.search}
                            </Button>
                        </div>
                    </div>

                    <FiltersBar onFiltersChange={setFilters} />

                    <div className={s.specialistList}>
                    {noTherapistFound ? (
                        <p className={s.noTherapist}>
                        {typeof t.no_therapist_found === 'string'
                            ? t.no_therapist_found
                            : "There is no teachers"}
                        </p>
                    ) : (
                        filteredSpecialists.map((item, index )=> (
                            <SpecialistCardNew specialist={item} key={index} />
                        ))
                    )}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default ViewExperts
