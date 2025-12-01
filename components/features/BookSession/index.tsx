// @ts-nocheck
import { format } from 'date-fns';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import { Timestamp } from "firebase/firestore";
import {
  createAppointment,
  setIsAppointmentFinished,
  clearDraftAppointment,
  setDraftAppointment,
} from '@/store/actions/appointments';
import { submitLessonRequestTx } from '@/store/actions/lessons';
import { saveSlots, actionUpdateProfile, } from '@/store/actions/profile/user';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import { EModalKind } from '@/components/shared/types';
import { EReqStatus, EGender, NoAuthError, EUserRole } from '@/components/shared/types';
import Button from '@/components/shared/ui/Button';
import { hideModal } from '@/store/actions/modal';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { SessionFormat } from './ui/00_session_format/SessionFormat';
import { SessionServices } from './ui/001_session_services/Session_services';
import { SessionSubject } from './ui/01_session_subject/SessionSubject';
import { SessionDate } from './ui/02_session_date/SessionDate';
import { SessionTime } from './ui/03_session_time/SessionTime';
import { SessionPsy } from './ui/04_session_psychologist/SessionPsy';
import { SessionConfirm } from './ui/05_session_confirmation/SessionConfirm';
import { useMultistepForm } from '@/components/shared/hooks/use-multistep-form';
import { getCurrentTimeZone } from '@/components/shared/utils/datetime/get-current-timezone';

// Blockchain/off-chain imports disabled for backend-only flow
// import { TransactionBuilder, OutputBuilder, ErgoAddress } from "@fleet-sdk/core";
// import { Network, Box, EIP12UnsignedTransaction, OneOrMore } from "@fleet-sdk/common";
// import { TransactionHelper } from '@/blockchain/ergo/offchain/utils/transaction-helper';
// import { ErgoToken } from '@/blockchain/ergo/offchain/models/transaction.types';
// import { getInputBoxes } from '@/blockchain/ergo/offchain/utils/input-selecter';
// import { buildCreateSession } from '@/blockchain/ergo/offchain/app/transactions/init';

import s from './.module.scss';
import { AppDispatch } from "@/store";
import { debounce } from '@/components/shared/utils/throttleDebounce';


const BookSession = () => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch<AppDispatch>();

  const user = useSelector(({ networkCardano }) => networkCardano.user);
  const wallet = useSelector(({ networkCardano }) => networkCardano.wallet);

  const userUid = useSelector(({ user }) => user.uid);
  const userData = useSelector(({ user }) => user?.userData);
  const isAppointmentFinished = useSelector(({ appointments }) => appointments.isAppointmentFinished);
  const draftAppointment = useSelector(({ appointments }) => appointments.draftAppointment);
  // Blockchain-related wallet state disabled for backend-only flow
  // const ergoWalletConnected = useSelector(({ networkErgo }) => networkErgo.ergoWalletConnected);
  // const ergoBalance = useSelector(({ networkErgo }) => networkErgo.ergoBalance);
  // const sigUsdBalance = useSelector(({ networkErgo }) => networkErgo.sigUsdBalance);
  // const ergoCustomerWalletAddress = useSelector(({ networkErgo }) => networkErgo?.ergoWalletAddress[0]);

  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);

  const isClient = userData?.userRole === EUserRole.Novice;
  const isSpecialist = userData?.userRole === EUserRole.Specialist;
  const timeZoneName = getCurrentTimeZone();

  const [freeTimestamps, setFreeTimestamps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Blockchain transaction state disabled for backend-only flow
  // const [blockchainTransactionId, setBlockchainTransactionId] = useState<EIP12UnsignedTransaction | undefined>(undefined);
  // const [singletonId, setSingletonId] = useState<EIP12UnsignedTransaction | undefined>(undefined);

  const localeRef = useRef(currentLocale);

  const getSteps = () => {
    return router.pathname.startsWith('/specialist-profile')
      ? [<SessionServices key="services" />, <SessionConfirm key="confirm" />]
      : [
        <SessionFormat key="format" />,
        <SessionSubject key="subject" />,
        <SessionDate key="date" />,
        <SessionTime key="time" />,
        <SessionPsy key="psy" />,
        <SessionConfirm key="confirm" />
      ];
  };

  const { step, isFirstStep, isLastStep, back, next } = useMultistepForm(getSteps());

  // Submit handler
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isLastStep) return next();

    const selectedDate = new Date(draftAppointment.selectedDate);
    const scheduledUnixtime = selectedDate.setHours(draftAppointment.selectedHour, 0, 0, 0) / 1000;

    const rawAppointment = {
      ...draftAppointment,
      created_at: Timestamp.now(),
      scheduledUnixtime,
      clientUid: userUid,
      clientAvatar: userData?.avatar,
      specUid: draftAppointment.specUid ? draftAppointment.specUid : null,
      type: draftAppointment.specUid ? 'direct' : 'general',
      lang: userData?.languages,
    };

    // Remove any undefined fields to satisfy Firestore (e.g. psyRank can be undefined)
    const appointment = Object.fromEntries(
      Object.entries(rawAppointment).filter(([, value]) => value !== undefined)
    );

    setLoading(true);

    try {
      const currentUnixTime = Math.floor(Date.now() / 1000);
      const updatedFreeTimestamps = freeTimestamps.filter(
        (timestamp) => timestamp > currentUnixTime && timestamp !== appointment.scheduledUnixtime
      );

      // // Cardano transaction
      const response = await fetch('/api/lessons/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAddress: user.address,
          lessonData: appointment,
        }),
      });
      if (response.status !== 200) {
        throw new Error('Failed to create lesson request transaction');
      }
      const { success, txCbor } = await response.json();
      if (!success) {
        throw new Error('Lesson request transaction was not successful');
      }

      // Create appointment in backend (Firestore)
      await dispatch(createAppointment(userUid, appointment));

      // Update specialist free slots in backend
      if (isSpecialist) {
        await dispatch(saveSlots(userUid, updatedFreeTimestamps));
        setFreeTimestamps(updatedFreeTimestamps);
      }

      // Push notification into user profile in backend
      const payload = {
        title: t.notificaiton_request_created,
        message: t.text_request_created,
        linkTo: "",
        created_at: new Date(),
        isRead: false,
      };

      const currentNotifications = Array.isArray(userData?.notifications)
        ? userData.notifications
        : [];

      const updatedNotifications = [...currentNotifications, payload];

      await dispatch(actionUpdateProfile(updatedNotifications, userUid, "notifications"));

      dispatch(setIsAppointmentFinished(true));
      dispatch(clearDraftAppointment());
      dispatch(hideModal(EModalKind.BookSession));
      toast.success(t.request_confirmed_onchain || t.notificaiton_request_created);
    } catch (error) {
      console.error(error);
      setError(error.message || "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData?.freeTimestamps) {
      setFreeTimestamps(userData?.freeTimestamps);
    }
  }, [userData?.freeTimestamps]);


  useEffect(() => {
    dispatch(setDraftAppointment({
      ...draftAppointment,
      timeZone: userUid ? userData?.timeZone : timeZoneName,
    }));
  }, [userUid, userData, timeZoneName]);

  useEffect(() => {
    if (localeRef.current !== currentLocale) {
      localeRef.current = currentLocale;

      debounce(currentLocale);
    }
  }, [currentLocale]);

  useEffect(() => {
    return () => {
      dispatch(clearDraftAppointment());
      dispatch(setIsAppointmentFinished(false));
      setError('');
      setLoading(false);
    };
  }, []);


  return (
    <div className={s.booking}>
      <form onSubmit={onSubmit}>
        {step}
        <div className={s.controls}>
          {!isFirstStep && (
            <Button backbtn className={s.formBtn} type="button" onClick={back}>
              {t.back}
            </Button>
          )}
          <Button
            className={s.formBtn}
            type="submit"
          >
            {isLastStep ? t.done : t.done}
            {/* Wallet/balance warnings disabled for backend-only flow */}
            {/*
            {!ergoWalletConnected && isLastStep && (
              <>
                <span className={s.warningIndicator}>!</span>
                <div className={s.tooltip}>
                  {t.connect_your_wallet}
                </div>
              </>
            )}
            {ergoWalletConnected && isLastStep && sigUsdBalance < draftAppointment.price / 100 && (
              <>
                <span className={s.warningIndicator}>!</span>
                <div className={s.tooltip}>
                  {t.not_enough_sigusd}
                </div>
              </>
            )}
            {ergoWalletConnected && isLastStep && ergoBalance < 0.1 && (
              <>
                <span className={s.warningIndicator}>!</span>
                <div className={s.tooltip}>
                  {t.not_enough_ergo}
                </div>
              </>
            )}
            */}
          </Button>
          {/* {!ergoWalletConnected && (
            <div className={s.tooltip}>You need to connect your wallet!</div>
          )} */}
        </div>
      </form>
    </div>
  );
};

export default BookSession;
