'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import { actionUpdateProfile } from '@/store/actions/profile/user';
import { loadMessages } from '@/components/shared/i18n/translationLoader';

import OnboardingLayout from './steps/01_OnboardingLayout';
import LanguageSelector from './steps/02_LanguageSelector';
import TeacherTypeSelector from './steps/03_TeacherTypeSelector';
import VerificationStep from './steps/04_VerificationStep';
import TeacherInfoForm from './steps/05_TeacherInfoForm';

const BecomeTeacherPath = () => {
    const dispatch: AppDispatch = useDispatch();
    const userUid = useSelector(({ user }) => user.uid);
    const userData = useSelector(({ user }) => user.userData);
    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const t = loadMessages(currentLocale);

    const [step, setStep] = useState(1);
    const [nativeLang, setNativeLang] = useState('');
    const [targetLang, setTargetLang] = useState('');
    const [teacherType, setTeacherType] = useState('');
    const [verificationFile, setVerificationFile] = useState<File | null>(null);
    const [teacherInfo, setTeacherInfo] = useState({});

    // Mock language list
    const LANG_OPTIONS = [
        { code: 'en', name: 'English', flag: '/flags/en.png' },
        { code: 'es', name: 'Spanish', flag: '/flags/es.png' },
        { code: 'fr', name: 'French', flag: '/flags/fr.png' },
        { code: 'de', name: 'German', flag: '/flags/de.png' },
        { code: 'pt', name: 'Portuguese', flag: '/flags/pt.png' },
    ];

    const handleNext = () => {
        if (step === 6) {
            const updatedData = {
                ...userData,
                role: 'teacher',
                nativeLang,
                targetLang,
                teacherType,
                verified: !!verificationFile,
                teacherInfo,
                firstVisit: false,
                updatedAt: new Date().toISOString(),
            };
            dispatch(actionUpdateProfile(updatedData, userUid));
        } else {
            setStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(prev => prev - 1);
    };

    return (
        <>
            {step === 1 && (
                <OnboardingLayout
                    title="What is your native language?"
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
                    title="What language do you want to teach?"
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
                    title="What type of teacher are you?"
                    onNext={handleNext}
                    onBack={handleBack}
                    nextDisabled={!teacherType}
                >
                    <TeacherTypeSelector
                        selected={teacherType}
                        onSelect={setTeacherType}
                    />
                </OnboardingLayout>
            )}

            {step === 4 && (
                <OnboardingLayout
                    title="Verify your credentials"
                    subtitle="Upload your certificate or proof of qualification"
                    onNext={handleNext}
                    onBack={handleBack}
                    nextDisabled={!verificationFile}
                >
                    <VerificationStep
                        onUpload={e => {
                            const file = e.target.files?.[0];
                            if (file) setVerificationFile(file);
                        }}
                        uploadedFile={verificationFile}
                    />
                </OnboardingLayout>
            )}

            {step === 5 && (
                <OnboardingLayout
                    title="Tell us about your experience"
                    subtitle="Add your background, teaching experience, and hourly rate"
                    onNext={handleNext}
                    onBack={handleBack}
                >
                    <TeacherInfoForm onSubmit={(data) => {
                        setTeacherInfo(data);
                        setStep(6);
                    }} />
                </OnboardingLayout>
            )}

            {step === 6 && (
                <OnboardingLayout
                    title="All set!"
                    subtitle="You’re ready to start teaching!"
                    onNext={handleNext}
                    onBack={handleBack}
                >
                    <p>Click -Finish- to save your profile and start connecting with students.</p>
                    <button>FINISH</button>
                </OnboardingLayout>
            )}
        </>
    );
};

export default BecomeTeacherPath;
