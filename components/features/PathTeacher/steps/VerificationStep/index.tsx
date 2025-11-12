import React from 'react';
import styles from './VerificationStep.module.scss';

const VerificationStep = ({ onUpload, uploadedFile }) => (
  <div className={styles.verification}>
    <h1 className={styles.title}>Verify credentials</h1>
    <p className={styles.subtitle}>
      We ensure the highest quality education by verifying the credentials of our professional teachers.
    </p>

    <label className={styles.uploadButton}>
      Upload
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={onUpload}
        className={styles.hiddenInput}
      />
    </label>

    {uploadedFile ? (
      <p className={styles.fileName}>Uploaded: {uploadedFile.name}</p>
    ) : (
      <p className={styles.helperText}>
        Please, upload scanned documents showing your professional training and experience. Example: Accredited
        certification in language teaching or documents showing suitable experience as a professional language teacher.
      </p>
    )}
  </div>
);

export default VerificationStep;
