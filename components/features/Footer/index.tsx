import React from 'react';
import { useRouter } from 'next/router';
import s from './.module.scss';

const Footer = () => {
  const router = useRouter();
  const year = new Date().getFullYear();

  const goToTOU = () => router.push('/tou');
  const goToPP = () => router.push('/privacy_policy');
  const goToCookies = () => router.push('/cookies_settings');

  return (
    <footer className={s.footer}>
      <div className={s.separator} />
      <div className={s.container}>
        <div className={s.left}>© {year}. All rights reserved.</div>

        <nav className={s.center} aria-label="Legal">
          <button className={s.link} onClick={goToPP}>Privacy Policy</button>
          <button className={s.link} onClick={goToTOU}>Terms of Service</button>
          <button className={s.link} onClick={goToCookies}>Cookies Settings</button>
        </nav>

        <div className={s.right}>
          <a className={`${s.link} ${s.external}`} href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a className={`${s.link} ${s.external}`} href="https://discord.com" target="_blank" rel="noopener noreferrer">Discord</a>
          <a className={`${s.link} ${s.external}`} href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
