import { motion } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import styles from './styles.module.scss';
import Button from '@/components/shared/ui/Button';
import { useSelector } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import { RadioButton, RadioButtonGroup } from '@/components/shared/ui/RadioButtonGroup';

export default function Dashboard() {
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);

  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [isReturningUser, setIsReturningUser] = useState(true);

  const handleChooseClick = () => {
    console.log('Выбран вариант:', selectedValue);
    if (selectedValue) setIsReturningUser(true);
  };

  const handleGetStarted = () => {
    console.log('GetStarted clicked');
  };

  return (
    <motion.div
      className={`${styles.container} ${isReturningUser ? styles.second : styles.first}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {isReturningUser ? (
        // ---------- SECOND WELCOME (returning user)
        <>
          <div className={styles.imageContainer}>
            <div className={styles.secondAccentLight} />
            <div className={styles.secondPrimaryLight} />
            <Image
              src="/images/learning-everywhere.svg"
              alt={t.welcome.second.imageAlt}
              width={631}
              height={470}
              className={styles.image}
              priority={false}
              loading="lazy"
            />
          </div>

          <div className={styles.textSection}>
            <div className={styles.secondTextWrapper}>
              <h1>{t.welcome.second.title}</h1>
              <p className={styles.mobileText}>{t.welcome.second.mobileDescription}</p>
              <p className={styles.desktopText}>{t.welcome.second.desktopDescription}</p>
            </div>

            <Button onClick={handleGetStarted}>
              {t.welcome.second.getStarted}
            </Button>
          </div>
        </>
      ) : (
        // ---------- FIRST WELCOME (new user)
        <>
          <div className={styles.firstAccentLight} />
          <div className={styles.firstPrimaryLight} />

          <div className={styles.firstTextWrapper}>
            <h1>{t.welcome.first.title}</h1>
            <p>{t.welcome.first.subtitle}</p>

            <RadioButtonGroup
              defaultValue={selectedValue || undefined}
              onValueChange={setSelectedValue}
              className={styles.radioGroup}
            >
              <RadioButton value="wantToLearn">
                <div className={styles.radioItem}>
                  <span className={styles.bold}>{t.welcome.first.learnOption.title}</span>
                  <span>{t.welcome.first.learnOption.description}</span>
                </div>
              </RadioButton>

              <RadioButton value="wantToTeach">
                <div className={styles.radioItem}>
                  <span className={styles.bold}>{t.welcome.first.teachOption.title}</span>
                  <span>{t.welcome.first.teachOption.description}</span>
                </div>
              </RadioButton>
            </RadioButtonGroup>
          </div>

          <Button
            disabled={!selectedValue}
            onClick={handleChooseClick}
            className={styles.chooseButton}
          >
            {t.welcome.first.choose}
          </Button>
        </>
      )}
    </motion.div>
  );
}
