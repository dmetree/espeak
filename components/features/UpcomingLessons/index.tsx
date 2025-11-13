import { availableLessons } from '@/components/features/UpcomingLessons/mock';

import { useSelector, useDispatch } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';

import styles from './styles.module.scss'
import H4TitleBold from '@/components/shared/ui/Titles/h4-bold';

import { AppDispatch } from "@/store";
import { useEffect } from 'react';
import { fetchMyAppointments } from '@/store/actions/appointments';

const UpcomingLessons = () => {
    const dispatch: AppDispatch = useDispatch<AppDispatch>();
    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const t = loadMessages(currentLocale);


    const userUid = useSelector(({ user }) => user.uid);
    const myAppointments = useSelector(({ appointments }) => appointments.myAppointments);
    // TODO: pass myApointments into the component below.

    useEffect(() => {
        dispatch(fetchMyAppointments(userUid));
    }, [dispatch, userUid]);


    return (
        <div className={styles.upcomingLessons}>
            <H4TitleBold>Upcoming lessons</H4TitleBold>
            <div className={styles.container}>
                {availableLessons?.length > 0 ? (
                    availableLessons?.map((lesson) => (
                        <div key={lesson.id} className={styles.card}>
                            <div className={styles.header}>
                                <h4 className={styles.title}>{lesson.title}</h4>
                                <span className={styles.teacher}>{t.teacher}: {lesson.teacher}</span>
                            </div>

                            <div className={styles.details}>
                                <div className={styles.left}>
                                    <p className={styles.date}>{lesson.date}</p>
                                    <p className={styles.time}>
                                        {lesson.timeStart} - {lesson.timeEnd}
                                    </p>
                                </div>
                                <div className={styles.footer}>
                                    <a
                                        href={lesson.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.link}
                                    >
                                        {t.join_class} {'\u2197'}
                                    </a>
                                </div>
                            </div>

                        </div>
                    ))
                ) : (
                    <p className={styles.empty}>
                        {t.no_lessons}
                    </p>
                )}
            </div>


        </div>
    )
}

export default UpcomingLessons;
