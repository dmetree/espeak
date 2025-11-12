'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import { actionUpdateProfile } from '@/store/actions/profile/user';
import {  loadMessages } from '@/components/shared/i18n/translationLoader';

import OnboardingLayout from '../../shared/ui/OnboardingLayout';
import TeacherTypeSelector from './steps/TeacherTypeSelector';
import { hideModal } from '@/store/actions/modal';
import { EModalKind, EUserRole } from '@/components/shared/types';
import { toast } from 'react-toastify';
import { NameInput } from '@/components/shared/ui/InitForm/NicknameField';
import { NativeLanguage } from '@/components/shared/ui/InitForm/NativeLanguage';
import { LanguageToLaernAndTeach } from '@/components/shared/ui/InitForm/LanguageToLearn';
import VerificationStep from '@/components/features/PathTeacher/steps/VerificationStep';
import TeacherInfoForm from '@/components/features/PathTeacher/steps/TeacherInfoForm';

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
    const [diplomaFile, setDiplomaFile] = useState<File | null>(null);
    const [teacherInfo, setTeacherInfo] = useState({});


    const handleNext = () => {
        if (step === 6) {
            submitTeacherApplicaition();
        } else {
            setStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(prev => prev - 1);
    };

    const handleQuit = () => {
        dispatch(hideModal(EModalKind.PathTeacher));
    }


    const submitTeacherApplicaition = () => {
        const updatedData = {
            ...userData,
            role: EUserRole.Specialist,
            firstVisit: false,
            teacherApplication: {
                nativeLang,
                targetLang,
                teacherType,
                diploma: !!diplomaFile,
                teacherInfo,
                updatedAt: new Date().toISOString()
            }
        };
        dispatch(actionUpdateProfile(updatedData, userUid));
        dispatch(hideModal(EModalKind.PathTeacher));
        toast.success("Application to Become a Teacher Submitted");
    }


    return (
        <>
            {step === 1 && (
                <OnboardingLayout
                    title="What is your native language?"
                    onNext={handleNext}
                    onBack={handleQuit}
                    nextDisabled={!nativeLang}
                    currentStep={0}
                >
                    <NameInput />
                </OnboardingLayout>
            )}

            {step === 2 && (
                <OnboardingLayout
                    title="What language do you want to teach?"
                    onNext={handleNext}
                    onBack={handleBack}
                    nextDisabled={!targetLang}
                >
                    <NativeLanguage />
                </OnboardingLayout>
            )}


            {step === 3 && (
                <OnboardingLayout
                    title="What language do you want to teach?"
                    onNext={handleNext}
                    onBack={handleBack}
                    nextDisabled={!targetLang}
                >
                    <LanguageToLaernAndTeach
                        nativeLang={nativeLang}
                        setNativeLang={setNativeLang}
                        targetLang={targetLang}
                        setTargetLang={setTargetLang}
                        role='teacher'
                    />
                </OnboardingLayout>
            )}

            {step === 4 && (
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

            {step === 5 && (
                <OnboardingLayout
                    title="Verify your credentials"
                    subtitle="Upload your certificate or proof of qualification"
                    onNext={handleNext}
                    onBack={handleBack}
                    nextDisabled={!diplomaFile}
                >
                    <VerificationStep
                        onUpload={e => {
                            const file = e.target.files?.[0];
                            if (file) setDiplomaFile(file);
                        }}
                        uploadedFile={diplomaFile}
                    />
                </OnboardingLayout>
            )}

            {step === 7 && (
                <OnboardingLayout
                    title="Tell us about your experience"
                    subtitle="Add your background, teaching experience, and hourly rate"
                    onNext={handleNext}
                    onBack={handleBack}
                >
                    <TeacherInfoForm
                    // onSubmit={(data) => {
                    //     setTeacherInfo(data);
                    //     setStep(7);
                    // }}
                    />
                </OnboardingLayout>
            )}

            {step === 8 && (
                <OnboardingLayout
                    title="All set!"
                    subtitle="You’re ready to start teaching!"
                    onNext={handleNext}
                    onBack={handleBack}
                >
                    <p>Click -Finish- to save your profile and start connecting with students.</p>
                    <button onClick={submitTeacherApplicaition}>FINISH</button>
                </OnboardingLayout>
            )}
        </>
    );
};

export default BecomeTeacherPath;
