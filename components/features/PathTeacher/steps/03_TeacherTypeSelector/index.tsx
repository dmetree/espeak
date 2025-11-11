// components/onboarding/TeacherTypeSelector.tsx
import styles from './TeacherTypeSelector.module.scss';

const TeacherTypeSelector = ({ selected, onSelect }) => (
    <div className={styles.typeSelector}>
        {[
            { id: 'pro', title: 'Professional Tutor', desc: 'Certified or experienced teachers' },
            { id: 'community', title: 'Community Tutor', desc: 'Native speakers teaching informally' },
        ].map(type => (
            <button
                key={type.id}
                className={`${styles.option} ${selected === type.id ? styles.selected : ''}`}
                onClick={() => onSelect(type.id)}
            >
                <h3>{type.title}</h3>
                <p>{type.desc}</p>
            </button>
        ))}
    </div>
);

export default TeacherTypeSelector;
