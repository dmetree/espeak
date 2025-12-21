import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import spacetime from 'spacetime';
import { toast } from "react-toastify";
import { AppDispatch } from '@/store';
import { deleteAcceptedReqPsych, fetchMyAppointments } from "@/store/actions/appointments";
import {
  actionUpdateProfile,
  fetchUserData,
} from "@/store/actions/profile/user";
import * as actions from "@/store/actions/networkCardano";

import Button from '@/components/shared/ui/Button';
import { ConfirmCancelModal } from '@/components/shared/ui/ConfirmCancelModal/ConfirmCancelModal';
import { EReqStatus, EUserRole } from '@/components/shared/types/types';

import s from '../OpenPsyRequestItem.module.css';

export const RequestActions = ({
  t,
  userUid,
  clientUid,
  specUid,
  status,
  userRole,
  reqID,
  reqItem,

  dropdownRef,
  dropdownRefundRef,
  toggleDropdownCancelAccept,
  toggleDropdownRefund,
  showDropdownCancelAcceptClient,
  showDropdownRefund,

  walletConnected,
  showCancelModal,
  cancelMeta,
  setShowCancelModal,

  joinChatRoom,
  handleCancelClick,
  executeCancel,

  onNoviceDelete,
  onSpecialistAccept,
  onSpecialistClaimRewards,

  canCancel,
  scheduledUnixtime,
}) => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const userData = useSelector(({ user }) => user?.userData);
  const cardanoUser = useSelector(({ networkCardano }) => networkCardano.user);
  const cardanoWallet = useSelector(({ networkCardano }) => networkCardano.wallet);
  /* ──────────────────────────────
     Derived state
  ────────────────────────────── */
  const isClient = userUid === clientUid;
  const isSpecialist = userUid === specUid;
  const isAdmin = userRole === EUserRole.Admin;
  const isOpen = status === EReqStatus.Open;

  /* ──────────────────────────────
     Reward eligibility
  ────────────────────────────── */
  const [canClaimReward, setCanClaimReward] = useState(false);

  useEffect(() => {
    if (!scheduledUnixtime) return;

    const checkEligibility = () => {
      const now = spacetime.now();
      const sessionStart = spacetime(scheduledUnixtime * 1000);
      const eligibleAt = sessionStart.add(1, 'hour').add(15, 'minutes');

      setCanClaimReward(now.isAfter(eligibleAt));
    };

    checkEligibility();
    const interval = setInterval(checkEligibility, 60_000);
    return () => clearInterval(interval);
  }, [scheduledUnixtime]);

  /* ──────────────────────────────
     Specialist dropdown
  ────────────────────────────── */
  const [showPsychDropdown, setShowPsychDropdown] = useState(false);
  const psychDropdownRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');

  const buildCancelTxToBackend = async (address, studentAddress, appointment) => {
    const response = await fetch('/api/lessons/cancel/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        teacherAddress: address,
        studentAddress: studentAddress,
        requestor: "teacher",
        lessonData: appointment,
      }),
    });

    if (response.status !== 200)
      throw new Error('Failed to create lesson cancel transaction');
    const { success, txCbor } = await response.json();
    if (!success)
      throw new Error('Lesson cancel transaction was not successful');
    return txCbor;
  }

  const submitTxToBackend = async (address, tx, witnesses) => {
    const response = await fetch('/api/lessons/submit/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address,
        tx,
        witnesses
      }),
    });

    if (response.status !== 200)
      throw new Error('Failed to submit lesson transaction');
    const { success, hash } = await response.json();
    if (!success)
      throw new Error('Lesson transaction was not successful');
    return hash;
  }

  const onSpecialistCancelAccept = async () => {
    if (!cardanoWallet || !cardanoUser?.address) {
      toast.error(t.connect_your_wallet || "Please connect your wallet first");
      return;
    }

    try {
      const txCbor = await buildCancelTxToBackend(cardanoUser.address, reqItem.studentWallet, reqItem);
      const witnesses = await actions.signTx(cardanoWallet, txCbor);
      const txHash = await submitTxToBackend(cardanoUser.address, txCbor, witnesses);
      console.log("txHash: ", txHash);
      //TODO: save txhash in appointment in database

      await dispatch(deleteAcceptedReqPsych(userUid, reqID));
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

      toast.success(t.requests.cancel_session_success || "You canceled an accepted request.");
    } catch (error) {
      console.error("Error canceling accepted request:", error);
      toast.error(t.requests.cancel_session_failed || "Failed to cancel request");
    }
  };

  const togglePsychDropdown = () => {
    setShowPsychDropdown(prev => {
      if (!prev) {
        // Find the button element (parent of dropdown)
        setTimeout(() => {
          const buttonEl = psychDropdownRef.current?.parentElement?.querySelector(`.${s.etc}`) as HTMLElement;
          calculateDropdownPosition(buttonEl, setDropdownPosition, setDropdownStyles);
        }, 0);
      }
      return !prev;
    });
  };

  const handleTeacherDeclineRequest = async () => {
    if (!walletConnected) {
      toast.error(t.connect_your_wallet || "Please connect your wallet first");
      togglePsychDropdown();
      return;
    }

    try {
      await onSpecialistCancelAccept();
      togglePsychDropdown();
    } catch (error) {
      console.error("Error declining request:", error);
      toast.error(t.requests.cancel_session_failed || "Failed to decline request");
    }
  };

  /* ──────────────────────────────
     Dropdown position detection
  ────────────────────────────── */
  const [cancelAcceptPosition, setCancelAcceptPosition] = useState<'bottom' | 'top'>('bottom');
  const [refundPosition, setRefundPosition] = useState<'bottom' | 'top'>('bottom');
  const [dropdownStyles, setDropdownStyles] = useState<{ top?: number; bottom?: number; right?: number }>({});
  const [cancelAcceptStyles, setCancelAcceptStyles] = useState<{ top?: number; bottom?: number; right?: number }>({});
  const [refundStyles, setRefundStyles] = useState<{ top?: number; bottom?: number; right?: number }>({});

  const calculateDropdownPosition = (
    buttonElement: HTMLElement | null,
    setPosition: (pos: 'top' | 'bottom') => void,
    setStyles: (styles: { top?: number; bottom?: number; right?: number }) => void,
    dropdownHeight: number = 100
  ) => {
    if (!buttonElement) return;

    setTimeout(() => {
      const rect = buttonElement.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      const rightOffset = viewportWidth - rect.right;

      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        // Open upward
        setPosition('top');
        setStyles({
          bottom: viewportHeight - rect.top + 5,
          right: rightOffset + 37,
        });
      } else {
        // Open downward
        setPosition('bottom');
        setStyles({
          top: rect.bottom + 5,
          right: rightOffset + 37,
        });
      }
    }, 0);
  };

  const toggleDropdownCancelAcceptWithPosition = () => {
    const wasOpen = showDropdownCancelAcceptClient;
    toggleDropdownCancelAccept();
    if (!wasOpen) {
      setTimeout(() => {
        const buttonEl = dropdownRef.current?.querySelector(`.${s.etc}`) as HTMLElement;
        calculateDropdownPosition(buttonEl, setCancelAcceptPosition, setCancelAcceptStyles);
      }, 0);
    }
  };

  const toggleDropdownRefundWithPosition = () => {
    const wasOpen = showDropdownRefund;
    toggleDropdownRefund();
    if (!wasOpen) {
      setTimeout(() => {
        const buttonEl = dropdownRefundRef.current?.querySelector(`.${s.etc}`) as HTMLElement;
        calculateDropdownPosition(buttonEl, setRefundPosition, setRefundStyles);
      }, 0);
    }
  };

  /* ──────────────────────────────
     Check if lesson is finished
  ────────────────────────────── */
  const isFinished = status === EReqStatus.Finished || status === EReqStatus.Archived;
  const isPastScheduledTime = scheduledUnixtime && Date.now() > scheduledUnixtime * 1000;
  const canDeclineRequest = isSpecialist && !isOpen && !isFinished && !isPastScheduledTime;

  /* ──────────────────────────────
     Render
  ────────────────────────────── */
  return (
    <div className={s.col4}>
      {/* ───────── Admin ───────── */}
      {isAdmin && (
        <Button className={s.dayRowBtn} onClick={joinChatRoom}>
          {t.join_call}
        </Button>
      )}

      {/* ───────── Client (accepted / finished) ───────── */}
      {isClient && !isOpen && (
        <div className={s.reqActions} ref={dropdownRef}>
          <button
            className={s.join_chat_btn}
            onClick={joinChatRoom}
          >
            {t.enter_chat} <span>&#8599;</span>
          </button>

          <div
            className={s.etc}
            role="button"
            tabIndex={0}
            onClick={toggleDropdownCancelAcceptWithPosition}
          >
            &#8942;
          </div>

          {showDropdownCancelAcceptClient && canCancel && (
            <div
              className={`${s.dropdown} ${cancelAcceptPosition === 'top' ? s.dropdownTop : s.dropdownBottom}`}
              style={cancelAcceptStyles}
            >
              <Button
                className={`${s.cancelButton} ${s.actionBtn}`}
                onClick={handleCancelClick}
              >
                {walletConnected
                  ? t.cancel
                  : <div className={s.tooltip}>{t.connect_your_wallet}</div>
                }
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ───────── Client (open request) ───────── */}
      {isClient && isOpen && (
        <div className={s.reqActions} ref={dropdownRefundRef}>
          <div className={s.req_status_0}>
            {t.requests.awaiting_expert}
          </div>

          <div
            className={s.etc}
            role="button"
            tabIndex={0}
            onClick={toggleDropdownRefundWithPosition}
          >
            &#8942;
          </div>

          {showDropdownRefund && (
            <div
              className={`${s.dropdown} ${refundPosition === 'top' ? s.dropdownTop : s.dropdownBottom}`}
              style={refundStyles}
            >
              <Button
                className={`${s.cancelButton} ${s.actionBtn}`}
                onClick={onNoviceDelete}
              >
                {walletConnected
                  ? t.cancel
                  : <div className={s.tooltip}>{t.connect_your_wallet}</div>
                }
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ───────── Specialist (accept open request) ───────── */}
      {!isClient && isOpen && (
        <Button
          size="s"
          className={s.dayRowBtn}
          onClick={onSpecialistAccept}
        >
          {t.accept_request}
        </Button>
      )}

      {/* ───────── Specialist (claim reward) ───────── */}
      {isSpecialist && !isOpen && canClaimReward && (
        <Button
          size="s"
          className={s.dayRowBtn}
          onClick={onSpecialistClaimRewards}
        >
          💰
        </Button>
      )}

      {/* ───────── Specialist extra actions ───────── */}
      {canDeclineRequest && (
        <>
          <div
            className={s.etc}
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              togglePsychDropdown();
            }}
          >
            &#8942;
          </div>

          {showPsychDropdown && (
            <div
              className={`${s.dropdown} ${dropdownPosition === 'top' ? s.dropdownTop : s.dropdownBottom}`}
              ref={psychDropdownRef}
              style={dropdownStyles}
              onClick={(e) => e.stopPropagation()}
            >
              <Button onClick={handleTeacherDeclineRequest}>
                {t.teacher_decline_request}
              </Button>
            </div>
          )}
        </>
      )}

      {/* ───────── Cancel modal ───────── */}
      {showCancelModal && (
        <ConfirmCancelModal
          meta={cancelMeta}
          status="client"
          t={t}
          onConfirm={() => {
            executeCancel();
            setShowCancelModal(false);
          }}
          onClose={() => setShowCancelModal(false)}
        />
      )}
    </div>
  );
};
