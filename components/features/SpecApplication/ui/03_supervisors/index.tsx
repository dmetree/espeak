import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import Button from "@/components/shared/ui/Button";
import { Input } from "@/components/shared/ui/Input/Input";
import s from '../.module.scss';

const SupervisorsStep = ({ formData, handleTherapistChange, addTherapist, removeTherapist }: { formData: { therapists: { name: string, profileLink: string, from: string, to: string, sessions: number }[] }, handleTherapistChange: (index: number, field: string, value: string | number) => void, addTherapist: () => void, removeTherapist: (index: number) => void }) => {

    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const t = loadMessages(currentLocale);

    const handleSessionsChange = (index: number, value: string) => {
        const sessions = parseInt(value, 10);
        handleTherapistChange(index, 'sessions', sessions < 0 ? 0 : sessions);
    };

    const handleDateChange = (index: number, field: string, value: string) => {
        const fromDate = field === 'from' ? value : formData.therapists[index].from;
        const toDate = field === 'to' ? value : formData.therapists[index].to;

        if (new Date(toDate) < new Date(fromDate)) {
            return; // Do not allow to set 'to' date earlier than 'from' date
        }

        handleTherapistChange(index, field, value);
    };

    // Get the current month in the format YYYY-MM
    const getCurrentMonth = () => {
        const now = new Date();
        return now.toISOString().substring(0, 7);
    };

    // Check if all required fields are filled for the current therapist
    const isCurrentTherapistValid = (therapist: any) => {
        return therapist.name && therapist.profileLink && therapist.from && therapist.to && therapist.sessions >= 0;
    };

    // Check if all therapists are valid
    const allTherapistsValid = formData.therapists.every(isCurrentTherapistValid);

    return (
        <div className={s.step}>
            <h2 className={s.formStepH}>{t.spec_step_3_4_step}</h2>
            <div className="">
                <h3 className={s.headerS1}>{t.how_many_h_personal_therapy}</h3>
                <p className={s.subTitleS1}>{t.add_teachers}</p>
            </div>
            <div className={s.therapistContainer}>
                {formData.therapists.map((therapist: any, index: number) => (
                    <div key={index} className={s.therapist}>
                        <div className={s.therapistIndex}>{index + 1}.</div>
                        <div className={s.therapistDetails}>
                            <span className={s.diplomaHours}>{t.name_your_teacher}
                                <Input
                                    type="text"
                                    value={therapist.name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTherapistChange(index, 'name', e.target.value)}
                                    label="Name of your Teacher/Therapist/Supervisor"
                                    required
                                    placeholder={'Ivan Petrov'}
                                />
                            </span>
                            <span className={s.diplomaHours}>{t.teacher_profile_link}
                                <Input
                                    type="text"
                                    value={therapist.profileLink}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTherapistChange(index, 'profileLink', e.target.value)}
                                    label="Profile Link"
                                    required
                                    placeholder={'@IvenPetrov'}
                                />
                            </span>
                            <span className={s.diplomaHours}>{t.since_when_till_when}
                                <span className={s.fromTo}>
                                    <Input
                                        type="month"
                                        value={therapist.from}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDateChange(index, 'from', e.target.value)}
                                        label="From"
                                        max={getCurrentMonth()}
                                        required
                                    />
                                    <Input
                                        type="month"
                                        value={therapist.to}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDateChange(index, 'to', e.target.value)}
                                        label="To"
                                        max={getCurrentMonth()}
                                        required
                                    />
                                </span>
                            </span>
                            <span className={s.diplomaHours}>{t.number_of_sessions}
                                <Input
                                    type="number"
                                    value={therapist.sessions}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSessionsChange(index, e.target.value)}
                                    label="Number of sessions / supervisions"
                                    min="1"
                                    required
                                    placeholder={'3'}

                                />
                            </span>
                        </div>
                        {index !== 0 && <Button cancel className={s.deleteBtn} onClick={() => removeTherapist(index)}>X</Button>}

                    </div>
                ))}
            </div>

            <Button onClick={addTherapist} className={s.addButton} disabled={!allTherapistsValid}>{t.add_therapist_supervisor}</Button>

        </div>
    );
};

export default SupervisorsStep;
