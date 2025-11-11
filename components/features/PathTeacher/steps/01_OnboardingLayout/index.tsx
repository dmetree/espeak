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
        <h1>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        <div className={styles.content}>{children}</div>

        <div className={styles.footer}>
            {onBack && (
                <button onClick={onBack} className={styles.back}>
                    Back
                </button>
            )}
            <button
                onClick={onNext}
                disabled={nextDisabled}
                className={styles.next}
            >
                {onBack ? 'Next' : 'Start'}
            </button>
        </div>
    </div>
);

export default OnboardingLayout;
