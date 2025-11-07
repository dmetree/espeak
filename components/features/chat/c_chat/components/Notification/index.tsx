import React, { FC } from 'react';
import s from './.module.css';
// import { HTMLTranslation } from '../../../../shared/HTMLTranslation';

export enum ECallHintType {
  AllowMedia = 'allowMedia',
  NoPermission = 'noPermission',
  Calling = 'calling',
  Ok = 'ok',
}

type TCallHintProps = {
  type: ECallHintType;
};

const GiveAccess = () => (
  <div className={s.allowCameraPopup}>
    <h4 className={s.navMsg}>
      For a video call - activate your camera and microphone
    </h4>
  </div>
);

const NoPermission = () => (
  <div className={s.allowCameraPopup}>
    <p className={s.navMsg}>
      {/* <HTMLTranslation i18nKey="microphone_camera_access_error" /> */}
      <br />
      <a
        target="_blank"
        href="https://support.google.com/chromebook/answer/114662"
        rel="noreferrer"
      >
        Google Chrome
      </a>
      <br />
      <a
        target="_blank"
        href="https://support.mozilla.org/ru/kb/panel-prava-dlya-sajta"
        rel="noreferrer"
      >
        Mozzila Firefox
      </a>
      <br />
    </p>
  </div>
);

const Calling = () => (
  <div className={s.controls}>
    <div className={s.calling}>Calling...</div>
  </div>
);

export const CallHint: FC<TCallHintProps> = ({ type }) => {
  return (
    <>
      {type === ECallHintType.NoPermission && <NoPermission />}
      {type === ECallHintType.AllowMedia && <GiveAccess />}
      {type === ECallHintType.Calling && <Calling />}
    </>
  );
};
