import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { useRouter } from 'next/router';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import Button from '@/components/shared/ui/Button';
import s from './../landing.module.scss';
import { showModal } from '@/store/actions/modal';
import { EModalKind } from '@/components/shared/types/types';

const HeroSection = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const userUid = useSelector(({ user }) => user.uid);
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);


  const handleGetStarted = () => {
    if (userUid) router.push('/dashboard');
    else {
      dispatch(showModal(EModalKind.SignUp));
    }
  }

  return (
    <section className={s.hero}>
      <h1 className={s.heroTitle}>
        {t.landing_hero.part1}{' '}
        <br />
        <span className={s.brandBlue}>Easy</span>
        <span className={s.brandCoral}>Speak</span>{' '}
        {t.landing_hero.part2}
      </h1>
      <p className={s.heroSub}>{t.landing_hero.sub}</p>
      <div className={s.ctaRow}>
        <Button variant="main" onClick={handleGetStarted}>
          <span className={s.start}>{t.common.get_started}</span>
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
