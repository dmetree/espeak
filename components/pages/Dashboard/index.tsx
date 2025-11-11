import { motion } from 'framer-motion';
import { useState } from 'react';
import styles from './styles.module.scss';
import Button from '@/components/shared/ui/Button';
import { useSelector } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import RoleSelector from '@/components/features/RoleSelector';
import Sidebar from '@/components/pages/Dashboard/Sidebar';
import Image from "next/image";

import girlSittedIcon from '@/components/shared/assets/image_icons/sitted-girl.svg';
import calendarIcon from '@/components/shared/assets/image_icons/calendar.svg';

import UpcomingLessons from '@/components/pages/Dashboard/UpcomingLessons';

export default function Dashboard() {
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);


  const [isReturningUser, setIsReturningUser] = useState(true);

  return (
    <motion.div
      className={`${styles.container} ${isReturningUser ? styles.second : styles.first}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {isReturningUser ? (
        // ---------- SECOND WELCOME (returning user)

        <div className={styles.page}>
            <div className={styles.mobileHeader}>
            <h1>
                <span className={styles.blue}>E</span>
                <span className={styles.black}>asy </span>
                <span className={styles.lightPink}>S</span>
                <span className={styles.black}>peak</span>
            </h1>
            </div>

            <div className={styles.sidebar}>
            <Sidebar />
            </div>

            <main className={styles.main}>
            {/* SVG kept unchanged */}
            <div className={styles.mainContent}>
                <div className={styles.topBar}>
                {/* <TopBar /> */}
                </div>
                <div className={styles.welcomeCard}>
                    <div className={styles.content}>
                        <div className={styles.textBlock}>
                        <h2>Hello!</h2>
                        <p>Today is a good day to learn something new.</p>
                        </div>

                        <div className={styles.buttonBlock}>
                        <button>Find a teacher</button>
                        </div>
                    </div>
                    <Image
                        src={girlSittedIcon}
                        alt={'mobile'}
                        width={213}
                        height={250}
                    />
                </div>
                <div className={styles.contentLayout}>

                <div className={styles.leftSection}>

                    <UpcomingLessons />

                </div>

                <div className={styles.rightSection}>
                    <h2>My calendar</h2>
                    <Image
                        src={calendarIcon}
                        alt={'calendar'}
                        width={410}
                        height={300}
                    />
                </div>
                </div>
            </div>
            </main>
        </div>
      ) : (
        <RoleSelector setIsReturningUser={setIsReturningUser} />
      )}
    </motion.div>
  );
}
