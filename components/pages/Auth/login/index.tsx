import React, { useState, useRef, useEffect } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from "@/store";
import { login, fetchUserData } from '@/store/actions/profile/user';
import { loadMessages } from '@/components/shared/i18n/translationLoader';

import Page from "@/components/shared/ui/Page/Page";
import Substrate from "@/components/shared/ui/Substrate/Substrate";
import Button from "@/components/shared/ui/Button";

import s from './login.module.scss';
import { turnstileSiteKey } from '@/hooks/isLocalHost';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
        }
      ) => void;
      reset?: () => void;
    };
    turnstileCallback?: (token: string) => void;
  }
}

export default function Login() {
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const fbUserUid = useSelector(({ user }) => user.uid);
  const containerRef = useRef<HTMLDivElement | null>(null);


  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [isTurnstileReady, setIsTurnstileReady] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (fbUserUid) {
      router.replace('/dashboard');
      dispatch(fetchUserData(fbUserUid));
    }

  }, [fbUserUid]);



  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    // if (!turnstileToken) {
    //   setError('Please complete the verification');
    //   setLoading(false);
    //   return;
    // }

    try {
      const email = emailRef.current?.value || '';
      const password = passwordRef.current?.value || '';

      await dispatch(login(email, password));
    } catch (err) {
      console.error(err);
      setError('Failed to log in');
      emailRef.current?.focus();
    } finally {
      setLoading(false);
    }
  }

  const isSubmitDisabled = loading || !isTurnstileReady || !turnstileToken;

  return (
    <Page>
      <Substrate className={s.wrapper} color="base" width="auth_form">
        <h2 className={s.header}>{t.enter_account}</h2>
        {error && <div className={s.error}>{error}</div>}

        <form className={s.form} onSubmit={handleSubmit}>
          <label htmlFor="email" className={s.label}>
            <input
              type="email"
              placeholder="Email goes here..."
              required
              ref={emailRef}
              name="email"
            />
          </label>

          <label htmlFor="password" className={s.label}>
            <input
              type="password"
              placeholder="Password goes here..."
              required
              ref={passwordRef}
              name="password"
            />
          </label>

          <Button type="submit">
            {loading ? 'Loading...' : t.enter_account}
          </Button>
        </form>

        <div className={s.nav}>
          <div className={s.navItem}>
            <Link className={s.link} href="/forgot-password">
              {t.forgot_password}
            </Link>
          </div>

          <div className={s.navItem}>
            {t.dont_have_account}{' '}
            <Link className={s.link} href="/sign_in">
              {t.create_account}
            </Link>
          </div>
        </div>
      </Substrate>
    </Page>
  );
}
