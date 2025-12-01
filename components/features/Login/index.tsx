"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import s from "./styles.module.scss";
import { AppDispatch } from "@/store";
import { hideModal, showModal } from "@/store/actions/modal";
import { EModalKind } from "@/components/shared/types";
import { loadMessages } from "@/components/shared/i18n/translationLoader";

import { auth, signInWithPopup, twitterProvider } from "@/components/shared/utils/firebase/init";
import { googleSignup, login, fetchUserData } from "@/store/actions/profile/user";
import { FaXTwitter, FaGoogle } from "react-icons/fa6";


const Login = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);

  const fbUserUid = useSelector(({ user }) => user.uid);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ====== Redirect if user already logged in ======
  useEffect(() => {
    if (fbUserUid) {
      router.replace("/dashboard");
      dispatch(fetchUserData(fbUserUid));
    }
  }, [fbUserUid]);

  // ====== Modal Controls ======
  const closeModal = () => {
    dispatch(hideModal(EModalKind.Login));
  };

  const openSignUp = () => {
    dispatch(hideModal(EModalKind.Login));
    dispatch(showModal(EModalKind.SignUp));
  };

  // ====== Cleanup scroll lock ======
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // ====== Email + Password Login ======
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const email = emailRef.current?.value || "";
    const password = passwordRef.current?.value || "";

    try {
      await dispatch(login(email, password));
      closeModal();
      router.push("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(t.failed_to_login);
      emailRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  // ====== Google Login ======
  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    const [{ signInWithPopup, auth, googleProvider }, { googleSignup }] = await Promise.all([
      import("@/components/shared/utils/firebase/init"),
      import("@/store/actions/profile/user"),
    ]);

    try {
      const partnerOne = localStorage.getItem("partnerOne") || "";
      const partnerTwo = localStorage.getItem("partnerTwo") || "";

      const result = await signInWithPopup(auth, googleProvider);
      await dispatch(googleSignup(result.user, partnerOne, partnerTwo, currentLocale));

      closeModal();
      router.push("/dashboard");
    } catch (err) {
      console.error("Google login error:", err);
      setError(t.failed_to_login);
    } finally {
      setLoading(false);
    }
  };

  // ====== Twitter Login ======
  const handleTwitterLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const partnerOne = localStorage.getItem("partnerOne") || "";
      const partnerTwo = localStorage.getItem("partnerTwo") || "";

      const result = await signInWithPopup(auth, twitterProvider);
      await dispatch(googleSignup(result.user, partnerOne, partnerTwo, currentLocale));

      closeModal();
      router.push("/dashboard");
    } catch (err) {
      console.error("Twitter login error:", err);
      setError(t.failed_to_login);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.modalWrapper}>
      <X size={30} className={s.closeButton} onClick={closeModal} />

      <div className={s.header}>
        <h2>Welcome to EasySpeak!</h2>
        <p>
          By logging in or creating an account, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </p>
      </div>

      <div className={s.socialRow}>
        <button type="button" onClick={handleGoogleLogin} disabled={loading}>
          <FaGoogle size={24} />
        </button>
        <button type="button" onClick={handleTwitterLogin} disabled={loading}>
          <FaXTwitter size={24} />
        </button>
      </div>

      <form className={s.form} onSubmit={handleSubmit}>
        <label>
          <input
            ref={emailRef}
            type="email"
            placeholder="email@gmail.com"
            required
            className={s.input}
          />
        </label>

        <label>
          <input
            ref={passwordRef}
            type="password"
            placeholder="Password"
            required
            className={s.input}
          />
        </label>

        {error && <p className={s.error}>{error}</p>}

        <div className={s.options}>
          <label>
            <input className={s.checkbox} type="checkbox" /> Keep me logged in
          </label>
          <a href="#">Forgot password?</a>
        </div>

        <button type="submit" className={s.submitButton} disabled={loading}>
          {loading ? "Loading..." : "Log in"}
        </button>
      </form>

      <div className={s.footer}>
        <div className={s.login}>
          You do not have an account yet?{" "}
          <a onClick={openSignUp} className={s.link}>
            Sign up →
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
