import styles from "./MobileStepIndicator.module.scss";

interface StepIndicatorProps {
    totalSteps?: number;
    currentStep?: number;
}

export default function MobileStepIndicator({
    totalSteps,
    currentStep,
}: StepIndicatorProps) {
    return (
        <div className={styles.container}>
            {Array.from({ length: totalSteps }).map((_, index) => (
                <span
                    key={index}
                    className={`${styles.segment} ${index <= currentStep ? styles.active : ""
                        }`}
                />
            ))}
        </div>
    );
}
