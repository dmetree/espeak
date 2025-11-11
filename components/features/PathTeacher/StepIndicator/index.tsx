import { Heart, Globe, GraduationCap, Star } from "lucide-react";
import styles from "./StepIndicator.module.scss";

interface Step {
  icon: React.ReactNode;
  label: string;
}

const steps: Step[] = [
  { icon: <Heart size={40} />, label: "Your native language" },
  { icon: <Globe size={40} />, label: "The language you want to learn" },
  { icon: <GraduationCap size={40} />, label: "Your current level of knowledge" },
  { icon: <Star size={40} />, label: "The purpose of learning language" },
];

interface StepIndicatorProps {
  currentStep?: number;
}

export default function StepIndicator({ currentStep = 0 }: StepIndicatorProps) {
  return (
    <div className={styles.container}>
      {steps.map((step, index) => (
        <div
          key={index}
          className={`${styles.step} ${index === currentStep ? styles.active : ""}`}
        >
          <div className={styles.icon}>{step.icon}</div>
          <div className={styles.label}>{step.label}</div>
        </div>
      ))}
    </div>
  );
}
