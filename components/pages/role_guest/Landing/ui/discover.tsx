import Image from 'next/image';
import { useSelector } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import girlWithMobileIcon from '@/components/shared/assets/image_icons/girl-with-mobile.svg';
import s from './../landing.module.scss';

const DiscoverSection = () => {
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);

  return (
    <section className={s.discover}>
      <div className={s.discoverText}>
        <h2>{t.landing_discover.title}</h2>
        <p>{t.landing_discover.text}</p>
      </div>
      <Image
        src={girlWithMobileIcon}
        alt={'mobile'}
        width={600}
        height={600}
      />
    </section>
  );
};

export default DiscoverSection;
