import { loadMessages } from "@/components/shared/i18n/translationLoader";
import { RadioButton, RadioButtonGroup } from "@/components/shared/ui/RadioButtonGroup"
import { useSelector } from "react-redux";
import styles from './styles.module.scss';
import { useState } from "react";
import Button from "@/components/shared/ui/Button";

const RoleSelector = (setIsReturningUser) => {
    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const t = loadMessages(currentLocale);

    const [selectedValue, setSelectedValue] = useState<string | null>(null);


    const handleChooseClick = () => {
        console.log('Выбран вариант:', selectedValue);
        if (selectedValue) setIsReturningUser(true);
    };

    const handleGetStarted = () => {
        console.log('GetStarted clicked');
    };
    return (
                <>
          <div className={styles.firstAccentLight} />
          <div className={styles.firstPrimaryLight} />

          <div className={styles.firstTextWrapper}>
            <h1>{t.welcome.first.title}</h1>
            <p>{t.welcome.first.subtitle}</p>

            <RadioButtonGroup
              defaultValue={selectedValue || undefined}
              onValueChange={setSelectedValue}
              className={styles.radioGroup}
            >
              <RadioButton value="wantToLearn">
                <div className={styles.radioItem}>
                  <span className={styles.bold}>{t.welcome.first.learnOption.title}</span>
                  <span>{t.welcome.first.learnOption.description}</span>
                </div>
              </RadioButton>

              <RadioButton value="wantToTeach">
                <div className={styles.radioItem}>
                  <span className={styles.bold}>{t.welcome.first.teachOption.title}</span>
                  <span>{t.welcome.first.teachOption.description}</span>
                </div>
              </RadioButton>
            </RadioButtonGroup>
          </div>

          <Button
            disabled={!selectedValue}
            onClick={handleChooseClick}
            className={styles.chooseButton}
          >
            {t.welcome.first.choose}
          </Button>
        </>
    )
}

export default RoleSelector
