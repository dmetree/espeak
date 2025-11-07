import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { loadMessages } from "@/components/shared/i18n/translationLoader";

import Page from "@/components/shared/ui/Page/Page";
import Substrate from "@/components/shared/ui/Substrate/Substrate";
import SignInForm from "./SignInForm";

import s from "./psySign.module.scss";

export default function SignUp() {
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);

  return (
    <Page>
      <Substrate className={s.wrapper} color="base" width="auth_form">
        <h2 className={s.header}>{t.create_account}</h2>

        <SignInForm />

        <div className={s.confirmation}>
          {t.have_an_account}{" "}
          <Link className={s.link} href="/login">
            {t.enter}
          </Link>
        </div>
      </Substrate>
    </Page>
  );
}
