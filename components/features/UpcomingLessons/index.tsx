import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';

import { loadMessages } from '@/components/shared/i18n/translationLoader';
import DisplayPsyRequests from '@/components/features/DisplayPsyRequests';
import { AppDispatch } from "@/store";
import { fetchMyAppointments, fetchWorkAppointments } from '@/store/actions/appointments';
import { EUserRole, EReqStatus } from '@/components/shared/types/types';

import styles from './styles.module.scss';

const ACTIVE_UPCOMING_STATUSES: EReqStatus[] = [
    EReqStatus.Accepted,
    EReqStatus.CallTime,
    EReqStatus.Calling,
    EReqStatus.CallInProgress,
];

const FINISHED_STATUSES: EReqStatus[] = [
    EReqStatus.Finished,
    EReqStatus.Archived,
];

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

    const [activeTab, setActiveTab] = useState<'upcoming' | 'requests' | 'finished'>('upcoming');

    useEffect(() => {
        if (!userUid) return;

        if (isTeacher) {
            dispatch(fetchWorkAppointments(userUid));
        } else {
            dispatch(fetchMyAppointments(userUid));
        }
    }, [dispatch, userUid, isTeacher]);

    const currentTime = Math.floor(Date.now() / 1000);

    // Student: upcoming = lessons already accepted by teacher, requests = not yet accepted
    const studentUpcomingLessons = useMemo(() => {
        if (!myAppointments || !userUid) return [];

        return myAppointments
            .filter(
                (req) =>
                    req.clientUid === userUid &&
                    ACTIVE_UPCOMING_STATUSES.includes(req.status) &&
                    req.scheduledUnixtime >= currentTime,
            )
            .sort((a, b) => a.scheduledUnixtime - b.scheduledUnixtime);
    }, [myAppointments, userUid, currentTime]);

    const studentRequests = useMemo(() => {
        if (!myAppointments || !userUid) return [];

        return myAppointments
            .filter(
                (req) =>
                    req.clientUid === userUid &&
                    req.status === EReqStatus.Open &&
                    req.scheduledUnixtime >= currentTime,
            )
            .sort((a, b) => a.scheduledUnixtime - b.scheduledUnixtime);
    }, [myAppointments, userUid, currentTime]);

    // Teacher: upcoming = accepted lessons, requests = direct lesson requests, finished = finished lessons
    const teacherUpcomingLessons = useMemo(() => {
        if (!workAppointments || !userUid) return [];

        return workAppointments
            .filter(
                (req) =>
                    req.specUid === userUid &&
                    ACTIVE_UPCOMING_STATUSES.includes(req.status) &&
                    req.scheduledUnixtime >= currentTime,
            )
            .sort((a, b) => a.scheduledUnixtime - b.scheduledUnixtime);
    }, [workAppointments, userUid, currentTime]);

    const teacherRequests = useMemo(() => {
        if (!workAppointments || !userUid) return [];

        return workAppointments
            .filter(
                (req) =>
                    req.specUid === userUid &&
                    req.status === EReqStatus.Open &&
                    req.scheduledUnixtime >= currentTime,
            )
            .sort((a, b) => a.scheduledUnixtime - b.scheduledUnixtime);
    }, [workAppointments, userUid, currentTime]);

    const teacherFinishedLessons = useMemo(() => {
        if (!workAppointments || !userUid) return [];

        return workAppointments
            .filter(
                (req) => {
                    // Must be the teacher's lesson
                    if (req.specUid !== userUid) return false;

                    // Include lessons with Finished or Archived status
                    if (FINISHED_STATUSES.includes(req.status)) return true;

                    // Also include lessons that have passed their scheduled time
                    // and were accepted (not just open requests)
                    if (req.scheduledUnixtime < currentTime &&
                        ACTIVE_UPCOMING_STATUSES.includes(req.status)) {
                        return true;
                    }

                    return false;
                }
            )
            .sort((a, b) => b.scheduledUnixtime - a.scheduledUnixtime);
    }, [workAppointments, userUid, currentTime]);

    if (!isTeacher) {
        // Student view – two tabs: upcoming (accepted) and requests (awaiting teacher)
        return (
            <div className={styles.upcomingLessons}>
                <div className={styles.tabsHeader}>
                    <h2>{t.dashboard?.lessons ?? 'Lessons'}</h2>

                    <div className={styles.tabs}>
                        <button
                            type="button"
                            className={`${styles.tab} ${
                                activeTab === 'upcoming' ? styles.tabActive : ''
                            }`}
                            onClick={() => setActiveTab('upcoming')}
                        >
                            {t.dashboard?.upcoming_lessons ?? 'Upcoming lessons'}
                        </button>
                        <button
                            type="button"
                            className={`${styles.tab} ${
                                activeTab === 'requests' ? styles.tabActive : ''
                            }`}
                            onClick={() => setActiveTab('requests')}
                        >
                            {t.dashboard?.requests ?? 'Requests'}
                        </button>
                    </div>
                </div>

                <div className={styles.container}>
                    {activeTab === 'upcoming' ? (
                        <DisplayPsyRequests requests={studentUpcomingLessons} />
                    ) : (
                        <DisplayPsyRequests requests={studentRequests} />
                    )}
                </div>
            </div>
        );
    }

    // Teacher view – three tabs: upcoming, requests, finished
    return (
        <div className={styles.upcomingLessons}>
            <div className={styles.tabsHeader}>
                <h2>{t.dashboard?.lessons ?? 'Lessons'}</h2>

                <div className={styles.tabs}>
                    <button
                        type="button"
                        className={`${styles.tab} ${
                            activeTab === 'upcoming' ? styles.tabActive : ''
                        }`}
                        onClick={() => setActiveTab('upcoming')}
                    >
                        {t.dashboard?.upcoming_lessons ?? 'Upcoming lessons'}
                    </button>
                    <button
                        type="button"
                        className={`${styles.tab} ${
                            activeTab === 'requests' ? styles.tabActive : ''
                        }`}
                        onClick={() => setActiveTab('requests')}
                    >
                        {t.dashboard?.requests ?? 'Requests'}
                    </button>
                    <button
                        type="button"
                        className={`${styles.tab} ${
                            activeTab === 'finished' ? styles.tabActive : ''
                        }`}
                        onClick={() => setActiveTab('finished')}
                    >
                        {t.dashboard?.finished_lessons ?? 'Finished lessons'}
                    </button>
                </div>
            </div>

            <div className={styles.container}>
                {activeTab === 'upcoming' && (
                    <DisplayPsyRequests requests={teacherUpcomingLessons} />
                )}
                {activeTab === 'requests' && (
                    <DisplayPsyRequests requests={teacherRequests} />
                )}
                {activeTab === 'finished' && (
                    <DisplayPsyRequests requests={teacherFinishedLessons} />
                )}
            </div>
        </div>
    );
}

export default UpcomingLessons;
