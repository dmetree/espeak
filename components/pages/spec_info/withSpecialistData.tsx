import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import { getSelectedSpecialistByNickname } from '@/store/actions/specialists';
import { AppDispatch } from '@/store';

export const withSpecialistData = (WrappedComponent, options: { mode: 'public' | 'self' }) => {
  return function ComponentWithSpecialistData(props) {
    const dispatch: AppDispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const t = loadMessages(currentLocale);

    const userData = useSelector(({ user }) => user?.userData);
    const selectedSpecialist = useSelector(({ specialists }) => specialists.selectedSpecialist);

    const isPublic = options.mode === 'public';

    useEffect(() => {
      if (isPublic && router.isReady && router.asPath.includes('/specialist-profile')) {
        const specNickname = router.asPath.split('/specialist-profile/')[1]?.replace('/', '');
        if (specNickname) {
          dispatch(getSelectedSpecialistByNickname(specNickname));
        }
      }
    }, [isPublic, router.isReady]);

    const specialistData = isPublic ? selectedSpecialist : userData;

    return (
      <WrappedComponent
        {...props}
        specialistData={specialistData}
        t={t}
        isPublic={isPublic}
        currentLocale={currentLocale}
      />
    );
  };
};
