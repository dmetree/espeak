import styles from "./LanguageSelector.module.scss";

interface LanguageOption {
  code: string;
  name: string;
  flag?: string;
}

interface LanguageSelectorProps {
  options: LanguageOption[];
  selected: string | null;
  onChange: (code: string) => void;
  showFlags?: boolean;
  nativeLang?: string;
  setNativeLang?: () => void;
  targetLang?: string;
  setTargetLang?: () => void;
}

const LanguageSelectorWithFlags = ({
  options,
  selected,
  onChange,
  showFlags = false,
  nativeLang,
  setNativeLang,
  targetLang,
  setTargetLang,
}: LanguageSelectorProps) => (
  <div className={styles.languageSelector}>
    {showFlags ? (
      <div className={styles.flagGrid}>
        {options.map((opt) => (
          <button
            key={opt.code}
            className={`${styles.flagButton} ${
              selected === opt.code ? styles.selected : ""
            }`}
            onClick={() => onChange(opt.code)}
            type="button"
            aria-pressed={selected === opt.code}
          >
            {opt.flag && <span className={styles.flagEmoji}>{opt.flag}</span>}
            <span className={styles.flagName}>{opt.name}</span>
          </button>
        ))}
      </div>
    ) : (
      <select
        value={selected || ""}
        onChange={(e) => onChange(e.target.value)}
        className={styles.selectInput}
      >
        <option value="">Select language</option>
        {options.map((opt) => (
          <option key={opt.code} value={opt.code}>
            {opt.name}
          </option>
        ))}
      </select>
    )}
  </div>
);

export default LanguageSelectorWithFlags;
