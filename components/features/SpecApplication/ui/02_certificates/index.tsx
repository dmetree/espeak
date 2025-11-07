import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import Button from "@/components/shared/ui/Button";
import { Input } from "@/components/shared/ui/Input/Input";
import s from '../.module.scss';

interface Certificate {
    url: string;
    certificateHours: number | string;
}

interface CertificatesStepProps {
    formData: { certificates: Certificate[] };
    handleCertificateChange: (index: number, field: string, value: string | number) => void;
    addCertificate: () => void;
    removeCertificate: (index: number) => void;
    handleFileUpload: (index: number, file: File | null) => void;
}

const CertificatesStep: React.FC<CertificatesStepProps> = ({
    formData,
    handleCertificateChange,
    addCertificate,
    removeCertificate,
    handleFileUpload
}) => {
    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const t = loadMessages(currentLocale);
    const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [errorFile, setFileError] = useState<string | null>(null);

    const isCertificateValid = (certificate: Certificate) =>
        certificate.url && certificate.certificateHours !== null;

    const allCertificatesValid = formData.certificates.every(isCertificateValid);

    const handleImageClick = (index: number) => {
        fileInputRefs.current[index]?.click();
    };

    return (
        <div className={s.step}>
            <h2 className={s.formStepH}>{t.spec_step_2_4_step}</h2>
            <div>
                <h3 className={s.headerS1}>{t.upload_certificate}</h3>
                <p className={s.subTitleS1}>{t.image_formats}</p>
            </div>

            <div className={s.certificateContainer}>
                {formData.certificates?.map((certificate, index) => (
                    <div key={index} className={s.certificateItemBox}>
                        <div className={s.certificateIndex}>{index + 1}.</div>
                        <div className={s.certificateDetails}>
                            {/* Image Upload Box */}
                            <span>
                                <div
                                    className={s.certImageContainer}
                                    style={{ backgroundImage: certificate.url ? `url(${certificate.url})` : "none" }}
                                    onClick={() => handleImageClick(index)}
                                >
                                    {!certificate.url && t.add_image}
                                </div>
                                {errorFile && <p className={s.errorText}>{errorFile}</p>}

                                {/* Hidden File Input */}
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg, image/jpg"
                                    ref={(el) => (fileInputRefs.current[index] = el)}
                                    onChange={(e) =>
                                        handleFileUpload(index, e.target.files?.[0] || null)
                                    }
                                    hidden
                                />

                                {/* Certificate Hours Input */}
                                <label className={s.diplomaHours}>{t.cert_hours_label}</label>
                                <Input
                                    type="number"
                                    value={certificate.certificateHours?.toString() || ''}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleCertificateChange(index, 'certificateHours', Number(e.target.value))
                                    }
                                    required
                                    min="0"
                                    placeholder={'0'}
                                />
                            </span>
                            {/* Remove Certificate Button */}
                            <Button
                                cancel
                                className={s.deleteBtn}
                                onClick={() => removeCertificate(index)}
                            >
                                X
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Certificate Button */}
            <Button
                onClick={addCertificate}
                className={s.addButton}
                disabled={!allCertificatesValid}
            >
                {t.add_certificate_btn}
            </Button>
        </div>
    );
};

export default CertificatesStep;
