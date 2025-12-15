import React from 'react';
import { useSelector } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import s from './../landing.module.scss';

const StepsSection = () => {
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);

  const steps = [
    { title: t.landing_steps.step1_title, text: t.landing_steps.step1_text },
    { title: t.landing_steps.step2_title, text: t.landing_steps.step2_text },
    { title: t.landing_steps.step3_title, text: t.landing_steps.step3_text },
  ];

  return (
    <section className={s.steps}>
      <h2 className={s.title}>{t.landing_steps.title}</h2>

      <div className={s.stepsGrid}>
        {steps.map((step, i) => (
          <div key={i} className={s.step}>
            <div className={s.numberWrapper}>
              <span className={s.number}>{i + 1}</span>
              {i < steps.length - 1 && <span className={s.line}></span>}
            </div>
            <div className={s.stepContent}>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StepsSection;
