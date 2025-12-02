'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import { actionUpdateProfile } from '@/store/actions/profile/user';
import { loadMessages } from '@/components/shared/i18n/translationLoader';

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
import SubmissionSuccess from '@/components/features/PathTeacher/steps/SubmissionSuccess';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/components/shared/utils/firebase/init';

const BecomeTeacherPath = () => {
    const router = useRouter();
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

    const uploadDiploma = async (file: File, userId: string) => {
        const diplomaRef = ref(storage, `teacherApplications/${userId}/diploma-${file.name}`);
        await uploadBytes(diplomaRef, file);
        return getDownloadURL(diplomaRef);
    };

    const handleNext = async () => {
        if (step === 6) {
            await submitTeacherApplicaition();
            setStep(7);
        } else {
            setStep(prev => prev + 1);
        }
    };

    const handleFinish = () => {
        dispatch(hideModal(EModalKind.PathTeacher));
        router.push('/dashboard');
    };

    const handleBack = () => {
        if (step > 1) setStep(prev => prev - 1);
    };

    const handleQuit = () => {
        dispatch(hideModal(EModalKind.PathTeacher));
    };

    const submitTeacherApplicaition = async () => {
        try {
            let diplomaUrl = userData?.teacherApplication?.diploma || null;

            if (diplomaFile) {
                diplomaUrl = await uploadDiploma(diplomaFile, userUid);
            }

            const updatedData = {
                ...userData,
                userRole: EUserRole.Specialist,
                firstVisit: false,
                teacherApplication: {
                    nativeLang,
                    targetLang,
                    teacherType,
                    diploma: diplomaUrl,
                    teacherInfo,
                    updatedAt: new Date().toISOString(),
                },
            };

            await dispatch(actionUpdateProfile(updatedData, userUid));
            toast.success('Application to Become a Teacher Submitted');
        } catch (error) {
            console.error('Error submitting teacher application', error);
            toast.error('Failed to submit application. Please try again.');
        }
    };


    return (
        <>
            {step === 1 && (
                <OnboardingLayout
                    title="What is your name/nickname?"
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
                    title="What is your native language?"
                    onNext={handleNext}
                    onBack={handleBack}
                    nextDisabled={!nativeLang}
                >
                    <NativeLanguage
                        nativeLang={nativeLang}
                        setNativeLang={setNativeLang}
                    />
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
                // nextDisabled={!diplomaFile}
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

            {step === 6 && (
                <OnboardingLayout
                    title="Tell us about your experience"
                    subtitle="Add your background, teaching experience, and hourly rate"
                    onNext={handleNext}
                    onBack={handleBack}
                >
                    <TeacherInfoForm />
                </OnboardingLayout>
            )}

            {step === 7 && (
                <SubmissionSuccess onNext={handleFinish} />
            )}
        </>
    );
};

export default BecomeTeacherPath;
