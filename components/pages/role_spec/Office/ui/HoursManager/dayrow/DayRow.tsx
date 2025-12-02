import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteRequest,
  acceptRequest,
  deleteAcceptedReqPsych,
  setRequestRoomId,
  fetchMyAppointments,
  psychDeleteRequestClaimRewards
} from "@/store/actions/appointments";
import { AppDispatch } from "@/store";
import {
  actionUpdateProfile,
  fetchUserData,
} from "@/store/actions/profile/user";
import { ErgoAddress, Network } from '@fleet-sdk/core';

import { ErgoToken } from "@/blockchain/ergo/offchain/models/transaction.types";

import {
  nodeNetwork,
  nanoErgSessionValue,
  nanoErgMinerFee,
  p2pkInputAmount,
} from '@/components/shared/utils/ergo-blockchain-utils';

import { saveSlots } from '@/store/actions/profile/user';
import { showModal, hideModal, toggleModal } from '@/store/actions/modal';
import { toast } from "react-toastify";
import { loadMessages } from '@/components/shared/i18n/translationLoader';

import { EScheduleMark, EReqStatus, EModalKind } from '@/components/shared/types';
import Button from '@/components/shared/ui/Button';
import { Tooltip } from '@/components/shared/ui/Tooltip/Tooltip';

import { buildRefundClient } from "@/blockchain/ergo/offchain/app/transactions/refundClientTx/refundClient";
import { TransactionHelperRefund } from "@/blockchain/ergo/offchain/app/transactions/refundClientTx/refund-transaction-helper";
import { buildCancelAcceptPsych } from '@/blockchain/ergo/offchain/app/transactions/cancelAcceptedSessionPsychTx/cancelAcceptPsych';
import { TransactionHelperCancelAcceptPsych } from '@/blockchain/ergo/offchain/app/transactions/cancelAcceptedSessionPsychTx/cancel-accept-psych-transaction-helper';
import { TransactionHelperAccept } from "@/blockchain/ergo/offchain/app/transactions/acceptRequestTx/accept-transaction-helper";
import { buildAcceptRequest } from "@/blockchain/ergo/offchain/app/transactions/acceptRequestTx/acceptRequest";

import { buildPsychEndNoProblem } from '@/blockchain/ergo/offchain/app/transactions/endSessionPsychTx/endSessionPsych';
import { TransactionHelperEndSessionPsych } from '@/blockchain/ergo/offchain/app/transactions/endSessionPsychTx/end-session-psych-transaction-helper';
import { TxConfirmationListener } from '@/hooks/blockchainListener';

import s from './DayRow.module.scss';
import { ConfirmCancelModal } from '@/components/shared/ui/ConfirmCancelModal/ConfirmCancelModal';
import { useClickOutside } from '@/hooks/useClickOutside';
import { getLocalizedContent } from '@/hooks/localize';


const DayRow = ({ hour, handleClick, mark, bgColor, request, isPastHour }) => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const userUid = useSelector(({ user }) => user.uid);
  const userData = useSelector(({ user }) => user?.userData);
  const therapistWalletAddress = useSelector(({ networkErgo }) => networkErgo?.ergoWalletAddress[0]);

  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);

  const [showDropdownCancelAcceptPsych, setShowDropdownCancelAcceptPsych] = useState(false);
  const dropdownRefCancelAcceptPsych = useRef(null);
  const toggleDropdownCancelAcceptPsych = () => setShowDropdownCancelAcceptPsych(prev => !prev);
  const [isAccepting, setIsAccepting] = useState(false);
  const [sessionBox, setSessionBox] = useState();

  const [showConfirmCancelModal, setShowConfirmCancelModal] = useState(false);
  const [cancelMeta, setCancelMeta] = useState<{
    singletonId: string;
    blocksBeforeStart: number;
  } | null>(null);

  const [now, setNow] = useState(Date.now());
  const listenerRef = useRef<TxConfirmationListener | null>(null);
  const [showDropdownCancelNovicePsych, setShowDropdownCancelNovicePsych] = useState(false);
  const dropdownRefCancelNovicePsych = useRef(null);
  const toggleDropdownCancelNovicePsych = () => setShowDropdownCancelNovicePsych(prev => !prev);
  const [freeTimestamps, setFreeTimestamps] = useState([]);

  useClickOutside(dropdownRefCancelAcceptPsych, () => {
    setShowDropdownCancelAcceptPsych(false);
  });

  useClickOutside(dropdownRefCancelNovicePsych, () => {
    setShowDropdownCancelNovicePsych(false);
  });

  const isClickable = request === null;
  const classNames = `${s.dayRow}
    ${mark === EScheduleMark.OPEN_FOR_WORK ? s.openForWork : s.busy}
    ${request ? s.psyRequest : null}
    ${hour < 9 ? s.smallHour : null}
    ${isPastHour ? s.isPastHour : null}
    `;

  const getStatusText = (status) => {
    return EReqStatus[status] || 'Unknown Status';
  };


  const joinChatRoom = () => {
    dispatch(showModal(EModalKind.VideoCall)); // TODO: add modal
    dispatch(setRequestRoomId(request.id)); // TODO: import method
  };

  const onSpecialistAccept = async () => {

    const response = await fetch(
      `https://api.ergoplatform.com/api/v1/boxes/unspent/byTokenId/${request.singletonId}`
    );
    const data = await response.json();

    if (!data.items?.length) return;

    const sessionBox = data.items[0];
    setSessionBox(sessionBox);

    const ergo = await ergoConnector.nautilus.getContext();
    const nodeHeight = await ergo.get_current_height();
    const transactionHelper = new TransactionHelperAccept(ergo);

    const therapistAddress = ErgoAddress.fromBase58(therapistWalletAddress);
    const therapistTokenIdPass =
      "f151f5c1aab0d47a82083d210346fb0cf919335a31308e1448ac0bff33eb2209";
    const collateral = (request.price / 10).toString();

    const checkTherapistTokenIdPass = await ergo.get_utxos({
      tokens: [
        {
          tokenId: therapistTokenIdPass,
        },
      ],
    });

    const registrationBoxToken = checkTherapistTokenIdPass.find((box) =>
      box?.assets?.some(
        (asset) =>
          asset?.tokenId === therapistTokenIdPass && asset.amount >= "1"
      )
    );

    if (!registrationBoxToken) {
      return toast.error(t.requests.not_a_psychologist);
    }

    const registrationBox = checkTherapistTokenIdPass[0];

    let checkEnoughAmount = await ergo.get_utxos({
      tokens: [
        {
          tokenId:
            "03faf2cb329f2e90d6d23b58d91bbb6c046aa143261cc21f52fbe2824bfcbf04",
          amount: collateral,
        },
      ],
    });

    if (!checkEnoughAmount?.length) {
      return toast.error(t.requests.not_enough_funds);
    }

    const index = checkEnoughAmount.findIndex(
      (item) => item === registrationBox
    );
    if (index !== -1) {
      checkEnoughAmount = [
        ...checkEnoughAmount.slice(0, index),
        ...checkEnoughAmount.slice(index + 1),
      ];
    }

    const paymentToken = {
      tokenId:
        "03faf2cb329f2e90d6d23b58d91bbb6c046aa143261cc21f52fbe2824bfcbf04",
      amount: BigInt(request.price),
    };

    await buildAcceptRequest(
      sessionBox,
      therapistAddress,
      registrationBox,
      checkEnoughAmount,
      request.singletonId,
      paymentToken,
      nanoErgMinerFee,
      nodeHeight,
      transactionHelper
    );

    setIsAccepting(true);

    // listenerRef.current = new TxConfirmationListener({
    //   txId,
    //   onConfirmed: () => {
    //     dispatch(acceptRequest(userUid, request.id, userData.nickname, userData.avatar, userData.psyRank));
    //     dispatch(fetchMyAppointments(userUid));
    //     toast.success("You accepted a personal request for therapy.");
    //     setIsAccepting(false); // reset
    //   },
    //   onError: () => {
    //     toast.error("Blockchain confirmation failed.");
    //     setIsAccepting(false); // reset
    //   }
    // });
    // listenerRef.current.start();

    dispatch(acceptRequest(userUid, request.id, userData.nickname, userData.avatar, userData.psyRank));
    dispatch(fetchMyAppointments(userUid));
    setIsAccepting(false); // reset

    //// pushing notifications and getting it back====
    const payload = {
      title: t.notification_accept_request,
      message: t.text_accept_request,
      linkTo: "",
      created_at: new Date(),
      isRead: false,
    };

    // Safely append to existing notifications array
    const currentNotifications = Array.isArray(userData?.notifications)
      ? userData.notifications
      : [];

    const updatedNotifications = [...currentNotifications, payload];

    await dispatch(
      actionUpdateProfile(updatedNotifications, userUid, "notifications")
    );

    await dispatch(fetchUserData(userUid));
    ////==========

    toast.success("You accepted a personal request.");
  };


  const onSpecialistDecline = () => {
    // TODO add offchain logic
    toast.success("You declined a personal request for therapy.");
  }

  const ergoCustomerWalletAddress = useSelector(
    ({ networkErgo }) => networkErgo?.ergoWalletAddress[0]
  );

  const onPsychNoviceDelete = async () => {
    try {
      const response = await fetch(
        `https://api.ergoplatform.com/api/v1/boxes/unspent/byTokenId/${request.singletonId}`
      );
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const sessionBox = data.items[0];
        const ergo = await ergoConnector.nautilus.getContext();
        const nodeHeight = await ergo.get_current_height();
        const transactionHelper = new TransactionHelperRefund(ergo);

        const address = ergoCustomerWalletAddress.toString(nodeNetwork);

        const paymentToken: ErgoToken = {
          tokenId:
            "03faf2cb329f2e90d6d23b58d91bbb6c046aa143261cc21f52fbe2824bfcbf04",
          amount: BigInt(request.price),
        };

        const customerAddress = ErgoAddress.fromBase58(
          ergoCustomerWalletAddress
        );

        const userInputs = await ergo.get_utxos();
        const singletonId = request?.singletonId;

        await buildRefundClient(
          userInputs,
          sessionBox,
          singletonId,
          paymentToken,
          customerAddress,
          customerAddress,
          nanoErgMinerFee,
          nodeHeight,
          transactionHelper
        );

        dispatch(deleteRequest(userUid, request.id));

        //// pushing notifications and getting it back====
        const payload = {
          title: t.notification_novice_delete,
          message: t.text_novice_delete,
          linkTo: "",
          created_at: new Date(),
          isRead: false,
        };

        // Safely append to existing notifications array
        const currentNotifications = Array.isArray(userData?.notifications)
          ? userData.notifications
          : [];

        const updatedNotifications = [...currentNotifications, payload];

        await dispatch(
          actionUpdateProfile(updatedNotifications, userUid, "notifications")
        );

        await dispatch(fetchUserData(userUid));
        ////==========

        toast.success(t.tx_refunded);
      } else {
        console.log("No session box found with this singleton ID");
      }
    } catch (error) {
      toast.success(t.requests.failed_delete);
      console.error("Failed to delete novice request:", error);
    }
  };

  const onSpecialistCancelAccept = async (singletonId) => {

    const response = await fetch(`https://api.ergoplatform.com/api/v1/boxes/unspent/byTokenId/${singletonId}`);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const sessionBox = data.items[0];

      // --- Build accept transaction --- //

      const ergo = await ergoConnector.nautilus.getContext();
      const nodeHeight = await ergo.get_current_height();
      const transactionHelper = new TransactionHelperCancelAcceptPsych(ergo);


      const therapistAddress = ErgoAddress.fromBase58(therapistWalletAddress);

      await buildCancelAcceptPsych(
        sessionBox,
        therapistAddress,
        nanoErgMinerFee,
        nodeHeight,
        transactionHelper,
      )
    }

    await dispatch(deleteAcceptedReqPsych(userUid, request.id));
    dispatch(fetchMyAppointments(userUid));

    //// pushing notifications and getting it back====
    const payload = {
      title: t.notification_spec_cancel_accept,
      message: t.text_spec_cancel_accept,
      linkTo: "",
      created_at: new Date(),
      isRead: false,
    };

    // Safely append to existing notifications array
    const currentNotifications = Array.isArray(userData?.notifications)
      ? userData.notifications
      : [];

    const updatedNotifications = [...currentNotifications, payload];

    await dispatch(
      actionUpdateProfile(updatedNotifications, userUid, "notifications")
    );

    await dispatch(fetchUserData(userUid));
    ////==========

    toast.success("You canceled an accepted request.");
  };


  const onSpecialistClaimRewards = async (singletonId) => {
    const response = await fetch(`https://api.ergoplatform.com/api/v1/boxes/unspent/byTokenId/${singletonId}`);
    const data = await response.json();

    console.log('data', data.items[0])

    if (data.items && data.items.length > 0) {
      // The first box in the result should be your session box
      const sessionBox = data.items[0];

      // --- Build accept transaction --- //

      const ergo = await ergoConnector.nautilus.getContext();
      const nodeHeight = await ergo.get_current_height();
      const transactionHelper = new TransactionHelperEndSessionPsych(ergo);


      const therapistAddress = ErgoAddress.fromBase58(therapistWalletAddress);

      await buildPsychEndNoProblem(
        sessionBox,
        therapistAddress,
        nanoErgMinerFee,
        nodeHeight,
        transactionHelper,
      )
    }
  }

  const createdAtMs =
    request?.created_at?.seconds * 1000 +
    Math.floor(request?.created_at?.nanoseconds / 1e6);

  const isAcceptDisabled = now - createdAtMs < 10 * 60 * 1000;

  useEffect(() => {
    if (userData?.freeTimestamps) {
      setFreeTimestamps(userData?.freeTimestamps);
    }
  }, [userData?.freeTimestamps]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const handleClaimRewards = () => {
    // dispatch(psychDeleteRequestClaimRewards(userUid, request.id));
    toast.success("You claimed rewards")
  }

  return (
    <div
      key={hour}
      onClick={isClickable ? handleClick : () => null} // Disable onClick if psyRequest is not null
      className={classNames}
      style={{
        backgroundColor: bgColor,
      }}
    >
      <span className={s.hourOfDay}>{hour}:00</span>

      {request ? (
        <div className={s.dayRowWrapper}>

          <span className={s.paramsAndPrice}>
            <span className={s.reqParams}>
              <span className={s.reqParam}> {userUid === request.clientUid ? `${t.my_request}` : `${t.my_work}`}</span>
              /
              <span className={s.reqParam}>{getStatusText(request.status)}</span>
            </span>
            {request?.type === "direct"
              ? getLocalizedContent(request?.selectedService?.title, currentLocale)
              : t[request?.subject]
            }
          </span>


          {request?.price && <span>${request?.price / 100}</span>}


          {userUid === request.clientUid && request.status !== EReqStatus.Open && (
            <Button
              className={s.dayRowBtn}
              onClick={joinChatRoom}
            >&#128682;</Button>
          )}

          {userUid === request.clientUid && request.status === EReqStatus.Open && (
            <>
              <div
                className={s.etc}
                onClick={toggleDropdownCancelNovicePsych}
                role="button"
                tabIndex={0}>
                &#8942;
              </div>

              {showDropdownCancelNovicePsych && (
                <div className={s.dropdown} ref={dropdownRefCancelNovicePsych}>
                  <Button

                    onClick={onPsychNoviceDelete}
                  >{t.cancel}</Button>
                </div>
              )}
            </>
          )}

          {userUid === request.specUid && request.status === EReqStatus.Open && (
            <span>
              <span className={s.directRequestBox}>
                <span>{t.direct_request}</span>
                <Tooltip title={t.direct_request_tooltip} />
              </span>
              <span className={s.actionBtns}>
                {isAccepting ? (
                  <span className={s.loader}>⏳</span>
                ) : (
                  <>
                    {/* <Button
                      cancel
                      dayRowBtn
                      className={s.dayRowBtnCancel}
                      onClick={onSpecialistDecline}
                    >&#10060;</Button> */}

                    {/* TODO: add a hint that would explain the button onhover*/}
                    <Button
                      className={s.dayRowBtn}
                      onClick={onSpecialistAccept}
                      // disabled={isAcceptDisabled}
                      aria-disabled={isAcceptDisabled}
                      title={isAcceptDisabled ? t?.available_in_10_min ?? 'Available after 10 minutes' : ''}
                    >
                      &#10004;
                    </Button>
                  </>
                )}
              </span>
            </span>
          )}


          {userUid === request.specUid && request.status !== EReqStatus.Open && (
            <span className={s.reqActions} ref={dropdownRefCancelAcceptPsych}>


              <Button
                className={s.dayRowBtn}
                onClick={joinChatRoom}
              >&#128682;</Button>
              <div
                className={s.etc}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdownCancelAcceptPsych();
                }}
                role="button"
                tabIndex={0}>
                &#8942;
              </div>
              {showDropdownCancelAcceptPsych && (
                <div
                  className={s.dropdown}
                  ref={dropdownRefCancelAcceptPsych}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* <Button

                    type="button"
                    // className={s.dropdownItem}
                    onClick={async (e) => {
                      e.stopPropagation();

                      const response = await fetch(
                        `https://api.ergoplatform.com/api/v1/boxes/unspent/byTokenId/${request.singletonId}`
                      );
                      const data = await response.json();
                      if (!data.items?.length) return;

                      const sessionBox = data.items[0];
                      const startBlockHeight = Number(sessionBox.additionalRegisters?.R4?.renderedValue);
                      const ergo = await ergoConnector.nautilus.getContext();
                      const nodeHeight = await ergo.get_current_height();
                      const blocksBeforeStart = startBlockHeight - nodeHeight;

                      setCancelMeta({
                        singletonId: request.singletonId,
                        blocksBeforeStart,
                      });

                      // close dropdown, then open modal
                      setShowDropdownCancelAcceptPsych(false);
                      setShowConfirmCancelModal(true);
                    }}
                  >
                    {t.cancel}
                  </Button> */}
                  <Button onClick={handleClaimRewards}>
                    {t.collect_rewards}
                  </Button>
                </div>
              )}

              {/* <Button
                dayRowBtn
                className={s.dayRowBtn}
                onClick={() => onSpecialistClaimRewards(psyRequest?.singletonId)}
              >💰</Button> */}
              {showConfirmCancelModal && cancelMeta && (
                <ConfirmCancelModal
                  meta={cancelMeta}
                  onConfirm={async () => {
                    setShowConfirmCancelModal(false);
                    await onSpecialistCancelAccept(cancelMeta.singletonId);
                    setShowDropdownCancelAcceptPsych(false);
                  }}
                  onClose={() => {
                    setShowConfirmCancelModal(false);
                    setShowDropdownCancelAcceptPsych(false);
                  }}
                  t={t}
                  status="table"
                />
              )}

            </span>
          )}
        </div>
      ) : (
        mark === EScheduleMark.OPEN_FOR_WORK && (
          <span className={s.openText}>{t.open_for_work}</span>
        )
      )}
    </div>
  );
};

export default DayRow;
