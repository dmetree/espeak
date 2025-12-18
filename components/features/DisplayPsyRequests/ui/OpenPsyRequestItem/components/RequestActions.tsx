import { useEffect, useRef, useState } from 'react';
import spacetime from 'spacetime';

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

  const togglePsychDropdown = () =>
    setShowPsychDropdown(prev => !prev);

  const handleTeacherDeclineRequest = () => {
    console.log('Teacher declined the request');
    togglePsychDropdown();
  };

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
            onClick={toggleDropdownCancelAccept}
          >
            &#8942;
          </div>

          {showDropdownCancelAcceptClient && canCancel && (
            <div className={s.dropdown}>
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
            onClick={toggleDropdownRefund}
          >
            &#8942;
          </div>

          {showDropdownRefund && (
            <div className={s.dropdown}>
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

      {/* ───────── Shared: enter chat ───────── */}
      {(isClient || isSpecialist) && !isOpen && !canClaimReward && (
        <Button
          size="s"
          className={s.dayRowBtn}
          onClick={joinChatRoom}
        >
          &#128682;
        </Button>
      )}

      {/* ───────── Specialist extra actions ───────── */}
      {isSpecialist && !isOpen && (
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
              className={s.dropdown}
              ref={psychDropdownRef}
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
      {showCancelModal && cancelMeta && (
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
