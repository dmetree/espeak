"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { loadMessages } from "@/components/shared/i18n/translationLoader";

import { schema, ValidationSchemaType } from "@/components/pages/Auth/psy-signin/utils/schema";
import { useFormWithValidation } from "@/components/pages/Auth/psy-signin/hooks/useFormHook";
import { signup, googleSignup } from "@/store/actions/profile/user";
import { auth, signInWithPopup, googleProvider, twitterProvider } from "@/components/shared/utils/firebase/init";
import { hideModal, showModal } from "@/store/actions/modal";
import { EModalKind } from "@/components/shared/types";

import Button from "@/components/shared/ui/Button";
import styles from "./styles.module.scss";

export default function SignUp() {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);
  const { register, handleSubmit, errors, isSubmitting } = useFormWithValidation(schema);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const closeModal = () => dispatch(hideModal(EModalKind.SignUp));

  const openLogin = () => {
    dispatch(hideModal(EModalKind.SignUp));
    dispatch(showModal(EModalKind.Login));
  };

  const onSubmit = async (data: ValidationSchemaType) => {
    const partnerOne = localStorage.getItem("partnerOne") || "";
    const partnerTwo = localStorage.getItem("partnerTwo") || "";

    try {
      await dispatch(signup(data.email, data.password, data.username, partnerOne, partnerTwo, currentLocale));
      toast.success(t.account_created);
      closeModal();
      router.push("/dashboard");
    } catch (err) {
      console.error("Error creating an account:", err);
      toast.error(t.account_not_created);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

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
    <div className={styles.modalWrapper}>
      <X size={30} className={styles.closeButton} onClick={closeModal} />

      <div className={styles.header}>
        <h2>Welcome to EasySpeak!</h2>
        <p>
          By logging in or creating an account, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </p>
      </div>

      <div className={styles.socialRow}>
        <button type="button" onClick={handleGoogleLogin}>
          <Image src="/icons/google.svg" alt="Google" width={20} height={20} />
        </button>
        <button type="button" onClick={handleTwitterLogin}>
          <Image src="/icons/twitter.svg" alt="Twitter" width={20} height={20} />
        </button>
      </div>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} autoComplete="new-password">
        <label htmlFor="username" className={styles.label}>
          <input

            type="text"
            placeholder="Username goes here..."
            autoComplete="new-password"
            {...register("username")}
            required
            className={styles.input && errors.username && styles.error_input}
          />
          {errors.username && <span className={styles.error}>{errors.username?.message}</span>}
        </label>

        <label htmlFor="email" className={styles.label}>
          <input
            type="email"
            placeholder="Email goes here..."
            autoComplete="new-password"
            {...register("email")}
            required
            className={errors.email && styles.error_input}
          />
          {errors.email && <span className={styles.error}>{errors.email?.message}</span>}
        </label>

        <label htmlFor="password" className={styles.label}>
          <input
            type="password"
            placeholder="Password goes here..."
            autoComplete="new-password"
            {...register("password")}
            required
            className={errors.password && styles.error_input}
          />
          {errors.password && <span className={styles.error}>{errors.password?.message}</span>}
        </label>

        <label htmlFor="confirmPassword" className={styles.label}>
          <input
            type="password"
            placeholder="Confirm password"
            autoComplete="new-password"
            {...register("confirmPassword")}
            required
            className={errors.confirmPassword && styles.error_input}
          />
          {errors.confirmPassword && <span className={styles.error}>{errors.confirmPassword?.message}</span>}
        </label>

        <Button type="submit" disabled={isSubmitting || loading}>
          {isSubmitting || loading ? t.loading : t.create_account}
        </Button>

        {error && <p className={styles.error}>{error}</p>}
      </form>

      <div className={styles.footer}>
        <div className={styles.login}>
          Have an account already?{" "}
          <a onClick={openLogin} className={styles.link}>
            Log in →
          </a>
        </div>
      </div>
    </div>
  );
}
