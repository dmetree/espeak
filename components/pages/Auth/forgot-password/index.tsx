import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import Page from "@/components/shared/ui/Page/Page";
import Substrate from "@/components/shared/ui/Substrate/Substrate";
import Button from "@/components/shared/ui/Button";
import { Input } from "@/components/shared/ui/Input/Input";

import s from './forgotPassword.module.scss';

export default function ForgotPassword() {
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);

  const emailRef = useRef();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: { preventDefault: () => void; }) {
    e.preventDefault();
    console.log("resetting password")

    // try {
    //   setMessage('');
    //   setError('');
    //   setLoading(true);
    //   await resetPassword(emailRef.current.value);
    //   setMessage('Check your inbox for further instructions');
    // } catch {
    //   setError('Failed to reset password');
    // }

    // setLoading(false);
  }

  return (
    <Page>
      <Substrate className={s.wrapper} color="base" width="auth_form">
        <h2 className={s.header}>{t.reset_password}</h2>

        {error && <div>{error}</div>}
        {message && <div>{message}</div>}
        <form className={s.form} onSubmit={handleSubmit}>
          <div className={s.info_msg}>{t.reset_msg}</div>
          {/* <Input
            type="email"
            placeholder="Email"
            // @ts-ignore
            name="email"
            ref={emailRef}
            required
          /> */}
          <label
            htmlFor="email"
            className={s.label}
          >
            <input
                type="email"
                placeholder='Email goes here...'
                required
                ref={emailRef}
                name="email"
            />
          </label>

          <Button disabled={loading} className="" type="submit">
            {t.reset_password}
          </Button>
        </form>

        <div className={s.nav}>
          <div className={s.navItem}>
            <Link className={s.link} href="/login">
              {t.enter_account}
            </Link>
          </div>

          <div className={s.navItem}>
            <Link className={s.link} href="/sign_in">
              {t.create_new_account}
            </Link>
          </div>
        </div>
      </Substrate>
    </Page>
  );
}
