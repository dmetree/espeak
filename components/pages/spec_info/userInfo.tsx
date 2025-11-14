import React, { useMemo } from 'react';
import Image from 'next/image';
import parse from 'html-react-parser';
import { getLocalizedContent } from '@/hooks/localize';
import { Tooltip } from '@/components/shared/ui/Tooltip/Tooltip';
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";

import s from './.module.scss';
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
    <div className={s.psyInfoBoard}>
      <div className={s.nameRank}>
        <div className={s.initBlock}>
          {specialistData?.avatar ? (
            <img className={s.profileImg} src={specialistData.avatar} alt="Avatar" />
          ) : <div className={s.profileImg} />}<div className={s.gridAreaInfo}>
            <div className={s.nameAndActions}>
              <div>
                <span className={s.psyName}>{specialistData?.nickname}</span>

              </div>

              <div className={s.shareWrapper}>
                <div className={s.shareProfile} onClick={handleShareClick}>&#128279;</div>
                <div className={s.tooltipBox}>
                  <Tooltip title={t.shareLinkTooltip} />
                </div>
              </div>

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
