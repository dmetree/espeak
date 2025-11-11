import { availableLessons } from '@/components/pages/Dashboard/mock';

import styles from './styles.module.scss'

const UpcomingLessons = () => {
    return (
        <div className={styles.upcomingLessons}>
            <h2>Upcoming lessons</h2>

            {availableLessons.length > 0 ? (
                availableLessons?.map((lesson) => (
                <div key={lesson.id} className={styles.card}>
                    <div className={styles.header}>
                    <h4 className={styles.title}>{lesson.title}</h4>
                    <span className={styles.teacher}>Teacher: {lesson.teacher}</span>
                    </div>

                    <div className={styles.details}>
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
                        Join class →
                    </a>
                    </div>
                </div>
                ))
            ) : (
                <p className={styles.empty}>
                Take the next step in your language adventure — book a lesson and continue your path to
                fluency!
                </p>
            )}

        </div>
    )
}

export default UpcomingLessons;
