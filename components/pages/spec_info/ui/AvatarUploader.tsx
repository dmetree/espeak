import React from 'react';
import s from './../.module.scss';

type Props = {
  avatar: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
  fileSizeError: string;
  t: any;
};

const AvatarUploader: React.FC<Props> = ({
  avatar,
  fileInputRef,
  onFileChange,
  onClick,
  fileSizeError,
  t,
}) => {
  return (
    <>
      <button type="button" className={s.avatarButton} onClick={onClick}>
        <img src={avatar} alt={t.profile_avatar || 'Profile'} className={s.profileImage} />
      </button>

      <input
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        ref={fileInputRef}
        onChange={onFileChange}
        hidden
      />

      {fileSizeError && <div className={s.errorMessage}>{fileSizeError}</div>}
    </>
  );
};

export default AvatarUploader;
