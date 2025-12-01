import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import { loadMessages } from '@/components/shared/i18n/translationLoader';
import { hideModal } from '@/store/actions/modal';
import { setSelectedSpecialist } from '@/store/actions/specialists';
import { EModalKind } from '@/components/shared/types';

import styles from './styles.module.scss';

const SpecialistCardNew = ({ specialist }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);

  const onProfileClick = () => {
    if (specialist.nickname) {
      const formattedNickname = specialist.nickname.trim().replace(/\s+/g, '-');
      dispatch(setSelectedSpecialist(specialist));
      router.push(`/specialist-profile/${formattedNickname}`);
    }
    dispatch(hideModal(EModalKind.FindSpecialist));
  };

  return (
    <div className={styles.teacherCard}>
      <div className={styles.wrapper}>

        {/* PROFILE SECTION */}
        <div className={styles.profile}>
          <Image
            width={96}
            height={96}
            src={specialist?.avatar}
            alt={specialist?.nickname}
            className={styles.profileImage}
          />

          <div className={styles.info}>
            <div className={styles.nameWrapper}>
              <h3 className={styles.name}>
                {specialist?.nickname
                  ?.split(' ')
                  .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(' ')}
              </h3>
              <p className={styles.role}>
                {specialist.userRole}
              </p>
            </div>
          </div>
        </div>

        {/* TEXT SECTION */}
        <div className={styles.text}>
          <div className={styles.speaks}>
            <span className={styles.label}>Speaks:</span>
            <span className={styles.value}>
              {specialist.languages?.join(', ') || '—'}
            </span>
          </div>
        </div>
      </div>

    <div className={styles.text}>
        <div className={styles.speaks}>
            <span className={styles.value}>
                {specialist.infoAbout || '—'}
            </span>
        </div>
    </div>

      {/* FOOTER */}
      <div className={styles.footer}>
        <div className={styles.price}>
          <span className={styles.currency}>{t.consultation_price}</span>
          <span className={styles.amount}>
            {(specialist.price / 100)?.toFixed?.(2) || '—'} USD
          </span>
        </div>

        <button className={styles.bookButton} onClick={onProfileClick}>
          {t.look_the_profile}
        </button>
        <button className={styles.bookButton} onClick={onProfileClick}>
          Book Session
        </button>
      </div>
    </div>
  );
};

export default SpecialistCardNew;
