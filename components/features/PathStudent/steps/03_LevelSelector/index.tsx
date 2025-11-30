import styles from './LevelSelector.module.scss';

const LEVELS = [
    {
        id: 'beginner',
        label: 'I have little to no prior knowledge of the language. I am just starting to learn.',
        title: 'Beginner'
    },
    {
        id: 'elementary',
        label: 'I know basic words and phrases but struggle with forming sentences.',
        title: 'Elementary'
    },
    {
        id: 'intermediate',
        label: 'I can communicate in everyday situations, express my thoughts, and understand simple conversations.',
        title: 'Intermediate'
    },
    {
        id: 'advanced',
        label: 'I am proficient in the language, able to handle complex conversations, and understand advanced topics.',
        title: 'Advanced'
    },
    {
        id: 'fluent',
        label: 'I am very comfortable with the language, both in spoken and written form. I can communicate effectively in various contexts.',
        title: 'Fluent'
    },
];

const LevelSelector = ({ selected, onSelect }) => (
    <>
        <h1 className={styles.mainTitle}>
            {'What is your current level of knowledge?'}
        </h1>
        <p className={styles.subtitle}>
            {'Indicate your proficiency level in chosen language'}
        </p>
        <div className={styles.levels}>
            {LEVELS.map((level, index) => (
                <div className={styles.wrap} key={index}>
                    <button
                        key={level.id}
                        onClick={() => onSelect(level.id)}
                        className={`${styles.levelBtn} ${selected === level.id ? styles.selected : ''}`}
                    >
                        <div className={styles.label}>{level.label}</div>
                    </button>
                    <span className={styles.title}>{level.title}</span>
                </div>
            ))}
        </div>
    </>
);

export default LevelSelector;
