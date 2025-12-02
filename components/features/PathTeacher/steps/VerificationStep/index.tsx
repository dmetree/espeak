import React, { useEffect, useState } from 'react';
import styles from './VerificationStep.module.scss';

interface VerificationStepProps {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadedFile: File | null;
}

type UploadState = 'idle' | 'error' | 'success' | 'verified';

const VerificationStep: React.FC<VerificationStepProps> = ({ onUpload, uploadedFile }) => {
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [file, setFile] = useState<File | null>(uploadedFile);

  useEffect(() => {
    setFile(uploadedFile);
    if (uploadedFile) {
      setUploadState('success');
    }
  }, [uploadedFile]);

  useEffect(() => {
    if (uploadState !== 'success') return;

    const timer = setTimeout(() => {
      setUploadState('verified');
    }, 5000);

    return () => clearTimeout(timer);
  }, [uploadState]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    const allowedExtensions = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'];
    const maxSizeBytes = 5 * 1024 * 1024; // 5 MB

    const extension = selectedFile.name.split('.').pop()?.toLowerCase() ?? '';
    const isExtensionValid = allowedExtensions.includes(extension);
    const isSizeValid = selectedFile.size <= maxSizeBytes;

    if (!isExtensionValid || !isSizeValid) {
      setUploadState('error');
      setFile(selectedFile);
      return;
    }

    setUploadState('success');
    setFile(selectedFile);
    onUpload(e);
  };

  if (uploadState === 'verified') {
    return (
      <div className={styles.verification}>
        <div className={styles.successCard}>
          <h2 className={styles.successCardTitle}>Documents uploaded successfully!</h2>
          <p className={styles.successCardBody}>
            Thank you for submitting your documents. We're now in the process of verifying your credentials. This may
            take a little while, but rest assured, we're working diligently to ensure the highest standards. We'll
            notify you once the verification process is complete.
          </p>
          <p className={styles.successCardBody}>
            If you have any questions or concerns, feel free to reach out to our support team.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.verification}>
      <h1 className={styles.title}>Verify credentials</h1>
      <p className={styles.subtitle}>
        We ensure the highest quality education by verifying the credentials of our professional teachers.
      </p>

      <label className={styles.uploadButton}>
        Upload
        <input
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className={styles.hiddenInput}
        />
      </label>

      {file && (
        <div className={styles.fileChipWrapper}>
          <div className={styles.fileChip}>
            <span className={styles.fileChipName}>{file.name}</span>
            <button
              type="button"
              className={styles.fileChipRemove}
              onClick={() => {
                setFile(null);
                setUploadState('idle');
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {uploadState === 'error' && (
        <div className={styles.errorState}>
          <div className={styles.errorBanner} />
          <p className={styles.errorText}>
            <strong>Oops!</strong> It seems like the document you're trying to upload is in the wrong format or exceeds
            the size limit. Please ensure that the document is in the correct format (e.g., PDF, DOCX) and meets the
            size requirements specified. If you need assistance, feel free to reach out to our support team for further
            guidance. Thank you!
          </p>
        </div>
      )}

      {uploadState === 'success' && (
        <p className={styles.successText}>Document uploaded successfully</p>
      )}

      {uploadState === 'idle' && !file && (
        <p className={styles.helperText}>
          Please, upload scanned documents showing your professional training and experience. Example: Accredited
          certification in language teaching or documents showing suitable experience as a professional language
          teacher.
        </p>
      )}
    </div>
  );
};

export default VerificationStep;
