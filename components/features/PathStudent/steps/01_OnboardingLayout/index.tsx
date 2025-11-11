import styles from './OnboardingLayout.module.scss';
import React from 'react';

interface OnboardingLayoutProps {
    title: string;
    subtitle?: string;          // ✅ optional
    children: React.ReactNode;
    onNext: () => void;
    onBack?: () => void;        // ✅ optional
    nextDisabled?: boolean;     // ✅ optional
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
    title,
    subtitle,
    children,
    onNext,
    onBack,
    nextDisabled,
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

          <div className={styles.headerActions}>
            <TopBar />
            <button className={styles.logoutBtn}>Log out</button>
          </div>
        </header>

        <div className={styles.mainContent}>
          <aside className={styles.sidebar}>
            <StepIndicator currentStep={currentStep} />
            <OnboardingFooter />
          </aside>

          <main className={styles.formArea}>
            {children}
          </main>
        </div>
      </div>
    </div>
    // <div className={styles.container}>
    //     <h1>{title}</h1>
    //     {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    //     <div className={styles.content}>{children}</div>

    //     <div className={styles.footer}>
    //         {onBack && (
    //             <button onClick={onBack} className={styles.back}>
    //                 Back
    //             </button>
    //         )}
    //         <button
    //             onClick={onNext}
    //             disabled={nextDisabled}
    //             className={styles.next}
    //         >
    //             {onBack ? 'Next' : 'Start'}
    //         </button>
    //     </div>
    // </div>
);

export default OnboardingLayout;
