import React from 'react';
import styles from './SubmissionSuccess.module.scss';

interface SubmissionSuccessProps {
  onNext: () => void;
}

const SubmissionSuccess: React.FC<SubmissionSuccessProps> = ({ onNext }) => {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Congratulations!</h1>

        <p className={styles.body}>
          Your teacher profile has been submitted successfully. Our team will now review the information you provided
          to verify your credentials. This process may take a little time, but we'll keep you updated on the progress.
        </p>

        <p className={styles.body}>
          Thank you for sharing your details with us. We're excited to have you as part of our educational community.
          If you have any questions or need assistance, please don't hesitate to reach out to our support team.
        </p>

        <p className={styles.body}>Looking forward to the next step in your teaching journey!</p>

        <button className={styles.linkButton} type="button">
          EasySpeak Team
        </button>

        <button className={styles.nextButton} type="button" onClick={onNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default SubmissionSuccess;
