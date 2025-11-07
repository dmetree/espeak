import React, { useMemo } from 'react';
import Image from 'next/image';
import parse from 'html-react-parser';
import { getLocalizedContent } from '@/hooks/localize';
import { Tooltip } from '@/components/shared/ui/Tooltip/Tooltip';
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";

import Belt1 from '@/components/shared/assets/img/belts/e001_belt.webp';
import Belt2 from '@/components/shared/assets/img/belts/e002_belt.webp';
import Belt3 from '@/components/shared/assets/img/belts/e003_belt.webp';
import Belt4 from '@/components/shared/assets/img/belts/e004_belt.webp';
import Belt5 from '@/components/shared/assets/img/belts/e005_belt.webp';
import Belt6 from '@/components/shared/assets/img/belts/e006_belt.webp';
import Belt7 from '@/components/shared/assets/img/belts/e007_belt.webp';
import Belt8 from '@/components/shared/assets/img/belts/e008_belt.webp';
import Belt9 from '@/components/shared/assets/img/belts/e009_belt.webp';
import Belt10 from '@/components/shared/assets/img/belts/e010_belt.webp';

import s from './.module.scss';
import Link from 'next/link';

const UserInfo = ({ specialistData, t, isPublic, currentLocale }) => {
  const belts = useMemo(() => [
    Belt1, Belt2, Belt3, Belt4, Belt5,
    Belt6, Belt7, Belt8, Belt9, Belt10
  ], []);

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

  const psyBelt = belts[specialistData?.psyRank - 1];

  if (!specialistData) return null;

  console.log('specialistData?.introVideo', specialistData?.introVideo)

  return (
    <div className={s.psyInfoBoard}>
      <div className={s.nameRank}>
        <div className={s.initBlock}>
          {specialistData?.avatar ? (
            <img className={s.profileImg} src={specialistData.avatar} alt="Avatar" />
          ) : <div className={s.profileImg} />}<div className={s.gridAreaInfo}>
            <div className={s.nameAndActions}>
              <div>
                <span className={s.psyName}>{specialistData?.nickname}</span>
                <div className={s.rankBlock}>
                  <span className={s.rankLabel}>{t.specialist_rank}</span>
                  <span className={s.rankLabel}>{specialistData?.psyRank}</span>
                  <Image className={s.belt} src={psyBelt} alt="Psy belt" width={20} height={20} loading="lazy" />
                </div>
              </div>

              <div className={s.shareWrapper}>
                <div className={s.shareProfile} onClick={handleShareClick}>&#128279;</div>
                <div className={s.tooltipBox}>
                  <Tooltip title={t.shareLinkTooltip} />
                </div>
              </div>
              {/* {!isPublic && (
                <button className={s.profileBtn} onClick={() => console.log('Edit profile')}>
                  <svg
                    width="20px"
                    height="20px"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    className={s.edit}
                  >
                    <path d="M21 22H3C2.59 22 2.25 21.66 2.25 21.25C2.25 20.84 2.59 20.5 3 20.5H21C21.41 20.5 21.75 20.84 21.75 21.25C21.75 21.66 21.41 22 21 22Z" />
                    <path d="M19.0206 3.48162C17.0806 1.54162 15.1806 1.49162 13.1906 3.48162L11.9806 4.69162C11.8806 4.79162 11.8406 4.95162 11.8806 5.09162C12.6406 7.74162 14.7606 9.86162 17.4106 10.6216C17.4506 10.6316 17.4906 10.6416 17.5306 10.6416C17.6406 10.6416 17.7406 10.6016 17.8206 10.5216L19.0206 9.31162C20.0106 8.33162 20.4906 7.38162 20.4906 6.42162C20.5006 5.43162 20.0206 4.47162 19.0206 3.48162Z" />
                    <path d="M15.6103 11.5308C15.3203 11.3908 15.0403 11.2508 14.7703 11.0908C14.5503 10.9608 14.3403 10.8208 14.1303 10.6708C13.9603 10.5608 13.7603 10.4008 13.5703 10.2408C13.5503 10.2308 13.4803 10.1708 13.4003 10.0908C13.0703 9.81078 12.7003 9.45078 12.3703 9.05078C12.3403 9.03078 12.2903 8.96078 12.2203 8.87078C12.1203 8.75078 11.9503 8.55078 11.8003 8.32078C11.6803 8.17078 11.5403 7.95078 11.4103 7.73078C11.2503 7.46078 11.1103 7.19078 10.9703 6.91078C10.9491 6.86539 10.9286 6.82022 10.9088 6.77532C10.7612 6.442 10.3265 6.34455 10.0688 6.60231L4.34032 12.3308C4.21032 12.4608 4.09032 12.7108 4.06032 12.8808L3.52032 16.7108C3.42032 17.3908 3.61032 18.0308 4.03032 18.4608C4.39032 18.8108 4.89032 19.0008 5.43032 19.0008C5.55032 19.0008 5.67032 18.9908 5.79032 18.9708L9.63032 18.4308C9.81032 18.4008 10.0603 18.2808 10.1803 18.1508L15.9016 12.4295C16.1612 12.1699 16.0633 11.7245 15.7257 11.5804C15.6877 11.5642 15.6492 11.5476 15.6103 11.5308Z" />
                  </svg>
                </button>
              )} */}
            </div>

            <div className={s.paramsBlock}>
              <div className={s.paramItem}>
                <span className={s.paramItemTitle}>{t.specialist_personal_therapy}</span>
                <span className={s.paramNumber}>{specialistData?.hrInPsy}</span>
                <span className={s.unitsOfMeasure}>{t.specialist_personal_therapy_hours}</span>
              </div>
              <div className={s.paramItem}>
                <span className={s.paramItemTitle}>{t.specialist_client_sessions}</span>
                <span className={s.paramNumber}>{specialistData?.hrPsy}</span>
                <span className={s.unitsOfMeasure}>{t.specialist_client_sessions_hours}</span>
              </div>
              <div className={s.paramItem}>
                <span className={s.paramItemTitle}>{t.specialist_psy_education}</span>
                <span className={s.paramNumber}>{specialistData?.hrEducation}</span>
                <span className={s.unitsOfMeasure}>{t.specialist_psy_education_hours}</span>
              </div>
              <div className={s.paramItem}>
                <span className={s.paramItemTitle}>{t.specialist_in_profession}</span>
                <span className={s.paramNumber}>{specialistData?.inProfessionSince}</span>
                <span className={s.unitsOfMeasure}>{t.specialist_in_profession_year}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!specialistData?.isAlive && (
        <div className={s.yearsOfLife}>
          {specialistData?.yearOfBirth} - {specialistData?.yearOfDeath}
        </div>
      )}

      {specialistData?.psySpecialities?.length > 0 && (
        <div className={s.psyMethods}>
          <span className={s.psyMethodsLabel}>{t.specialist_expert_in}</span>
          <div className={s.psyMethodList}>
            {specialistData?.psySpecialities?.map((speciality) => (
              <span className={s.psyMethod} key={speciality}>
                {t['psy-speciality'][speciality] || speciality}
              </span>
            ))}
          </div>
        </div>
      )}

      {specialistData?.psyMethods?.length > 0 && (
        <div className={s.psyMethods}>
          <span className={s.psyMethodsLabel}>{t.specialist_psy_methods}</span>
          <div className={s.psyMethodList}>
            {specialistData.psyMethods.map((method) => (
              <span className={s.psyMethod} key={method}>
                {t['psy-methods'][method] || method}
              </span>
            ))}
          </div>
        </div>
      )}

      {specialistData?.myTeachers?.length > 0 && (
        <div className={s.teachers}>
          <span className={s.teachersLabel}>{t.specialist_teachers_supervisiors}</span>
          <div className={s.teachersList}>
            {specialistData.myTeachers.map((teacher) => (
              <span className={s.teacher} key={teacher}>{teacher}</span>
            ))}
          </div>
        </div>
      )}

      {specialistData?.isAlive && specialistData?.languages?.length > 0 && (
        <div className={s.languages}>
          <span className={s.languagesLabel}>{t.specialist_languages}</span>
          <div className={s.languagesList}>
            {specialistData.languages.map((language) => (
              <span className={s.language} key={language}>{t['user-languages'][language]}</span>
            ))}
          </div>
        </div>
      )}

      {specialistData?.introVideo && (
        <div className={s.about_video}>
          <a
            href={specialistData.introVideo}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.your_introduction_video}
          </a>
        </div>
      )}

      {specialistData?.infoAbout && (
        <div className={s.about_block}>
          <div className={s.servicesLabel}>{t.about}</div>
          <div className={s.infoAbout}>
            {parse(getLocalizedContent(specialistData.infoAbout, currentLocale))}
          </div>
        </div>
      )}

      {specialistData?.services?.length > 0 && (
        <div className={s.services}>
          <div className={s.servicesLabel}>{t.specialist_services}</div>
          <div className={s.serviceList}>
            {specialistData.services.map((service, index) => (
              <div key={index} className={s.serviceItem}>
                <div className={s.generalInfo}>
                  <div className={s.serviceTitle}>{getLocalizedContent(service.title, currentLocale)}</div>
                  <div className={s.servicePrice}>${service.price / 100} / {service.length}min.</div>
                </div>
                <div className={s.description}>{parse(getLocalizedContent(service.description, currentLocale))}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
