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
  confirmAppointmentOnChain
} from '@/store/actions/appointments';
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

import { TransactionBuilder, OutputBuilder, ErgoAddress } from "@fleet-sdk/core";
import { Network, Box, EIP12UnsignedTransaction, OneOrMore } from "@fleet-sdk/common";

import { TransactionHelper } from '@/blockchain/ergo/offchain/utils/transaction-helper';
import { ErgoToken } from '@/blockchain/ergo/offchain/models/transaction.types';
// import { psySessionContractErgoTree } from '@/blockchain/ergo/offchain/constants';
import { getInputBoxes } from '@/blockchain/ergo/offchain/utils/input-selecter';
import { buildCreateSession } from '@/blockchain/ergo/offchain/app/transactions/init';

import s from './.module.scss';
import { AppDispatch } from "@/store";
import { debounce } from '@/components/shared/utils/throttleDebounce';



const BookSession = () => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch<AppDispatch>();

  const userUid = useSelector(({ user }) => user.uid);
  const userData = useSelector(({ user }) => user?.userData);
  const isAppointmentFinished = useSelector(({ appointments }) => appointments.isAppointmentFinished);
  const draftAppointment = useSelector(({ appointments }) => appointments.draftAppointment);
  const ergoWalletConnected = useSelector(({ networkErgo }) => networkErgo.ergoWalletConnected);
  const ergoBalance = useSelector(({ networkErgo }) => networkErgo.ergoBalance);
  const sigUsdBalance = useSelector(({ networkErgo }) => networkErgo.sigUsdBalance);
  const ergoCustomerWalletAddress = useSelector(({ networkErgo }) => networkErgo?.ergoWalletAddress[0]);

  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);

  const isClient = userData?.userRole === EUserRole.Novice;
  const isSpecialist = userData?.userRole === EUserRole.Specialist;
  const timeZoneName = getCurrentTimeZone();

  const [freeTimestamps, setFreeTimestamps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [blockchainTransactionId, setBlockchainTransactionId] = useState<EIP12UnsignedTransaction | undefined>(undefined);
  const [singletonId, setSingletonId] = useState<EIP12UnsignedTransaction | undefined>(undefined);

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

    const appointment = {
      ...draftAppointment,
      created_at: Timestamp.now(),
      scheduledUnixtime,
      clientUid: userUid,
      clientAvatar: userData?.avatar,
      specUid: draftAppointment.specUid ? draftAppointment.specUid : null,
      type: draftAppointment.specUid ? 'direct' : 'general',
      lang: userData?.languages,
    };



    dispatch(hideModal(EModalKind.BookSession));
    setLoading(true);

    // Ergo tx building ====================
    try {

      const isConnected = await ergoConnector.nautilus.connect({ createErgoObject: false });
      const isAuthorized = ergoConnector.nautilus.isAuthorized();

      const nodeNetwork = Network.Mainnet;
      const ergo = await ergoConnector.nautilus.getContext();

      const nodeHeight = await ergo.get_current_height();
      const transactionHelper = new TransactionHelper(ergo);
      const nanoErgSessionValue = BigInt(1_100_000);
      const nanoErgMinerFee = BigInt(1_100_000);

      // person-to-person
      const p2pkInputAmount = nanoErgSessionValue + nanoErgMinerFee;

      const address = ergoCustomerWalletAddress.toString(nodeNetwork);
      const contractAddress = ErgoAddress.fromBase58(process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS);

      const paymentToken: ErgoToken = {
        tokenId: "03faf2cb329f2e90d6d23b58d91bbb6c046aa143261cc21f52fbe2824bfcbf04",
        amount: BigInt(draftAppointment.price),
      };
      const timeInBlocksBeforeStartOfSession = (appointment.scheduledUnixtime - Math.floor(Date.now() / 1000)) / 120;
      const sessionStartTime = nodeHeight + Math.floor(timeInBlocksBeforeStartOfSession);

      const customerAddress = ErgoAddress.fromBase58(ergoCustomerWalletAddress);
      const userInputs = await ergo.get_utxos();

      const partnerOneAddress = ErgoAddress.fromBase58(userData?.partnerOne ? userData?.partnerOne : "9efDyqCqk457p94YsFfuSX4CDYDG2WvEPouSVswU3xoyjcqhXJT");
      const partnerTwoAddress = ErgoAddress.fromBase58(userData?.partnerTwo ? userData?.partnerTwo : "9efDyqCqk457p94YsFfuSX4CDYDG2WvEPouSVswU3xoyjcqhXJT");

      buildCreateSession(
        userInputs,
        paymentToken,
        customerAddress,
        contractAddress,
        customerAddress,
        customerAddress,
        sessionStartTime,
        nanoErgSessionValue,
        nanoErgMinerFee,
        nodeHeight,
        transactionHelper,
        draftAppointment.price,
        partnerOneAddress,
        partnerTwoAddress,
      ).then(async ({ singletonId, txId }) => {
        setBlockchainTransactionId(txId);
        setSingletonId(singletonId);

        const currentUnixTime = Math.floor(Date.now() / 1000);
        const updatedFreeTimestamps = freeTimestamps.filter(
          (timestamp) => timestamp > currentUnixTime && timestamp !== appointment.scheduledUnixtime
        );

        const addressString1 = partnerOneAddress.toString();
        const addressString2 = partnerTwoAddress.toString();

        // 🟢 Dispatch appointment immediately
        const docId = await dispatch(createAppointment(userUid, appointment, singletonId, txId, addressString1, addressString2));

        if (isSpecialist) {
          await dispatch(saveSlots(userUid, updatedFreeTimestamps));
          setFreeTimestamps(updatedFreeTimestamps);
        }

        toast.info(t.tx_in_process, txId);

        // 🕒 Polling confirmation logic
        const maxAttempts = 30;
        const pollInterval = 30 * 1000;
        let pollAttempts = 0;

        const pollForConfirmation = async () => {
          try {
            const response = await fetch(`https://api.ergoplatform.com/api/v1/boxes/unspent/byTokenId/${singletonId}`);
            const data = await response.json();

            if (Array.isArray(data.items) && data.items.length > 0) {
              console.log("Transaction confirmed on chain.");

              // ✅ Dispatch a follow-up action
              await dispatch(confirmAppointmentOnChain(docId));

              toast.success(t.request_confirmed_onchain);

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
              setLoading(false);
              dispatch(hideModal(EModalKind.BookSession));
            } else if (++pollAttempts < maxAttempts) {
              setTimeout(pollForConfirmation, pollInterval);
            } else {
              setLoading(false);
              setError("Transaction not confirmed after several attempts.");
              toast.error("Transaction timeout. Please check later.");
            }
          } catch (err) {
            console.error("Polling error:", err);
            if (++pollAttempts < maxAttempts) {
              setTimeout(pollForConfirmation, pollInterval);
            } else {
              setLoading(false);
              setError("Transaction confirmation failed.");
              toast.error("Unable to confirm transaction.");
            }
          }
        };

        // 🟡 Start polling
        pollForConfirmation();
      })

    } catch (error) {
      if (error instanceof NoAuthError) {
        router.push("/sign_in");
      } else {
        setError(error.message || "Unknown error occurred");
      }
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
            disabled={!ergoWalletConnected && isLastStep
              || sigUsdBalance < draftAppointment.price / 100 && isLastStep
              || ergoBalance < 0.1 && isLastStep}
          >
            {isLastStep ? t.confirm_iusd : t.done}
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
