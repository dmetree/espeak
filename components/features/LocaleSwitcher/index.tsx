"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { SUPPORTED_LOCALES2 } from "@/components/shared/i18n/locales";
import { setLocale } from "@/store/actions/locale";
import s from "./.module.scss";

const locales = Object.entries(SUPPORTED_LOCALES2);

export default function LocaleSwitcher() {
  const dispatch = useDispatch();
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setLocale(e.target.value));
  };

  return (
    <section className={s.section}>
      <h4>Language</h4>
      <div className={s.dropdownWrapper}>
        <select
          value={currentLocale}
          onChange={handleChange}
          className={s.select}
        >
          {locales.map(([code, label]) => (
            <option key={code} value={code}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}
