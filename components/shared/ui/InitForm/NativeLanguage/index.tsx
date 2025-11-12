import React, { useState } from 'react';
import styles from './NativeLanguage.module.scss';
import LanguageSelector from '@/components/shared/ui/LanguageSelector';
import { getAllLangOptions, loadMessages } from '@/components/shared/i18n/translationLoader';
import { useSelector } from 'react-redux';

export const NativeLanguage = () => {


    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const t = loadMessages(currentLocale);
    const langOptions = getAllLangOptions(t);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>What is your native language?</h1>
      <p className={styles.subtitle}>
        Please, choose your native language from the list below
      </p>

      <div className={styles.inputGroup}>
        <label htmlFor="name" className={styles.label}>Your native language</label>
        <LanguageSelector
            // value={formData.language}
            value={''}
            options={langOptions}
            onChange={(lang) => console.log(lang)}
            // onChange={(val) =>
            //     setFormData({ ...formData, language: val as Option | null })
            // }
            t={t}
            isMulti={false}
            placeholder={'Choose the language'}
        />
      </div>
    </div>
  );
};
