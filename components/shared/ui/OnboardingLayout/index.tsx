import OnboardingFooter from '@/components/features/PathTeacher/OnboardingFooter';
import styles from './OnboardingLayout.module.scss';
import React from 'react';
import StepIndicator from '@/components/features/PathTeacher/StepIndicator';
import Button from '@/components/shared/ui/Button';

interface OnboardingLayoutProps {
    title: string;
    subtitle?: string;          // ✅ optional
    children: React.ReactNode;
    onNext: () => void;
    onBack?: () => void;        // ✅ optional
    nextDisabled?: boolean;     // ✅ optional
    currentStep?: number;
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
    title,
    subtitle,
    children,
    onNext,
    onBack,
    nextDisabled,
    currentStep,
}) => (
    <div className={styles.container}>
      <svg className={styles.background} viewBox="0 0 720 950" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <g clipPath="url(#clip0)">
          <circle cx="55" cy="861" r="268" fill="#BBC2FA" />
          <circle cx="192.5" cy="75.5" r="266.5" fill="#BBC2FA" />
          <circle cx="393.5" cy="724.5" r="232.5" fill="#FEF6EB" />
          <circle cx="165" cy="408" r="227" fill="#FEF6EB" />
          <circle cx="459" cy="819" r="229" fill="#BBC2FA" />
          <circle cx="623" cy="696" r="229" fill="#BBC2FA" />
          <circle cx="661" cy="121" r="229" fill="#BBC2FA" />
          <circle cx="230" cy="194" r="147" fill="#FEF6EB" />
          <circle cx="470.5" cy="406.5" r="190.5" fill="#FEF6EB" />
        </g>
        <defs>
          <clipPath id="clip0">
            <rect width="720" height="950" rx="40" fill="white" />
          </clipPath>
        </defs>
      </svg>

      <div className={styles.blurOverlay} />

      <div className={styles.content}>
        <header className={styles.header}>
          <div className={styles.logo}>
            <span className={styles.logoE}>E</span>
            <span className={styles.logoText}>asy </span>
            <span className={styles.logoS}>S</span>
            <span className={styles.logoText}>peak</span>
          </div>
        </header>

        <div className={styles.mainContent}>
          <aside className={styles.sidebar}>
            <StepIndicator currentStep={currentStep} />
            <OnboardingFooter />
          </aside>

          <main className={styles.formArea}>
            {children}

            <div className={styles.buttonGroup}>
                <Button onClick={onBack} className={styles.returnBtn}>
                    Return
                </Button>
                <Button onClick={onNext} className={styles.nextBtn}>
                    Next
                </Button>
            </div>
          </main>
        </div>
      </div>
    </div>
);

export default OnboardingLayout;
