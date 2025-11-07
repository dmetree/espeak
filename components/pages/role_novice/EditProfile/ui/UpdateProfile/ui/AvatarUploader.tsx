// components/Profile/AvatarUploader.tsx
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

const AvatarUploader: React.FC<Props> = ({ avatar, fileInputRef, onFileChange, onClick, fileSizeError, t }) => {
  return (
    <>
      <div className={s.avatarBox} onClick={onClick}>
        <div
          className={s.avatarContainer}
          style={{ backgroundImage: avatar ? `url(${avatar})` : "none" }}
        >
          {!avatar && t.add_image}
        </div>

        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/webp"
          ref={fileInputRef}
          onChange={onFileChange}
          hidden
        />
      </div>
      {fileSizeError && <div className={s.errorMessage}>{fileSizeError}</div>}
    </>
  );
};

export default AvatarUploader;
