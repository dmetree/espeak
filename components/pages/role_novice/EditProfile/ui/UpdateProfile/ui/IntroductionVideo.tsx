import React from 'react';
import { Input } from '@/components/shared/ui/Input/Input';
import s from './../.module.scss';

type Props = {
  introVideo: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  t: any;
};

const IntroductionVideo: React.FC<Props> = ({ introVideo, onChange, t }) => {
  return (
    <div className={s.nicknameField}>
      <label htmlFor="intro_video" className={s.labelWithTooltip}>
        <span className={s.nicknameTitle}>{t.your_introduction_video}</span>
        {/* <span className={s.tooltip}>
          ⓘ
          <span className={s.tooltipText}>{t.profile_title_info}</span>
        </span> */}
      </label>

      <Input
        type="text"
        name="introVideo"
        id="introVideo"
        value={introVideo}
        onChange={onChange}
        placeholder="https://www.youtube.com/..."
        required
        formLabel
        inputClassName={s.formInput}
      />
    </div>
  );
};

export default IntroductionVideo;
