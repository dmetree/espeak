import Image from "next/image";
import styles from './LanguageSelector.module.scss';

const LanguageSelector = ({ options, selected, onChange, showFlags }) => (
    <div className={styles.languageSelector}>
        {showFlags ? (
            <div className={styles.flagGrid}>
                {options.map(opt => (
                    <button
                        key={opt.code}
                        className={`${styles.flagButton} ${selected === opt.code ? styles.selected : ''}`}
                        onClick={() => onChange(opt.code)}
                    >
                        <Image
                            src={opt.flag}
                            alt={opt.name}
                            width={32}       // ✅ required
                            height={32}      // ✅ required
                            className={styles.flag}
                        />
                        <span>{opt.name}</span>
                    </button>
                ))}
            </div>
        ) : (
            <select value={selected || ''} onChange={e => onChange(e.target.value)}>
                <option value="">Select language</option>
                {options.map(opt => (
                    <option key={opt.code} value={opt.code}>
                        {opt.name}
                    </option>
                ))}
            </select>
        )}
    </div>
);

export default LanguageSelector;
