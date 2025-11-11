// components/onboarding/VerificationStep.tsx
import styles from './VerificationStep.module.scss';

const VerificationStep = ({ onUpload, uploadedFile }) => (
    <div className={styles.verification}>
        <p>
            Verify credentials by uploading a teaching certificate or other proof of qualification.
        </p>
        <input type="file" onChange={onUpload} />
        {uploadedFile && <p className={styles.fileName}>Uploaded: {uploadedFile.name}</p>}
    </div>
);

export default VerificationStep;
