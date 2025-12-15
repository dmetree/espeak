import Image from 'next/image';
import { useSelector } from 'react-redux';
import Button from '@/components/shared/ui/Button';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import earthIcon from '@/components/shared/assets/image_icons/earth.svg';
import s from './../landing.module.scss';

const BottomCta = () => {
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);

  return (
    <section className={s.bottomCta}>
      <div className={s.illustrationWrapper}>
        <Image
          src={earthIcon}
          alt="earth"
          className={s.illustration}
          width={400}
          height={250}
        />
      </div>

      <div className={s.content}>
        <h3>{t.landing_bottom.title}</h3>
        <p>{t.landing_bottom.text}</p>
        <Button variant="main" onClick={() => console.log('Clicked!')}>
          {t.common.get_started}
        </Button>
      </div>
    </section>
  );
};

export default BottomCta;
