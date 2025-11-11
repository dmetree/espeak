import styles from './PurposeSelector.module.scss';

const PURPOSES = [
    { id: 'study', label: 'Studying or school' },
    { id: 'work', label: 'Working abroad' },
    { id: 'travel', label: 'Traveling' },
    { id: 'relationships', label: 'Personal relationships' },
    { id: 'hobby', label: 'Hobby or curiosity' },
];

const PurposeSelector = ({ selected, onSelect }) => (
    <div className={styles.purposes}>
        {PURPOSES.map(p => (
            <button
                key={p.id}
                onClick={() => onSelect(p.id)}
                className={`${styles.purposeBtn} ${selected === p.id ? styles.selected : ''}`}
            >
                {p.label}
            </button>
        ))}
    </div>
);

export default PurposeSelector;
