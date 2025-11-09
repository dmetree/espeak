"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/shared/ui/Input/Input";
import s from "./styles.module.scss";
import { X } from "lucide-react";
import { auth, signInWithPopup, twitterProvider } from "@/components/shared/utils/firebase/init";
import { googleSignup } from "@/store/actions/profile/user";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { loadMessages } from "@/components/shared/i18n/translationLoader";
import { useRouter } from "next/router";

interface Props {
  mode: "login" | "signup";
  onClose: () => void;
}

const AuthModal: React.FC<Props> = ({ mode, onClose }) => {
  const [formMode, setFormMode] = useState<"login" | "signup">(mode);
  const [email, setEmail] = useState(formMode === "signup" ? "Adam.Smith@gmail.com" : "");
  const [password, setPassword] = useState(formMode === "signup" ? "12345678" : "");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);

  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);
  const router = useRouter();



    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);

  const toggleMode = () => {
    setFormMode(formMode === "login" ? "signup" : "login");
    setEmail("");
    setPassword("");
    setEmailError("");
    setPasswordError("");
  };

  const validateEmail = (value: string) => /\S+@\S+\.\S+/.test(value);
  const validatePassword = (value: string) => value.length >= 6;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let valid = true;

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 6 characters");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (!valid) return;

    // ✅ Here you’ll connect your API or Redux action
    if (formMode === "login") {
      console.log("Logging in with:", { email, password });
      router.push('/dashboard');
      // dispatch(loginUser({ email, password }));
    } else {
      console.log("Signing up with:", { email, password });
      router.push('/dashboard');
      // dispatch(registerUser({ email, password }));
    }

    onClose(); // close modal after action
  };

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
      onClose();
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

  return (
    <div className={s.modalWrapper}>
        <X size={30} className={s.closeButton} onClick={onClose}/>
      <div className={s.header}>
        <h2>Welcome to EasySpeak!</h2>
        <p>
          By logging in or creating an account, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </p>
      </div>

      <div className={s.socialRow}>
        <button type="button" onClick={handleGoogleLogin}>
          <Image src="/icons/google.svg" alt="Google" width={20} height={20} />
        </button>
        <button type="button" onClick={handleTwitterLogin}>
          <Image src="/icons/twitter.svg" alt="Twitter" width={20} height={20} />
        </button>
      </div>

      <form className={s.form} onSubmit={handleSubmit}>
        <Input
          mode="basic"
          label="Email"
          value={email}
          onChange={setEmail}
          placeholder="email@gmail.com"
          error={emailError}
          success={!emailError && email.length > 0}
        />

        <Input
          mode="password"
          label="Password"
          value={password}
          onChange={setPassword}
          placeholder="Password"
          error={passwordError}
          success={!passwordError && password.length > 0}
        />

        {formMode === "login" && (
          <div className={s.options}>
            <label>
              <input className={s.checkbox} type="checkbox" /> Keep me logged in
            </label>
            <a href="#">Forgot password?</a>
          </div>
        )}

        <button type="submit" className={s.submitButton}>
          {formMode === "login" ? "Log in" : "Sign up"}
        </button>
      </form>

      <div className={s.footer}>
        {formMode === "login" ? (
          <div className={s.login}>
            Not account yet?{" "}
            <a onClick={toggleMode} className={s.link}>
              Sign up →
            </a>
          </div>
        ) : (
          <div className={s.login}>
            Already have an account?{" "}
            <a onClick={toggleMode} className={s.link}>
              Log in →
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
