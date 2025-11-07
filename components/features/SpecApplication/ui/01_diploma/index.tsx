import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import { Input } from "@/components/shared/ui/Input/Input";
import s from '../.module.scss';

const DiplomaStep = ({
    formData,
    handleChange,
}: {
    formData: { diploma: string | undefined; diplomaHours: any; diplomaYear: any };
    handleChange: (input: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
    const [errorFile, setFileError] = useState<string | null>(null);
    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const t = loadMessages(currentLocale);
    const [imageUrl, setImageUrl] = useState(formData.diploma || ""); // Show existing image if available
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 500 * 1024) {
                setFileError("File size should be less than 500 KB.");
                return;
            }

            setFileError(null);
            const objectUrl = URL.createObjectURL(file);
            setImageUrl(objectUrl);
            handleChange("diploma")({
                target: { value: objectUrl },
            } as React.ChangeEvent<HTMLInputElement>);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={s.step}>
            <h2 className={s.formStepH}>{t.spec_step_1_4_step}</h2>
            <div>
                <h3 className={s.headerS1}>{t.upload_diploma}</h3>
                <p className={s.subTitleS1}>{t.image_formats}</p>
            </div>

            {/* Image Upload Box */}
            <div
                className={s.imageContainer}
                style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : "none" }}
                onClick={handleImageClick}
            >
                {/* {!imageUrl && "Add Image"} */}
                {!imageUrl && t.add_image}
            </div>
            {errorFile && <p className={s.errorText}>{errorFile}</p>}

            {/* Hidden File Input */}
            <input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                ref={fileInputRef}
                onChange={handleImageChange}
                hidden
            />

            <div className={s.diplomaWrap}>
                {/* Diploma Hours */}
                <label className={s.diplomaHours}>{t.diploma_hours_label}</label>
                <Input
                    type="number"
                    value={formData?.diplomaHours || null}
                    onChange={handleChange('diplomaHours')}
                    required
                    min="0"
                    placeholder={'0'}
                />

                {/* Diploma Year */}
                <label className={s.diplomaYear}>{t.psychology_journey_start_label}</label>
                <Input
                    type="number"
                    value={formData?.diplomaYear || null}
                    onChange={handleChange('diplomaYear')}
                    min="1950"
                    max="2025"
                    required
                    placeholder={'1950'}
                />

            </div>

        </div>
    );
};

export default DiplomaStep;
