'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import { actionUpdateProfile } from '@/store/actions/profile/user';
import { loadMessages } from '@/components/shared/i18n/translationLoader';

import OnboardingLayout from './steps/01_OnboardingLayout';
import LanguageSelector from './steps/02_LanguageSelector';
import LevelSelector from './steps/03_LevelSelector';
import PurposeSelector from './steps/04_PurpuseSelector';
import { EModalKind, EUserRole } from '@/components/shared/types';
import { toast } from 'react-toastify';
import { hideModal } from '@/store/actions/modal';

const BecomeStudentPath = () => {
    const dispatch: AppDispatch = useDispatch();
    const userUid = useSelector(({ user }) => user.uid);
    const userData = useSelector(({ user }) => user.userData);
    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const t = loadMessages(currentLocale);

    const [step, setStep] = useState(1);
    const [nativeLang, setNativeLang] = useState('');
    const [targetLang, setTargetLang] = useState('');
    const [level, setLevel] = useState('');
    const [purpose, setPurpose] = useState('');

    // Mock language list
    const LANG_OPTIONS = [
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'es', name: 'Spanish', flag: '🇪🇸' },
        { code: 'fr', name: 'French', flag: '🇫🇷' },
        { code: 'de', name: 'German', flag: '🇩🇪' },
        { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    ];

    const handleNext = () => {
        if (step === 4) {
            submitStudentInfo();
        } else {
            setStep(prev => prev + 1);
        }
    };

    const handleBack = () => setStep(prev => Math.max(1, prev - 1));

    const submitStudentInfo = () => {
        const updatedData = {
            ...userData,
            role: EUserRole.Novice,
            firstVisit: false,
            studentInfo: {
                nativeLang,
                targetLang,
                level,
                purpose,

                updatedAt: new Date().toISOString(),
            }
        };
        dispatch(actionUpdateProfile(updatedData, userUid));
        dispatch(hideModal(EModalKind.PathStudent));
        toast.success("Thanks for sharing!")
    }

    return (
        <>
            {step === 1 && (
                <OnboardingLayout
                    title="What is your native language?"
                    subtitle="Please, choose your native language from the list below."
                    onNext={handleNext}
                    nextDisabled={!nativeLang}
                >
                    <LanguageSelector
                        options={LANG_OPTIONS}
                        selected={nativeLang}
                        onChange={setNativeLang}
                        showFlags={false}
                    />
                </OnboardingLayout>
            )}

            {step === 2 && (
                <OnboardingLayout
                    title="What language do you want to learn?"
                    subtitle="Select the language you want to start learning."
                    onNext={handleNext}
                    onBack={handleBack}
                    nextDisabled={!targetLang}
                >
                    <LanguageSelector
                        options={LANG_OPTIONS.filter(l => l.code !== nativeLang)}
                        selected={targetLang}
                        onChange={setTargetLang}
                        showFlags={true}
                    />
                </OnboardingLayout>
            )}

            {step === 3 && (
                <OnboardingLayout
                    title="What is your current level of knowledge?"
                    subtitle={`Choose the option that best describes your ${targetLang || 'target'} level.`}
                    onNext={handleNext}
                    onBack={handleBack}
                    nextDisabled={!level}
                >
                    <LevelSelector selected={level} onSelect={setLevel} />
                </OnboardingLayout>
            )}

            {step === 4 && (
                <OnboardingLayout
                    title="What is your purpose for learning?"
                    subtitle="Choose your main motivation for studying this language."
                    onNext={handleNext}
                    onBack={handleBack}
                    nextDisabled={!purpose}
                >
                    <PurposeSelector selected={purpose} onSelect={setPurpose} />
                </OnboardingLayout>
            )}
        </>
    );
};

export default BecomeStudentPath;
