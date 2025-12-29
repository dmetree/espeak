import OnboardingFooter from '@/components/features/PathTeacher/OnboardingFooter';
import styles from './OnboardingLayout.module.scss';
import React from 'react';
import StepIndicator from '@/components/features/PathTeacher/StepIndicator';
import Button from '@/components/shared/ui/Button';
import MobileStepIndicator from '@/components/features/PathTeacher/MobileStepIndicator';

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
    <div className={styles.card}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <span className={styles.logoE}>E</span>
          <span className={styles.logoText}>asy </span>
          <span className={styles.logoS}>S</span>
          <span className={styles.logoText}>peak</span>
        </div>

        <div className={styles.stepsContainer}>
          <StepIndicator currentStep={currentStep} />
        </div>

        <OnboardingFooter />
      </aside>


      <MobileStepIndicator currentStep={currentStep}
        // if teacher 
        totalSteps={6}
      // if student
      //  totalSteps={5}
      />


      <main className={styles.formArea}>
        {/* {title && (
            <div className={styles.titleSection}>
              <h1 className={styles.title}>{title}</h1>
              {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </div>
          )} */}

        <div className={styles.formScroll}>{children}</div>

        <div className={styles.buttonGroup}>
          {onBack && (
            <Button onClick={onBack} className={styles.returnBtn}>
              Return
            </Button>
          )}
          <Button
            onClick={onNext}
            className={styles.nextBtn}
            disabled={nextDisabled}
          >
            Next
          </Button>
        </div>
      </main>
    </div>
  </div>
);

export default OnboardingLayout;
