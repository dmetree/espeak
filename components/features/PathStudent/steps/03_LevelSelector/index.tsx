import styles from './LevelSelector.module.scss';

const LEVELS = [
    { id: 'beginner', label: 'I have no prior knowledge' },
    { id: 'basic', label: 'I know some words and phrases' },
    { id: 'intermediate', label: 'I can communicate in daily situations' },
    { id: 'advanced', label: 'I can speak fluently and read complex texts' },
];

const LevelSelector = ({ selected, onSelect }) => (
    <div className={styles.levels}>
        {LEVELS.map(level => (
            <button
                key={level.id}
                onClick={() => onSelect(level.id)}
                className={`${styles.levelBtn} ${selected === level.id ? styles.selected : ''}`}
            >
                {level.label}
            </button>
        ))}
    </div>
);

export default LevelSelector;
