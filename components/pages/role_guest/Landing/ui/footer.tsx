import React from 'react';
import s from './../landing.module.scss';

const Footer = () => {
  return (
    <footer className={s.footer}>
      <div className={s.footerSocial}>
        <a href="#" className={s.footerLink}>Twitter <span>&gt;</span></a>
        <a href="#" className={s.footerLink}>Discord <span>&gt;</span></a>
        <a href="#" className={s.footerLink}>Instagram <span>&gt;</span></a>
      </div>
      <div className={s.footerLegal}>
        <a href="#" className={s.footerLink}>Privacy Policy</a>
        <a href="#" className={s.footerLink}>Terms of Service</a>
        <a href="#" className={s.footerLink}>Cookie Settings</a>
      </div>
      <div className={s.footerCopyright}>
        © 2023 EasySpeak. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
