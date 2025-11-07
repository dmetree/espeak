import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import s from './../.module.scss';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

type Props = {
  aboutText: { [langCode: string]: string };
  selectedLanguages: string[];
  activeLang: string;
  setActiveLang: (lang: string) => void;
  onChange: (lang: string, text: string) => void;
  t: any;
};


const AboutTextarea: React.FC<Props> = ({ aboutText, selectedLanguages, activeLang, setActiveLang, onChange, t }) => {

  return (
    <div className={s.aboutWrapper}>
      <label className={s.label}>{t.about}</label>

      {selectedLanguages.length > 1 && (
        <div className={s.langTabs}>
          {selectedLanguages.map((lang) => (
            <button
              key={lang}
              type="button"
              className={`${s.langTab} ${activeLang === lang ? s.active : ''}`}
              onClick={() => setActiveLang(lang)}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      <ReactQuill
        className={s.textarea}
        value={aboutText[activeLang] || ''}
        onChange={(value) => onChange(activeLang, value)}
        placeholder={t.write_about_you}
        theme="snow"
        modules={{
          toolbar: [
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link'],
            ['clean'],
          ],
        }}
      />
    </div>
  );
};

export default AboutTextarea;

