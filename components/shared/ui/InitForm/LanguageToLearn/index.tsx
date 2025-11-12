import React, { useState } from 'react';
import styles from './NameInput.module.scss';
import LanguageSelectorWithFlags from '@/components/shared/ui/InitForm/LanguageSelectorWithFlags';

export const LanguageToLaernAndTeach = ({
  nativeLang,
  setNativeLang,
  targetLang,
  setTargetLang,
  role
}) => {


      const LANG_OPTIONS = [
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'es', name: 'Spanish', flag: '🇪🇸' },
        { code: 'fr', name: 'French', flag: '🇫🇷' },
        { code: 'de', name: 'German', flag: '🇩🇪' },
        { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {role === 'teacher' ? 'What language you want to teach?' : 'What language you want to learn?'}
      </h1>
      <p className={styles.subtitle}>
        {role === 'teacher' ? 'Please, choose the language(s) you want to teach' : 'Please, choose the language(s) you want to learn'}
      </p>

      <div className={styles.inputGroup}>
        <LanguageSelectorWithFlags
            options={LANG_OPTIONS.filter(l => l.code !== nativeLang)}
            selected={targetLang}
            onChange={setTargetLang}
            showFlags={true}
            nativeLang={nativeLang}
            setNativeLang={setNativeLang}
            targetLang={targetLang}
            setTargetLang={setTargetLang}
        />
      </div>
    </div>
  );
};
