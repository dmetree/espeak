import { useSelector, useDispatch } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';

import styles from './styles.module.scss'
import H4TitleBold from '@/components/shared/ui/Titles/h4-bold';
import DisplayPsyRequests from '@/components/features/DisplayPsyRequests';

import { AppDispatch } from "@/store";
import { useEffect } from 'react';
import { fetchMyAppointments } from '@/store/actions/appointments';

const UpcomingLessons = () => {
    const dispatch: AppDispatch = useDispatch<AppDispatch>();
    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const t = loadMessages(currentLocale);


    const userUid = useSelector(({ user }) => user.uid);
    const myAppointments = useSelector(({ appointments }) => appointments.myAppointments);

    useEffect(() => {
        dispatch(fetchMyAppointments(userUid));
    }, [dispatch, userUid]);


    return (
        <div className={styles.upcomingLessons}>
            <H4TitleBold>Upcoming lessons</H4TitleBold>
            <div className={styles.container}>
                <DisplayPsyRequests requests={myAppointments} />
            </div>


        </div>
    )
}

export default UpcomingLessons;
