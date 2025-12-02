import { loadMessages } from "@/components/shared/i18n/translationLoader";
import { RadioButton, RadioButtonGroup } from "@/components/shared/ui/RadioButtonGroup"
import styles from './styles.module.scss';
import { useState } from "react";
import { AppDispatch } from "@/store";

import { useDispatch, useSelector } from 'react-redux';
import Button from "@/components/shared/ui/Button";
import { actionUpdateProfile } from "@/store/actions/profile/user";
import { showModal } from "@/store/actions/modal";
import { EModalKind, EUserRole } from "@/components/shared/types/types";

const RoleSelector = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const userUid = useSelector(({ user }) => user.uid);
  const userData = useSelector(({ user }) => user?.userData);
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);

  const [selectedRole, setSelectedRole] = useState<string | null>(null);


  const handleChooseRole = () => {

    if (selectedRole) {
      if (selectedRole === EUserRole.Novice) {
        dispatch(showModal(EModalKind.PathStudent));
      }
      if (selectedRole === EUserRole.Specialist) {
        dispatch(showModal(EModalKind.PathTeacher));
      }
    }
  };


  return (
    <>
      <div className={styles.firstAccentLight} />
      <div className={styles.firstPrimaryLight} />

      <div className={styles.firstTextWrapper}>
        <h1>{t.welcome.first.title}</h1>
        <p>{t.welcome.first.subtitle}</p>

        <RadioButtonGroup
          defaultValue={selectedRole || undefined}
          onValueChange={setSelectedRole}
          className={styles.radioGroup}
        >
          <RadioButton value={EUserRole.Novice}>
            <div className={styles.radioItem}>
              <span className={styles.bold}>{t.welcome.first.learnOption.title}</span>
              <span>{t.welcome.first.learnOption.description}</span>
            </div>
          </RadioButton>

          <RadioButton value={EUserRole.Specialist}>
            <div className={styles.radioItem}>
              <span className={styles.bold}>{t.welcome.first.teachOption.title}</span>
              <span>{t.welcome.first.teachOption.description}</span>
            </div>
          </RadioButton>
        </RadioButtonGroup>
      </div>

      <Button
        disabled={!selectedRole}
        onClick={handleChooseRole}
        className={styles.chooseButton}
      >
        {t.welcome.first.choose}
      </Button>
    </>
  )
}

export default RoleSelector
