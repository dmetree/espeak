import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import s from '../.module.scss';

const ExtraInfoStep = ({ formData, handleChange }: { formData: { extra_info: string }, handleChange: (input: string) => (e: React.ChangeEvent<HTMLTextAreaElement>) => void }) => {
    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const t = loadMessages(currentLocale);

    return (
        <div className={s.step}>
            <h2 className={s.formStepH}>{t.spec_step_4_4_step}</h2>
            <div className="">
                <h3 className={s.headerS1}>{t.what_brings_u_to_MH}</h3>
                <p className={s.subTitleS1}>{t.how_u_learn_about_MH} </p>
                <p className={s.subTitleS1}>{t.extra_info_about_u_MH}</p>
            </div>
            <textarea
                name="extra_info"
                value={formData.extra_info}
                onChange={handleChange('extra_info')}
                cols={60}
                rows={10}
                className={s.textarea}
            ></textarea>
        </div>
    );
};

export default ExtraInfoStep;
