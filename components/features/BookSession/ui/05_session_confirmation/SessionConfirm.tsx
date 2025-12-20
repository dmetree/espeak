"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadMessages } from "@/components/shared/i18n/translationLoader";
import { setDraftAppointment } from "@/store/actions/appointments";
import s from "./Session.module.css";

import { FormWrapper } from "../../helpers/FormWrapper";
import { toggleWalletSelector } from "@/store/actions/networkCardano";
import { hideModal } from "@/store/actions/modal";
import { EModalKind } from "@/components/shared/types/types";

export function SessionConfirm() {
  const dispatch = useDispatch();
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);
  const draftAppointment = useSelector(
    ({ appointments }) => appointments.draftAppointment
  );

  const [adaToUsdRate, setAdaToUsdRate] = useState<number | null>(null);

  // Wallet connection state from Cardano network slice
  const wallet = useSelector(({ networkCardano }) => networkCardano.wallet);
  const isWalletConnected = !!wallet;

  useEffect(() => {
    const fetchAdaRate = async () => {
      try {
        const response = await fetch("/api/exchange-rate/ada-usd");
        const data = await response.json();
        if (data.success && data.rate) {
          setAdaToUsdRate(data.rate);
        } else {
          setAdaToUsdRate(0.5); // Fallback rate
        }
      } catch (error) {
        console.error("Failed to fetch ADA/USD rate:", error);
        // Fallback to a default rate if API fails
        setAdaToUsdRate(0.5);
      }
    };
    fetchAdaRate();
  }, []);

  const price =
    typeof draftAppointment?.price === "number"
      ? draftAppointment.price / 100
      : null;

  const priceUsd =
    price !== null && adaToUsdRate !== null
      ? price * adaToUsdRate
      : null;

  return (
    <FormWrapper title={t.check_and_confirm}>
      <div className={s.wrapper}>
        <div className={s.req_main}>
          <div className={s.main_item}>
            {t.subject}
            <b>{draftAppointment?.selectedService.title.en}</b>
          </div>
          <div className={s.main_item}>
            {t.date}
            <b>{draftAppointment.selectedDate}</b>
          </div>
          <div className={s.main_item}>
            {t.time}
            <b>
              {draftAppointment.selectedHour}:00 -{" "}
              {draftAppointment.selectedHour}:55
            </b>
          </div>
        </div>

        {draftAppointment.nickname ? (
          <div className={s.private}>
            {t.exclusive_sent}
            {draftAppointment.nickname}
          </div>
        ) : null}

        <hr className={s.hr} />

        {/* TODO: now price in ADA. Later, add convertation to $ and count it in runtime */}
        <div className={s.price_item}>
          {t.price}
          <div className={s.price}>
            {price !== null ? (
              <>
                {price.toFixed(2)} ADA
                {priceUsd !== null && (
                  <span className={s.usdPrice}>
                    {" "}≈ ${priceUsd.toFixed(2)}
                  </span>
                )}
              </>
            ) : (
              "—"
            )}
          </div>
        </div>

        <hr className={s.hr} />
        {/* <div className={s.confirmation}>{t.agree_with_terms}</div> */}

        {!isWalletConnected && (
          <div className={s.walletWarning}>
            To continue, please,&nbsp;
            <button
              type="button"
              className={s.walletLink}
              onClick={() => {
                // Close BookSession modal so wallet selector is not behind its overlay
                dispatch(hideModal(EModalKind.BookSession));
                dispatch(toggleWalletSelector());
              }}
            >
              connect wallet
            </button>
          </div>
        )}
      </div>
    </FormWrapper>
  );
}
