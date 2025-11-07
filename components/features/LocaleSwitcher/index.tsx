import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SUPPORTED_LOCALES, SUPPORTED_LOCALES2 } from '@/components/shared/i18n/locales';
import { setLocale } from '@/store/actions/locale';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import { showModal } from '@/store/actions/modal'; // Assuming actions are in this file
import { EModalKind } from "@/components/shared/types";
import s from './.module.scss';

const locales = Object.entries(SUPPORTED_LOCALES2);

export default function LocalSwitcher() {
  const dispatch = useDispatch();
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);


  const showLangModal = () => {
    dispatch(showModal(EModalKind.LangModal));
  }


  return (

    <>
      {/* Trigger Button */}
      <div className={s.label} onClick={showLangModal} suppressHydrationWarning={true}>
        {currentLocale.toUpperCase()}
      </div>

    </>
  );
}
