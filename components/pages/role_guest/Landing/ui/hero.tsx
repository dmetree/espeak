import React from 'react';
import { useSelector } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import Button from '@/components/shared/ui/Button';
import s from './../landing.module.scss';

const HeroSection = () => {
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);

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
        <Button variant="main" onClick={() => console.log('Clicked!')}>
          {t.common.get_started}
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
