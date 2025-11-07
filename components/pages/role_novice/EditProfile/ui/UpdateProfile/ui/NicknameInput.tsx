import React from 'react';
import { Input } from '@/components/shared/ui/Input/Input';
import s from './../.module.scss';

type Props = {
  nickname: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  t: any;
};

const NicknameInput: React.FC<Props> = ({ nickname, onChange, t }) => {
  return (
    <div className={s.nicknameField}>
      <label htmlFor="nickname" className={s.labelWithTooltip}>
        <span className={s.nicknameTitle}>{t.profile_title}</span>
        <span className={s.tooltip}>
          ⓘ
          <span className={s.tooltipText}>{t.profile_title_info}</span>
        </span>
      </label>

      <Input
        type="text"
        name="nickname"
        id="nickname"
        value={nickname}
        onChange={onChange}
        placeholder={t.your_introduction_video}
        required
        formLabel
        inputClassName={s.formInput}
      />
    </div>
  );
};

export default NicknameInput;
