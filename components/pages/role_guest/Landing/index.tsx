import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import { useDispatch, useSelector } from 'react-redux';
import { showModal, hideModal, toggleModal } from '@/store/actions/modal'; // Assuming actions are in this file

import * as blockChainActions from "@/store/actions/networkCardano";
import { toast } from "react-toastify";
import { googleSignup } from '@/store/actions/profile/user';
import { auth, googleProvider, signInWithPopup, twitterProvider, facebookProvider } from "@/components/shared/utils/firebase/init";
import { AppDispatch } from "@/store";
import Page from "@/components/shared/ui/Page/Page";
import Substrate from "@/components/shared/ui/Substrate/Substrate";
import { EModalKind, EUserRole } from '@/components/shared/types';

import Button from "@/components/shared/ui/Button";
import s from './landing.module.scss';

import BookingFlow from '@/components/pages/role_guest/ContractPsy/BookingFlow';

import { loadMessages } from '@/components/shared/i18n/translationLoader';
import Link from "next/link";
import Footer from '@/components/features/Footer';
import DumbDashboard from '@/components/pages/role_guest/Landing/ui/DumbDashboard';


const Landing = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);

  const userUid = useSelector(({ user }) => user.uid);
  const ergoWalletAddress = useSelector(({ networkErgo }) => networkErgo.ergoWalletAddress);
  const ergoWalletName = useSelector(({ networkErgo }) => networkErgo.ergoWalletName);
  const ergoWalletConnected = useSelector(({ networkErgo }) => networkErgo.ergoWalletConnected);

  const openModals = useSelector(({ modal }) => modal.openModals);

  const router = useRouter();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);

  const handleBookSession = () => {
    if (!ergoWalletConnected) {
      dispatch(blockChainActions.toggleWalletSelector());
      toast.warn(t.connect_your_wallet)
    }
    if (ergoWalletConnected) {
      dispatch(showModal(EModalKind.BookSession));
    }
  }


  const loginWithEmail = () => {
    router.push('/login'); // Redirect to dashboard
  }


  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    const [{ signInWithPopup, auth, googleProvider }, { googleSignup }] = await Promise.all([
      import('@/components/shared/utils/firebase/init'),
      import('@/store/actions/profile/user'),
    ]);

    try {
      const partnerOne = localStorage.getItem("partnerOne") || '';
      const partnerTwo = localStorage.getItem("partnerTwo") || '';

      const result = await signInWithPopup(auth, googleProvider);
      dispatch(googleSignup(result.user, partnerOne, partnerTwo, currentLocale));

      router.push('/dashboard');
    } catch (err) {
      console.error('Google login error:', err);
      setError(t.failed_to_login);
    } finally {
      setLoading(false);
    }
  };


  const handleTwitterLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const partnerOne = localStorage.getItem("partnerOne") || '';
      const partnerTwo = localStorage.getItem("partnerTwo") || '';

      const result = await signInWithPopup(auth, twitterProvider);
      const user = result.user;

      // Dispatch action to handle user creation/login
      // dispatch(googleSignup(user, "", "", currentLocale));
      dispatch(googleSignup(result.user, partnerOne, partnerTwo, currentLocale)); // Dispatch action to handle user creation/login

      router.push('/dashboard'); // Redirect to dashboard
    } catch (err) {
      console.error('Twitter login error:', err);
      setError(t.failed_to_login);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (!router.isReady) return;
    const partnerOne = router.query.r1 as string | undefined;
    const partnerTwo = router.query.r2 as string | undefined;

    if (partnerOne) {
      localStorage.setItem("partnerOne", partnerOne);
    }

    if (partnerTwo) {
      localStorage.setItem("partnerTwo", partnerTwo);
    }

    // Remove all query parameters and replace URL with base path
    if (partnerOne || partnerTwo) {
      router.replace("/", undefined, { shallow: true });
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    if (!router.isReady) return;
    const partnerOne = localStorage.getItem("partnerOne");
    if (partnerOne && router.pathname !== "/" && !hasRedirected) {
      setHasRedirected(true);
      router.replace("/");
    }
  }, [router.isReady, router.pathname, hasRedirected]);

  return (
    <div className={s.pageLayout}>
      <Page landing scroll>
        <div className={s.main}>
          <div className={s.main_message}>
            <div className={s.messages}>
              <h1 className={s.h1}>MindHealer</h1>
              <h4 className={s.h4}>
                {t.slogan_1}
                <br />
                {t.slogan_2}
              </h4>
            </div>

            {userUid &&
              <div className={s.connectWallet}>
                <Button
                  className={s.main_btn}
                  onClick={handleBookSession}
                  size="m"
                >
                  {t.book_session}
                </Button>
              </div>
            }

            {!userUid &&
              <>
                <Button
                  className={s.loginWithGoogle}
                  onClick={handleGoogleLogin} disabled={loading} >
                  {t.login_with_google}
                </Button>
                <Button
                  className={s.loginWithGoogle}
                  onClick={handleTwitterLogin}
                  disabled={loading}>
                  {t.login_with_twitter}
                </Button>
                {/* <Button
                  className={s.loginWithGoogle}
                  onClick={handleFacebookLogin}
                  disabled={loading}>
                  {t.login_with_facebook}
                </Button> */}
                <Button
                  className={s.loginWithEmail}
                  onClick={loginWithEmail} disabled={loading} >
                  {t.login_with_email_and_password}
                </Button>
              </>
            }
            <h6 className={s.message_h6}>{t.payment_options}</h6>
          </div>


        </div>

        {/* <BookingFlow /> */}
        {/* <Link className={s.psychologist} href="/psychologist">
        {t.psychologist_title}
      </Link> */}


        {!userUid && <DumbDashboard />}
      </Page>
      <Footer />
    </div>


  )
}

export default Landing;
