import Image from 'next/image';
import { useSelector } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';

import peopleWithChatIcon from '@/components/shared/assets/image_icons/people-with-chat.svg';
import peopleWithSearchIcon from '@/components/shared/assets/image_icons/girl-with-search.svg';
import peopleWithCardanoIcon from '@/components/shared/assets/image_icons/people-with-cardano.svg';

import s from './../landing.module.scss';


const FeatureCards = () => {
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);

  const features = [
    { title: t.landing_features.crypto_title, text: t.landing_features.crypto_text, icon: peopleWithCardanoIcon, width: 300, height: 200 },
    { title: t.landing_features.anon_title, text: t.landing_features.anon_text, icon: peopleWithChatIcon, width: 300, height: 200 },
    { title: t.landing_features.app_title, text: t.landing_features.app_text, badge: t.landing_features.badge, icon: peopleWithSearchIcon, width: 240, height: 240 },
  ];

  return (
<div className={s.featureCards}>
      {features.map((f) => (
        <article key={f.title} className={f.badge ? s.cardPrimary : s.card}>
          {!f.badge && (
            <div className={s.cardIconWrapper}>
              <Image
                src={f.icon}
                alt={f.title}
                className={s.cardIcon}
                width={f.width}
                height={f.height}
              />
            </div>
          )}

          <h4>{f.title}</h4>
          <p>{f.text}</p>

          {f.badge && (
            <>
              <div className={s.badge}>{f.badge}</div>
              <div className={s.cardIconWrapperBottom}>
                <Image
                  src={f.icon}
                  alt={f.title}
                  className={s.cardIcon}
                  width={f.width}
                  height={f.height}
                />
              </div>
            </>
          )}
        </article>
      ))}
    </div>
  );
};

export default FeatureCards;
