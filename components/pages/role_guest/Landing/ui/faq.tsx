import React, { useState } from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import s from './../landing.module.scss';

const FaqSection = () => {
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);
  const [open, setOpen] = useState<number | null>(0);

  const faqs = [
    { q: t.landing_faq.how_it_work_title, a: t.landing_faq.how_it_work_text },
    { q: t.landing_faq.is_anonymous_title, a: t.landing_faq.is_anonymous_text },
    { q: t.landing_faq.how_to_pay_title, a: t.landing_faq.how_to_pay_text },
    { q: t.landing_faq.can_i_trust_title, a: t.landing_faq.can_i_trust_text },
    { q: t.landing_faq.how_to_start_title, a: t.landing_faq.how_to_start_text },
  ];

  return (
    <section className={s.faqSection}>
      <div className={s.faqTextCol}>
        <h2>{t.landing_faq_title ?? 'Any questions?'}</h2>
        <p className={s.faqSub}>
          {t.landing_faq_sub ??
            'Find answers to common questions about how our language learning application works, privacy, and cryptocurrency transactions.'}
        </p>
      </div>

      <ul className={s.faqAccordion}>
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <li key={f.q} className={s.faqItem}>
              <button
                className={s.faqButton}
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                <span className={s.question}>{f.q}</span>
                <span className={clsx(s.chevron, { [s.open]: isOpen })} />
              </button>
              <div
                className={clsx(s.answerWrapper, { [s.show]: isOpen })}
                style={{
                  maxHeight: isOpen ? '200px' : '0',
                }}
              >
                <p className={s.answer}>{f.a}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default FaqSection;
