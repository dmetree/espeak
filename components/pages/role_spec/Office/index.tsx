import React, { useEffect, useState, useRef, useMemo } from "react";
import { format } from 'date-fns';

import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import { fetchMyAppointments } from '@/store/actions/appointments';
import { saveSlots } from '@/store/actions/profile/user';
import { EScheduleMark, EUserRole, THourSchedule } from "@/components/shared/types";
import TableCalendar from "@/components/pages/role_spec/Office/ui/TableCalendar";
import HoursManager from "@/components/pages/role_spec/Office/ui/HoursManager";

import Page from "@/components/shared/ui/Page/Page";
import Substrate from "@/components/shared/ui/Substrate/Substrate";
import Button from "@/components/shared/ui/Button";
// import UserInfo from "./ui/UserInfo/index";

import UserInfo from '@/components/pages/spec_info/UserInfoSelf';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import s from './.module.scss';
import { motion } from "framer-motion";
import Sidebar from "@/components/features/SidebarES";

const Office = () => {

    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const myAppointments = useSelector(({ appointments }) => appointments.myAppointments);
    const t = loadMessages(currentLocale);
    const router = useRouter();
    const dispatch: AppDispatch = useDispatch<AppDispatch>();

    const userUid = useSelector(({ user }) => user.uid);
    const userRole = useSelector(({ user }) => user?.userData?.userRole);
    const userData = useSelector(({ user }) => user?.userData);

    const [freeTimestamps, setFreeTimestamps] = useState<number[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        if (userData?.freeTimestamps) {
            setFreeTimestamps(userData?.freeTimestamps);
        }
    }, [userData?.freeTimestamps]);

    const myRequests = useMemo(() => {
        if (!myAppointments || !userUid) return [];

        const currentTime = Math.floor(Date.now() / 1000);

        return myAppointments
            .filter((req) =>
                (req.clientUid === userUid || req.specUid === userUid) &&
                req.scheduledUnixtime >= currentTime // Filter out past requests
            )
            .sort((a, b) => a.scheduledUnixtime - b.scheduledUnixtime);

    }, [myAppointments, userUid]);


    const selectedDayRequests = useMemo(() => {
        if (!myAppointments) return [];

        const filteredList = myRequests.filter((req) => {
            const reqDateString = format(
                new Date(req.scheduledUnixtime * 1000),
                'MM/dd/yyyy'
            );
            const selectedDateString = format(selectedDate, 'MM/dd/yyyy');
            return reqDateString === selectedDateString;
        });

        return filteredList;
    }, [selectedDate, myRequests]);


    const selectedDaySchedule = useMemo(() => {
        const selectedDayFreeTimestamps = freeTimestamps.filter((ts) => {
            const iteratedDateString = format(new Date(ts * 1000), 'MM/dd/yyyy');
            const selectedDateString = format(selectedDate, 'MM/dd/yyyy');
            return iteratedDateString === selectedDateString;
        });

        const selectedDayFreeHours = selectedDayFreeTimestamps.map((ts) =>
            new Date(ts * 1000).getHours()
        );

        const hourRows = Array.from({ length: 24 }, (_, hour) => ({
            hour,
            mark: selectedDayFreeHours.includes(hour)
                ? EScheduleMark.OPEN_FOR_WORK
                : EScheduleMark.BUSY,
            request:
                selectedDayRequests.find(
                    (req) => new Date(req.scheduledUnixtime * 1000).getHours() === hour
                ) || null,
        }));

        return hourRows;
    }, [selectedDate, freeTimestamps, selectedDayRequests]);

    const hasNewToSave = useMemo(() => {
        if (userData?.freeTimestamps) {
            const difference = freeTimestamps.filter(
                (ts) => !userData?.freeTimestamps.includes(ts)
            );
            const isEqualLength =
                freeTimestamps.length === userData?.freeTimestamps.length;

            if (!isEqualLength) {
                return true;
            }

            return !!difference.length;
        } else if (freeTimestamps.length) {
            return true;
        }
    }, [
        userData?.freeTimestamps,
        freeTimestamps
    ]);

    const onHourClick = (dayTimeActivityItem: THourSchedule) => {
        const unixTimestampOfCurrentCell =
            selectedDate.setHours(dayTimeActivityItem.hour, 0, 0, 0) / 1000; // to keep it in seconds like everywhere in project; setHours() make it unix time, but in ms

        if (dayTimeActivityItem.mark === EScheduleMark.BUSY) {
            console.log(dayTimeActivityItem.mark);
            setFreeTimestamps((prev) => {
                return prev.includes(unixTimestampOfCurrentCell) // checking for accidentally duplicate entry
                    ? prev
                    : [...prev, unixTimestampOfCurrentCell];
            });
            // this part runs when cell was busy but in click moment we make it open
        } else {
            setFreeTimestamps((prev) => {
                return prev.filter(
                    (timestamp) => timestamp !== unixTimestampOfCurrentCell
                );
            });
            // this part runs when cell was open but in click moment we make it busy
        }
    };


    const [isSaving, setIsSaving] = useState(false);

    const onFreeTimeSave = async () => {
        if (isSaving) return; // Prevent multiple clicks
        setIsSaving(true); // Immediately add the disabled class

        await dispatch(saveSlots(userUid, freeTimestamps)); // Wait for dispatch to complete
        toast.success("Schedule updated.");

        setIsSaving(false); // Remove disabled class after save
    };

    useEffect(() => {
        dispatch(fetchMyAppointments(userUid));
    }, []);


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

                    {userData?.userRole === EUserRole.Specialist &&

                        <div className={s.timeTable}>

                            <div className={s.rightRightColumn}>
                                {/* @ts-expect-error @TODO */}
                                <TableCalendar
                                    currentDate={selectedDate}
                                    setCurrentDate={setSelectedDate}
                                    myRequests={myRequests}
                                    freeTimestamps={freeTimestamps}
                                />
                                <HoursManager
                                    onCellClick={onHourClick}
                                    currentDate={selectedDate}
                                    selectedDaySchedule={selectedDaySchedule}
                                />
                                <button
                                    disabled={!hasNewToSave}
                                    className={`${s.saveBtn} ${hasNewToSave ? '' : s.disabled}`}
                                    onClick={onFreeTimeSave}
                                >
                                    {t.save}
                                </button>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </motion.div>
    )
}

export default Office;
