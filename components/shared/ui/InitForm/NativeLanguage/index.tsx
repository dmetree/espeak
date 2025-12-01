import React from 'react';
import styles from './NativeLanguage.module.scss';
import LanguageSelector from '@/components/shared/ui/LanguageSelector';
import { getAllLangOptions, loadMessages } from '@/components/shared/i18n/translationLoader';
import { useSelector } from 'react-redux';

export type NativeLanguageProps = {
  nativeLang: string;
  setNativeLang: (code: string) => void;
};

export const NativeLanguage: React.FC<NativeLanguageProps> = ({ nativeLang, setNativeLang }) => {
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);
  const langOptions = getAllLangOptions(t);

  const selectedOption =
    langOptions.find((opt) => opt.value === nativeLang) || null;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>What is your native language?</h1>
      <p className={styles.subtitle}>
        Please, choose your native language from the list below
      </p>

      <div className={styles.inputGroup}>
        <label htmlFor="name" className={styles.label}>Your native language</label>
        <LanguageSelector
          value={selectedOption}
          options={langOptions}
          onChange={(selected) => {
            if (!selected || Array.isArray(selected)) {
              setNativeLang('');
              return;
            }
            // single select -> Option
            setNativeLang(selected.value);
          }}
          t={t}
          isMulti={false}
          placeholder={'Choose the language'}
        />
      </div>
    </div>
  );
};
