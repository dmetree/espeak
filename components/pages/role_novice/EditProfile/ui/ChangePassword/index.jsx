import { observer } from 'mobx-react-lite';
import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { ROUTES_MAPPING } from '@/domains/app/constants/routes';
import { useStores } from '@/domains/app/stores/root.store';
import { Input } from "@/components/shared/ui/Input/Input";

import s from './.module.css';

const ChangePassword = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const {
    userStore: { FBUser, updatePassword, updateEmail },
  } = useStores();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  function handleSubmit(e) {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match');
    }

    const promises = [];
    setLoading(true);
    setError('');

    if (emailRef.current.value !== FBUser.email) {
      promises.push(updateEmail(emailRef.current.value));
    }
    if (passwordRef.current.value) {
      promises.push(updatePassword(passwordRef.current.value));
    }

    Promise.all(promises)
      .then(() => {
        navigate(ROUTES_MAPPING.PROTECTED.MY_TIMESLOTS);
      })
      .catch(() => {
        setError('Failed to update account');
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className={s.page}>
      <div className={s.wrapper}>
        <div className={s.h1}>{t('account_info')}</div>
        {error && <div>{error}</div>}
        <form className={s.form} onSubmit={handleSubmit}>
          <div className="form-group">
            <Input
              type="email"
              id="email"
              ref={emailRef}
              required
              defaultValue={FBUser.email}
            />
          </div>
          <div className="form-group">
            <Input
              type="password"
              id="password"
              ref={passwordRef}
              placeholder={t('leave_blank')}
            />
          </div>
          <div className="form-group">
            <Input
              type="password"
              id="repeatPassword"
              ref={passwordConfirmRef}
              placeholder={t('leave_blank')}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={s.submitBtn}
            value=""
          >
            {t('save_update_password')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default observer(ChangePassword);
