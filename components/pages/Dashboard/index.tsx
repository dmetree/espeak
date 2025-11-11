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

export default function Dashboard() {
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);
  const firstVisit = useSelector(({ user }) => user?.userData?.firstVisit);


  return (
    <motion.div
      className={`${styles.container} ${firstVisit ? styles.first : styles.second}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {!firstVisit ? (
        // ---------- SECOND WELCOME (returning user)
        //         <>
        //           <div className={styles.imageContainer}>
        //             <div className={styles.secondAccentLight} />
        //             <div className={styles.secondPrimaryLight} />
        //             {/* <Image
        //               src="/images/learning-everywhere.svg"
        //               alt={t.welcome.second.imageAlt}
        //               width={631}
        //               height={470}
        //               className={styles.image}
        //               priority={false}
        //               loading="lazy"
        //             /> */}
        //           </div>
        // {/*
        //           <div className={styles.textSection}>
        //             <div className={styles.secondTextWrapper}>
        //               <h1>{t.welcome.second.title}</h1>
        //               <p className={styles.mobileText}>{t.welcome.second.mobileDescription}</p>
        //               <p className={styles.desktopText}>{t.welcome.second.desktopDescription}</p>
        //             </div>

        //             <Button onClick={handleGetStarted}>
        //               {t.welcome.second.getStarted}
        //             </Button>
        //           </div> */}
        //         </>

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


                  <div className={styles.upcomingLessons}>
                    <h2>Upcoming lessons</h2>
                    <p>
                      Take the next step in your language adventure — book a lesson and
                      continue your path to fluency!
                    </p>
                  </div>
                </div>

                <div className={styles.rightSection}>
                  {/* <Calendar /> */}
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
