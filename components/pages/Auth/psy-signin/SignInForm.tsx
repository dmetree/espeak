"use client";

import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { useRouter } from "next/router";
import { toast } from 'react-toastify';
import { loadMessages } from "@/components/shared/i18n/translationLoader";

import { schema, ValidationSchemaType } from './utils/schema';
import { useFormWithValidation } from './hooks/useFormHook';
import { signup } from "@/store/actions/profile/user";

import Button from "@/components/shared/ui/Button";

import styles from './psySign.module.scss'

export default function NewForm() {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);
  const { register, handleSubmit, errors, reset, isSubmitting } = useFormWithValidation(schema);

  const onSubmit = async (data: ValidationSchemaType) => {
    const partnerOne = localStorage.getItem("partnerOne") || '';
    const partnerTwo = localStorage.getItem("partnerTwo") || '';

    try {
      dispatch(signup(data.email, data.password, data.username, partnerOne, partnerTwo, currentLocale));
      toast.success(t.account_created);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating an account:", error);
      toast.error(t.account_not_created);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} autoComplete="new-password">
      <label htmlFor="username" className={styles.label}>
        {/* Username: */}
        <input
          type="text"
          placeholder='Username goes here...'
          autoComplete='new-password'
          {...register('username')}
          required
          className={errors.username && styles.error_input}
        />
        {errors.username && (
          <span className={styles.error}>{errors.username?.message}</span>
        )}
      </label>

      <label htmlFor="email" className={styles.label}>
        <input
          type="email"
          placeholder='Email goes here...'
          autoComplete='new-password'
          {...register('email')}
          className={errors.email && styles.error_input}
          required
        />
        {errors.email && (
          <span className={styles.error}>{errors.email?.message}</span>
        )}
      </label>

      <label htmlFor="password" className={styles.label}>
        <input
          type="password"
          autoComplete='new-password'
          placeholder='Password goes here...'
          {...register('password')}
          className={errors.password && styles.error_input}
          required
        />
        {errors.password && (
          <span className={styles.error}>{errors.password?.message}</span>
        )}
      </label>

      <label htmlFor="confirmPassword" className={styles.label}>
        <input
          type="password"
          autoComplete='new-password'
          placeholder='Confirm password'
          {...register('confirmPassword')}
          required
          className={errors.confirmPassword && styles.error_input}
        />
        {errors.confirmPassword && (
          <span className={styles.error}>{errors.confirmPassword?.message}</span>
        )}
      </label>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? t.loading : t.create_account}
      </Button>
    </form>
  )
}
