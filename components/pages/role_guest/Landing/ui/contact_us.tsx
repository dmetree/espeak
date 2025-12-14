import Image from 'next/image';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Button from '@/components/shared/ui/Button';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import s from './../landing.module.scss';

import girlWithEarthIcon from '@/components/shared/assets/image_icons/girl-with-earth.svg';
import { Input } from '@/components/shared/ui/Input/Input';

const ContactSection = () => {
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);

  const [agree, setAgree] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: submit form
  };

  return (
    <section className={s.contact}>
      <div className={s.contact__left}>
        <h2>{t.landing_contact.title}</h2>
        <p className={s.contactSub}>{t.landing_contact.sub}</p>

        <form className={s.form} onSubmit={onSubmit}>
          <div className={s.form__names}>
            <Input
              mode="basic"
              label={t.landing_contact.first_name}
              placeholder={t.landing_contact.first_name}
            />

            <Input
              mode="basic"
              label={t.landing_contact.last_name}
              placeholder={t.landing_contact.last_name}
            />
          </div>

          <Input
            mode="basic"
            label={t.landing_contact.email}
            placeholder={t.landing_contact.email}
            type="email"
          />

          <div className={s.spacer} />

          <textarea className={s.textarea} placeholder={t.landing_contact.message} />

          <label className={s.check}>
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            {t.landing_contact.agree}
          </label>

          <div className={s.actions}>
            <Button variant="main" type="submit">
              {t.common.send}
            </Button>
          </div>
        </form>
      </div>

      <Image src={girlWithEarthIcon} alt="mobile" width={600} height={600} />
    </section>
  );
};

export default ContactSection;
