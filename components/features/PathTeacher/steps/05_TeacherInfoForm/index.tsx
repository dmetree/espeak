// components/onboarding/TeacherInfoForm.tsx
import { useState } from 'react';
import styles from './TeacherInfoForm.module.scss';

const TeacherInfoForm = ({ onSubmit }) => {
    const [form, setForm] = useState({
        fullName: '',
        experience: '',
        education: '',
        rate: '',
        bio: '',
    });

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    return (
        <form className={styles.form} onSubmit={e => { e.preventDefault(); onSubmit(form); }}>
            <label>Full Name</label>
            <input name="fullName" value={form.fullName} onChange={handleChange} required />

            <label>Experience</label>
            <input name="experience" value={form.experience} onChange={handleChange} />

            <label>Education</label>
            <input name="education" value={form.education} onChange={handleChange} />

            <label>Hourly Rate (USD)</label>
            <input name="rate" value={form.rate} onChange={handleChange} type="number" />

            <label>Bio</label>
            <textarea name="bio" value={form.bio} onChange={handleChange} />

            <button type="submit">Submit</button>
        </form>
    );
};

export default TeacherInfoForm;
