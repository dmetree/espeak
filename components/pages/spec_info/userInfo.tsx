import React, { useMemo } from 'react';
import Image from 'next/image';
import parse from 'html-react-parser';
import { getLocalizedContent } from '@/hooks/localize';
import { Tooltip } from '@/components/shared/ui/Tooltip/Tooltip';
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";

import styles from './.module.scss';
import Link from 'next/link';

const UserInfo = ({ specialistData, t, isPublic, currentLocale }) => {


  const handleShareClick = () => {
    const { origin, pathname } = window.location;

    // Decide which URL to share
    const pageUrl = pathname === "/office/"
      ? `${origin}/specialist-profile/${specialistData?.nickname}`
      : `${origin}${pathname}`;

    navigator.clipboard.writeText(pageUrl)
      .then(() => {
        console.log("URL copied:", pageUrl);
        toast.success(t.specialist_url_copied);
      })
      .catch(err => {
        console.error("Failed to copy URL:", err);
        toast.error(t.specialist_url_copied_fail);
      });
  };


  if (!specialistData) return null;

  console.log('specialistData?.introVideo', specialistData?.introVideo)

  return (
    // <div className={s.psyInfoBoard}>
    //   <div className={s.nameRank}>
    //     <div className={s.initBlock}>
    //       {specialistData?.avatar ? (
    //         <img className={s.profileImg} src={specialistData.avatar} alt="Avatar" />
    //       ) : <div className={s.profileImg} />}<div className={s.gridAreaInfo}>
    //         <div className={s.nameAndActions}>
    //           <div>
    //             <span className={s.psyName}>{specialistData?.nickname}</span>
    //           </div>

    //           <div className={s.actions}>
    //             {!isPublic && (
    //               <Link href="/edit_profile" className={s.profileBtn}>
    //                 {t.specialist_edit_profile}
    //               </Link>
    //             )}

    //             <div className={s.shareWrapper}>
    //               <div className={s.shareProfile} onClick={handleShareClick}>&#128279;</div>
    //               <div className={s.tooltipBox}>
    //                 <Tooltip title={t.shareLinkTooltip} />
    //               </div>
    //             </div>
    //           </div>

    //         </div>

    //         <div className={s.paramsBlock}>
    //           <div className={s.paramItem}>
    //             <span className={s.paramItemTitle}>{t.specialist_personal_therapy}</span>
    //             <span className={s.paramNumber}>{specialistData?.hrInPsy}</span>
    //             <span className={s.unitsOfMeasure}>{t.specialist_personal_therapy_hours}</span>
    //           </div>
    //           <div className={s.paramItem}>
    //             <span className={s.paramItemTitle}>{t.specialist_client_sessions}</span>
    //             <span className={s.paramNumber}>{specialistData?.hrPsy}</span>
    //             <span className={s.unitsOfMeasure}>{t.specialist_client_sessions_hours}</span>
    //           </div>
    //           <div className={s.paramItem}>
    //             <span className={s.paramItemTitle}>{t.specialist_psy_education}</span>
    //             <span className={s.paramNumber}>{specialistData?.hrEducation}</span>
    //             <span className={s.unitsOfMeasure}>{t.specialist_psy_education_hours}</span>
    //           </div>
    //           <div className={s.paramItem}>
    //             <span className={s.paramItemTitle}>{t.specialist_in_profession}</span>
    //             <span className={s.paramNumber}>{specialistData?.inProfessionSince}</span>
    //             <span className={s.unitsOfMeasure}>{t.specialist_in_profession_year}</span>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   {!specialistData?.isAlive && (
    //     <div className={s.yearsOfLife}>
    //       {specialistData?.yearOfBirth} - {specialistData?.yearOfDeath}
    //     </div>
    //   )}

    //   {specialistData?.psySpecialities?.length > 0 && (
    //     <div className={s.psyMethods}>
    //       <span className={s.psyMethodsLabel}>{t.specialist_expert_in}</span>
    //       <div className={s.psyMethodList}>
    //         {specialistData?.psySpecialities?.map((speciality) => (
    //           <span className={s.psyMethod} key={speciality}>
    //             {t['psy-speciality'][speciality] || speciality}
    //           </span>
    //         ))}
    //       </div>
    //     </div>
    //   )}

    //   {specialistData?.psyMethods?.length > 0 && (
    //     <div className={s.psyMethods}>
    //       <span className={s.psyMethodsLabel}>{t.specialist_psy_methods}</span>
    //       <div className={s.psyMethodList}>
    //         {specialistData.psyMethods.map((method) => (
    //           <span className={s.psyMethod} key={method}>
    //             {t['psy-methods'][method] || method}
    //           </span>
    //         ))}
    //       </div>
    //     </div>
    //   )}

    //   {specialistData?.myTeachers?.length > 0 && (
    //     <div className={s.teachers}>
    //       <span className={s.teachersLabel}>{t.specialist_teachers_supervisiors}</span>
    //       <div className={s.teachersList}>
    //         {specialistData.myTeachers.map((teacher) => (
    //           <span className={s.teacher} key={teacher}>{teacher}</span>
    //         ))}
    //       </div>
    //     </div>
    //   )}

    //   {specialistData?.isAlive && specialistData?.languages?.length > 0 && (
    //     <div className={s.languages}>
    //       <span className={s.languagesLabel}>{t.specialist_languages}</span>
    //       <div className={s.languagesList}>
    //         {specialistData.languages.map((language) => (
    //           <span className={s.language} key={language}>{t['user-languages'][language]}</span>
    //         ))}
    //       </div>
    //     </div>
    //   )}

    //   {specialistData?.introVideo && (
    //     <div className={s.about_video}>
    //       <a
    //         href={specialistData.introVideo}
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         {t.your_introduction_video}
    //       </a>
    //     </div>
    //   )}

    //   {specialistData?.infoAbout && (
    //     <div className={s.about_block}>
    //       <div className={s.servicesLabel}>{t.about}</div>
    //       <div className={s.infoAbout}>
    //         {parse(getLocalizedContent(specialistData.infoAbout, currentLocale))}
    //       </div>
    //     </div>
    //   )}

    //   {specialistData?.services?.length > 0 && (
    //     <div className={s.services}>
    //       <div className={s.servicesLabel}>{t.specialist_services}</div>
    //       <div className={s.serviceList}>
    //         {specialistData.services.map((service, index) => (
    //           <div key={index} className={s.serviceItem}>
    //             <div className={s.generalInfo}>
    //               <div className={s.serviceTitle}>{getLocalizedContent(service.title, currentLocale)}</div>
    //               <div className={s.servicePrice}>${service.price / 100} / {service.length}min.</div>
    //             </div>
    //             <div className={s.description}>{parse(getLocalizedContent(service.description, currentLocale))}</div>
    //           </div>
    //         ))}
    //       </div>
    //     </div>
    //   )}
    // </div>
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>My profile</h1>
          <button className={styles.editButton}>Edit</button>
        </div>

        <div className={styles.content}>
          <div className={styles.profileSection}>
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/1511ba036a33e82d57c74c1d6bfdba0636f16395?width=280"
              alt="Profile"
              className={styles.profileImage}
            />
            <div className={styles.profileInfo}>
              <div className={styles.profileHeader}>
                <h2 className={styles.profileName}>Adam Smith</h2>
                <p className={styles.profileRole}>Teacher</p>
              </div>
              <p className={styles.profileLanguage}>
                <span className={styles.label}>Speaks:</span>
                <span className={styles.value}>English</span>
              </p>
              <p className={styles.profileLanguage}>
                <span className={styles.label}>Teaches:</span>
                <span className={styles.value}>English</span>
              </p>
            </div>
          </div>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>About me</h3>
            <p className={styles.sectionText}>
              Hi! I am Adam. Experienced English teacher, 20 years of
              experience. And 1k+ classes on iTalki in 2 years. During my spare
              time I love reading books, writing articles, and listening to
              music. Watching and debating movies is also one my favorite
              passtimes. Having the opportunity to travel around the world, I
              have been to China, Turkey, France, Russia etc, I managed to grasp
              the very importance of language and its communicative aspects.
            </p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Interesting topics</h3>
            <div className={styles.topicsContainer}>
              <span className={styles.topic}>Traveling</span>
              <span className={styles.topic}>Films $ TV Series</span>
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Timezone</h3>
            <p className={styles.sectionText}>
              Living in London, United Kingdom (GMT+01:00)
            </p>
          </section>

          <section className={styles.videoSection}>
            <div className={styles.videoText}>
              <h3 className={styles.sectionTitle}>My introduction video</h3>
              <p className={`${styles.sectionText} ${styles.muted}`}>
                No video at this moment, please upload your introduction video.
              </p>
            </div>
            <button className={styles.uploadButton}>Upload</button>
          </section>

          <section className={styles.priceSection}>
            <h3 className={styles.sectionTitle}>Price (per lesson)</h3>
            <p className={styles.priceValue}>15 $</p>
          </section>

          <div className={styles.statsCard}>
            <div className={styles.statItem}>
              <svg
                className={styles.starIcon}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.4687 22.4997C18.3109 22.5004 18.1568 22.4511 18.0286 22.3591L12 17.9885L5.97139 22.3591C5.84259 22.4525 5.68742 22.5026 5.52832 22.502C5.36921 22.5014 5.21441 22.4502 5.08629 22.3559C4.95818 22.2615 4.86339 22.1289 4.81563 21.9771C4.76787 21.8254 4.76961 21.6623 4.82061 21.5116L7.17186 14.5474L1.07811 10.3685C0.946113 10.2781 0.846491 10.1478 0.793797 9.99675C0.741103 9.84568 0.7381 9.68172 0.785225 9.52883C0.83235 9.37593 0.927135 9.24211 1.05573 9.14692C1.18432 9.05173 1.33999 9.00016 1.49998 8.99974H9.0178L11.2865 2.01771C11.3354 1.86697 11.4308 1.73558 11.559 1.6424C11.6871 1.54922 11.8415 1.49902 12 1.49902C12.1584 1.49902 12.3128 1.54922 12.441 1.6424C12.5692 1.73558 12.6645 1.86697 12.7134 2.01771L14.9822 9.00208H22.5C22.6602 9.002 22.8162 9.05322 22.9452 9.14823C23.0741 9.24323 23.1693 9.37704 23.2167 9.53005C23.2642 9.68307 23.2613 9.84724 23.2087 9.99854C23.1561 10.1498 23.0564 10.2803 22.9242 10.3708L16.8281 14.5474L19.178 21.5097C19.216 21.6225 19.2267 21.7426 19.2092 21.8603C19.1917 21.978 19.1464 22.0898 19.0771 22.1865C19.0078 22.2832 18.9165 22.3621 18.8107 22.4165C18.7049 22.471 18.5877 22.4995 18.4687 22.4997Z"
                  fill="#FFC245"
                />
              </svg>
              <p className={styles.statValue}>5.0</p>
            </div>
            <p className={styles.statValue}>1 000 lessons</p>
            <p className={styles.statValue}>200 students</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
