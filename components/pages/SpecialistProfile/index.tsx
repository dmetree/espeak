import { format } from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import { setDraftAppointment } from '@/store/actions/appointments';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
// import UserInfo from './ui/UserInfo';
import UserInfo from '@/components/pages/spec_info/UserInfoPublic';

import SpecTableCalendar from '@/components/pages/SpecialistProfile/ui/SpecTableCalendar';
import SpecHoursManager from '@/components/pages/SpecialistProfile/ui/SpecHoursManager';
import { getSelectedSpecialistByNickname } from '@/store/actions/specialists';
import { showModal } from '@/store/actions/modal';
import { EModalKind, EScheduleMark } from '@/components/shared/types/types';
import Page from '@/components/shared/ui/Page/Page';
import Substrate from '@/components/shared/ui/Substrate/Substrate';
import * as blockChainActions from '@/store/actions/networkCardano';
import { toast } from 'react-toastify';
import { THourSchedule } from '@/components/shared/types/types';
import { motion } from 'framer-motion';
import Sidebar from '@/components/features/SidebarES';
import s from './.module.scss';

const SpecialistProfile = () => {
  const router = useRouter();
  const { nickname } = router.query; // Use router.query.nickname
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const dispatch: AppDispatch = useDispatch();
  const userUid = useSelector(({ user }) => user.uid);
  const userData = useSelector(({ user }) => user?.userData);
  const selectedSpecialist = useSelector(({ specialists }) => specialists.selectedSpecialist);
  const myAppointments = useSelector(({ appointments }) => appointments.myAppointments);
  const draftAppointment = useSelector(({ appointments }) => appointments.draftAppointment);
  const ergoWalletConnected = useSelector(({ networkErgo }) => networkErgo.ergoWalletConnected);
  const t = loadMessages(currentLocale);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalendarCellSelected, setIsCalendarCellSelected] = useState(false);
  const [freeTimestamps, setFreeTimestamps] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [error, setError] = useState<string | null>(null); // Add error state

  useEffect(() => {
    if (nickname && typeof nickname === 'string') {
      setIsLoading(true);
      dispatch(getSelectedSpecialistByNickname(nickname))
        .then(() => setIsLoading(false))
        .catch(() => {
          setError('Failed to load specialist profile');
          setIsLoading(false);
        });
    } else if (!router.isFallback) {
      setError('Invalid nickname');
      setIsLoading(false);
    }
  }, [nickname, dispatch, router.isFallback]);

  useEffect(() => {
    if (userUid && selectedSpecialist?.nickname && userData?.nickname === selectedSpecialist?.nickname) {
      router.push('/dashboard');
    }
  }, [userUid, selectedSpecialist?.nickname, userData?.nickname, router]);

  const handleCalendarCellClick = () => {
    setIsCalendarCellSelected(true);
  };

  const onFreeHourClick = (hourSchedule: THourSchedule) => {
    // if (!ergoWalletConnected) {
    //   dispatch(blockChainActions.toggleWalletSelector());
    //   toast.warn(t.connect_your_wallet);
    //   return;
    // }

    const selectedUnixtime = selectedDate.setHours(hourSchedule.hour, 0, 0, 0) / 1000;

    dispatch(setDraftAppointment({
      ...draftAppointment,
      scheduledUnixtime: selectedUnixtime,
      specUid: selectedSpecialist?.uid,
      specNickname: selectedSpecialist?.nickname,
      specAvatar: selectedSpecialist?.avatar,
      psyRank: selectedSpecialist?.psyRank,
      price: selectedSpecialist?.price,
      selectedDate: format(selectedDate, 'dd LLLL yyyy'),
      selectedHour: hourSchedule.hour,
      services: selectedSpecialist?.services,
    }));
    dispatch(showModal(EModalKind.BookSession));
  };

  const specialistRequests = useMemo(() => {
    if (!Array.isArray(myAppointments) || !selectedSpecialist?.uid) {
      return [];
    }
    return myAppointments
      .filter((req) => req.specUid === selectedSpecialist.uid)
      .sort((a, b) => a.scheduledUnixtime - b.scheduledUnixtime);
  }, [myAppointments, selectedSpecialist]);

  const specialistActualFreeTimeslots = useMemo(() => {
    if (selectedSpecialist?.freeTimestamps) {
      return selectedSpecialist.freeTimestamps.filter(
        (ts) => !specialistRequests.some((req) => ts === req.scheduledUnixtime)
      );
    }
    return [];
  }, [specialistRequests, selectedSpecialist?.freeTimestamps]);

  const freeTimeSlotsOfSelectedDay = useMemo(() => {
    const selectedDayFreeTimestamps = specialistActualFreeTimeslots.filter(
      (ts) => {
        const iteratedDateString = format(new Date(ts * 1000), 'MM/dd/yyyy');
        const selectedDateString = format(selectedDate, 'MM/dd/yyyy');
        return iteratedDateString === selectedDateString;
      }
    );
    return selectedDayFreeTimestamps;
  }, [selectedDate, specialistActualFreeTimeslots]);

  const freeSchedule = useMemo(() => {
    const selectedDayFreeHours = freeTimeSlotsOfSelectedDay.map((ts) =>
      new Date(ts * 1000).getHours()
    );
    return Array.from({ length: 24 }, (_, hour) => ({
      hour,
      mark: selectedDayFreeHours.includes(hour)
        ? EScheduleMark.OPEN_FOR_WORK
        : EScheduleMark.BUSY,
      request: null,
    }));
  }, [freeTimeSlotsOfSelectedDay]);

  if (isLoading) {
    return <Page><Substrate>Loading...</Substrate></Page>;
  }

  if (error) {
    return <Page><Substrate>Error: {error}</Substrate></Page>;
  }

  if (!selectedSpecialist) {
    return <Page><Substrate>Specialist not found</Substrate></Page>;
  }

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
          <Page className={s.userboardPage}>
            <Substrate className={s.userboard} color="bg-color">
              <div className={s.timeTable}>
                <div className={s.rightColumn}>
                  <UserInfo />
                </div>
                {selectedSpecialist?.isAlive && (
                  <div className={s.leftColumn}>
                    {/* @ts-ignore */}
                    <SpecTableCalendar
                      currentDate={selectedDate}
                      setCurrentDate={setSelectedDate}
                      freeTimestamps={freeTimestamps}
                      specialistActualFreeTimeslots={specialistActualFreeTimeslots}
                    />
                    {/* @ts-ignore */}
                    <SpecHoursManager
                      onCellClick={onFreeHourClick}
                      currentDate={selectedDate}
                      selectedDaySchedule={freeSchedule}
                    />
                  </div>
                )}
              </div>
            </Substrate>
          </Page>
        </div>
      </div>
    </motion.div>
  );
};

export default SpecialistProfile;

