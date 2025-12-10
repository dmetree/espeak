import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';

import { loadMessages } from '@/components/shared/i18n/translationLoader';
import DisplayPsyRequests from '@/components/features/DisplayPsyRequests';
import { AppDispatch } from "@/store";
import { fetchMyAppointments, fetchWorkAppointments } from '@/store/actions/appointments';
import { EUserRole } from '@/components/shared/types/types';

import styles from './styles.module.scss';

const UpcomingLessons = () => {
    const dispatch: AppDispatch = useDispatch<AppDispatch>();

    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const t = loadMessages(currentLocale);

    const userUid = useSelector(({ user }) => user.uid);
    const userData = useSelector(({ user }) => user?.userData);
    const userRole = userData?.userRole;
    const isTeacher = userRole === EUserRole.Specialist;

    const myAppointments = useSelector(({ appointments }) => appointments.myAppointments);
    const workAppointments = useSelector(({ appointments }) => appointments.workAppointments);

    const [activeTab, setActiveTab] = useState<'upcoming' | 'finished'>('upcoming');

    useEffect(() => {
        if (!userUid) return;

        if (isTeacher) {
            dispatch(fetchWorkAppointments(userUid));
        } else {
            dispatch(fetchMyAppointments(userUid));
        }
    }, [dispatch, userUid, isTeacher]);

    const currentTime = Math.floor(Date.now() / 1000);

    const studentUpcomingLessons = useMemo(() => {
        if (!myAppointments || !userUid) return [];

        return myAppointments
            .filter((req) => req.clientUid === userUid && req.scheduledUnixtime >= currentTime)
            .sort((a, b) => a.scheduledUnixtime - b.scheduledUnixtime);
    }, [myAppointments, userUid, currentTime]);

    const teacherUpcomingLessons = useMemo(() => {
        if (!workAppointments || !userUid) return [];

        return workAppointments
            .filter((req) => req.specUid === userUid && req.scheduledUnixtime >= currentTime)
            .sort((a, b) => a.scheduledUnixtime - b.scheduledUnixtime);
    }, [workAppointments, userUid, currentTime]);

    const teacherFinishedLessons = useMemo(() => {
        if (!workAppointments || !userUid) return [];

        // Finished lessons where the teacher hasn't claimed rewards yet
        // are represented by past workAppointments that are still present
        // (they will be removed once rewards are claimed).
        return workAppointments
            .filter((req) => req.specUid === userUid && req.scheduledUnixtime < currentTime)
            .sort((a, b) => b.scheduledUnixtime - a.scheduledUnixtime);
    }, [workAppointments, userUid, currentTime]);

    const upcomingLessons = isTeacher ? teacherUpcomingLessons : studentUpcomingLessons;

    if (!isTeacher) {
        // Student view – only upcoming lessons
        return (
            <div className={styles.upcomingLessons}>
                <h2>{t.dashboard?.upcoming_lessons ?? 'Upcoming lessons'}</h2>
                <div className={styles.container}>
                    <DisplayPsyRequests requests={upcomingLessons} />
                </div>
            </div>
        );
    }

    // Teacher view – tabs for upcoming and finished (unclaimed) lessons
    const finishedLessons = teacherFinishedLessons;

    return (
        <div className={styles.upcomingLessons}>
            <div className={styles.tabsHeader}>
                <h2>{t.dashboard?.lessons ?? 'Lessons'}</h2>

                <div className={styles.tabs}>
                    <button
                        type="button"
                        className={`${styles.tab} ${activeTab === 'upcoming' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('upcoming')}
                    >
                        {t.dashboard?.upcoming_lessons ?? 'Upcoming lessons'}
                    </button>
                    <button
                        type="button"
                        className={`${styles.tab} ${activeTab === 'finished' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('finished')}
                    >
                        {t.dashboard?.finished_lessons ?? 'Finished lessons'}
                    </button>
                </div>
            </div>

            <div className={styles.container}>
                {activeTab === 'upcoming' ? (
                    <DisplayPsyRequests requests={upcomingLessons} />
                ) : (
                    <DisplayPsyRequests requests={finishedLessons} />
                )}
            </div>
        </div>
    );
}

export default UpcomingLessons;
