import React, { useEffect, useState } from 'react';
import Button from '@/components/shared/ui/Button';
import { ConfirmCancelModal } from '@/components/shared/ui/ConfirmCancelModal/ConfirmCancelModal';
import { EReqStatus, EUserRole } from '@/components/shared/types/types';
import s from '../OpenPsyRequestItem.module.css';
import spacetime from 'spacetime';

export const RequestActions = ({
  t, userUid, clientUid, specUid, status, userRole,
  dropdownRef, dropdownRefundRef,
  toggleDropdownCancelAccept, toggleDropdownRefund,
  showDropdownCancelAcceptClient, showDropdownRefund,
  ergoWalletConnected,
  showCancelModal, cancelMeta, setShowCancelModal,
  joinChatRoom, handleCancelClick, executeCancel,
  onNoviceDelete, onSpecialistAccept, onSpecialistClaimRewards,
  canCancel, scheduledUnixtime,
}) => {
  const [canClaimReward, setCanClaimReward] = useState(false);

  useEffect(() => {
    const checkClaimEligibility = () => {
      const now = spacetime.now();
      const sessionStart = spacetime(scheduledUnixtime * 1000);
      const sessionEndWithBuffer = sessionStart.add(1, 'hour').add(15, 'minutes');
      setCanClaimReward(now.isAfter(sessionEndWithBuffer));
    };

    checkClaimEligibility();
    const interval = setInterval(checkClaimEligibility, 60 * 1000);
    return () => clearInterval(interval);
  }, [scheduledUnixtime]);

  return (
    <div className={`${s.col4}`}>
      {userRole === EUserRole.Admin && (
        <Button className={s.dayRowBtn} onClick={joinChatRoom}>
          {t.join_call}
        </Button>
      )}

      {userUid === clientUid && status !== EReqStatus.Open && (
        <div className={s.reqActions} ref={dropdownRef}>
          <button
            className={` ${s.join_chat_btn}`}
            onClick={joinChatRoom}
          >
            {t.enter_chat} <span>&#8599;</span>
          </button>
          <div className={s.etc} onClick={toggleDropdownCancelAccept} role="button" tabIndex={0}>
            &#8942;
          </div>
          {showDropdownCancelAcceptClient && canCancel && (
            <div className={s.dropdown}>
              <Button
                className={`${s.cancelButton} ${s.actionBtn}`}
                onClick={handleCancelClick}
              >
                {ergoWalletConnected ? t.cancel : <div className={s.tooltip}>{t.connect_your_wallet}</div>}
              </Button>
            </div>
          )}
        </div>
      )}

      {userUid === clientUid && status === EReqStatus.Open && (
        <div className={s.reqActions} ref={dropdownRefundRef}>
          <div className={s.req_status_0}>{t.requests.awaiting_expert}</div>
          <div className={s.etc} onClick={toggleDropdownRefund} role="button" tabIndex={0}>
            &#8942;
          </div>
          {showDropdownRefund && (
            <div className={s.dropdown}>
              <Button
                onClick={onNoviceDelete}
                className={`${s.cancelButton} ${s.actionBtn} ${!canCancel ? 'disabled' : ''}`}
              >
                {!ergoWalletConnected ? <div className={s.tooltip}>{t.connect_your_wallet}</div> : t.cancel}
              </Button>
            </div>
          )}
        </div>
      )}

      {userUid !== clientUid && status === EReqStatus.Open && (
        <Button size="s" className={s.dayRowBtn} onClick={onSpecialistAccept}>
          {t.accept_request}
        </Button>
      )}

      {userUid === specUid && status !== EReqStatus.Open && canClaimReward && (
        <Button
          size="s"
          onClick={onSpecialistClaimRewards}
          className={s.dayRowBtn}
          disabled={!canClaimReward}
        >
          💰
        </Button>
      )}

      {(userUid === specUid || userUid === clientUid) && status !== EReqStatus.Open && !canClaimReward && (
        <Button
          size="s"
          onClick={joinChatRoom}
          className={s.dayRowBtn}
        >&#128682;</Button>
      )}

      {showCancelModal && cancelMeta && (
        <ConfirmCancelModal
          meta={cancelMeta}
          onConfirm={() => {
            executeCancel();
            setShowCancelModal(false);
          }}
          onClose={() => setShowCancelModal(false)}
          t={t}
          status="client"
        />
      )}
    </div>
  )
};
