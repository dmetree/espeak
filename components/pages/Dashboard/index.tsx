import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import styles from './styles.module.scss';
import Button from '@/components/shared/ui/Button';
import { useSelector } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import RoleSelector from '@/components/features/RoleSelector';
import { EUserRole } from '@/components/shared/types';

import Image from "next/image";

import girlSittedIcon from '@/components/shared/assets/image_icons/sitted-girl.svg';
import teacherMainImage from '@/components/shared/assets/image_icons/main-image-teacher.svg';
import calendarIcon from '@/components/shared/assets/image_icons/calendar.svg';

import UpcomingLessons from '@/components/features/UpcomingLessons';
import H4TitleBold from '@/components/shared/ui/Typography/h4-bold';
import TableCalendar from '@/components/pages/role_spec/Office/ui/TableCalendar';
import router from 'next/router';
import Sidebar from '@/components/features/SidebarES';

export default function Dashboard() {
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);
  const userUid = useSelector(({ user }) => user.uid);
  const userData = useSelector(({ user }) => user?.userData);
  const myAppointments = useSelector(({ appointments }) => appointments.myAppointments);

  const isTeacher = userData?.userRole === EUserRole.Specialist;
  const firstVisit = useSelector(({ user }) => user?.userData?.firstVisit);

  const [firstTime, setFirstTime] = useState();

  useEffect(() => {
    setFirstTime(firstVisit)
  }, [firstVisit]);

  const [freeTimestamps, setFreeTimestamps] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleFindTeacher = () => {
    router.push('/view_experts');
  }

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

  useEffect(() => {
    if (userData?.freeTimestamps) {
      setFreeTimestamps(userData?.freeTimestamps);
    }
  }, [userData?.freeTimestamps]);

  console.log('isTeacher', isTeacher)

  return (
    <motion.div
      className={`${styles.container} ${firstTime ? styles.first : styles.second}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {!firstTime ? (

        <div className={styles.page}>
          {/* <div className={styles.mobileHeader}>
            <h1>
              <span className={styles.blue}>E</span>
              <span className={styles.black}>asy </span>
              <span className={styles.lightPink}>S</span>
              <span className={styles.black}>peak</span>
            </h1>
          </div> */}

          <Sidebar />

          <main className={styles.main}>
            {/* SVG kept unchanged */}
            <div className={styles.mainContent}>
              <div className={styles.welcomeCard}>
                <div className={styles.content}>
                  <div className={styles.heroCard}>
                    <div className={styles.heroContent}>
                      <h1 className={styles.heroTitle}>Hello!</h1>
                      <p className={styles.heroSubtitle}>
                        Today is a good day to learn something new.
                      </p>
                    </div>
                    <div className={styles.heroImageSection}>
                      <Image
                          src={isTeacher ? teacherMainImage : girlSittedIcon}
                          alt={isTeacher ? 'Teacher' : 'Student'}
                          width={150}
                          height={250}
                      />
                      {!isTeacher && (
                          <div className={styles.buttonBlock}>
                              <Button onClick={handleFindTeacher}>Find a teacher</Button>
                          </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
              <div className={styles.contentLayout}>

                <div className={styles.leftSection}>
                  <UpcomingLessons />
                </div>

                <div className={styles.rightSection}>
                  <H4TitleBold>My calendar</H4TitleBold>

                  <TableCalendar
                    currentDate={selectedDate}
                    setCurrentDate={setSelectedDate}
                    myRequests={myRequests}
                    freeTimestamps={freeTimestamps}
                    onCellClick={undefined}
                    specialistActualFreeTimeslots={freeTimestamps}
                  />
                </div>
              </div>
            </div>
          </main>
        </div>
      ) : (
        <RoleSelector />
      )}
    </motion.div>
  );
}
