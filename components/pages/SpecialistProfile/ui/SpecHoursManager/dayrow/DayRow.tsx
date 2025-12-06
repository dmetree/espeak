import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteRequest, cancelAccept, setRequestRoomId } from "@/store/actions/appointments";
import { showModal, hideModal, toggleModal } from '@/store/actions/modal';
import { toast } from "react-toastify";
import { loadMessages } from '@/components/shared/i18n/translationLoader';

import { EScheduleMark, EReqStatus, EModalKind } from '@/components/shared/types/types';
import Button from '@/components/shared/ui/Button';
import { AppDispatch } from "@/store";

import s from './DayRow.module.css';

const DayRow = ({ hour, handleClick, mark, psyRequest, bgColor, request, isPastHour }) => {

  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const userUid = useSelector(({ user }) => user.uid);

  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);

  const isClickable = mark === EScheduleMark.OPEN_FOR_WORK ? true : null;
  const classNames = `${s.dayRow}
    ${mark === EScheduleMark.OPEN_FOR_WORK ? s.openForWork : s.busy}
    ${psyRequest ? s.psyRequest : null}
    ${hour < 9 ? s.smallHour : null}
    ${isPastHour ? s.isPastHour : null}
    `;


  const joinChatRoom = () => {
    dispatch(showModal(EModalKind.VideoCall)); // TODO: add modal
    dispatch(setRequestRoomId(request.id)); // TODO: import method
  };

  const onNoviceDelete = () => {
    dispatch(deleteRequest(userUid, request.id));
    toast.error("You canceled a request.");
  };

  const onSpecialistCancelAccept = () => {
    dispatch(cancelAccept(userUid, request.id));
    toast.error("You canceled an accepted request.");
  };

  return (
    <div
      key={hour}
      onClick={isClickable ? handleClick : () => null} // Disable onClick if psyRequest is not null
      className={classNames}
      style={{
        backgroundColor: bgColor,
      }}
    >
      <span>{hour}:00</span>

      {psyRequest ? (
        <div className={s.dayRowWrapper}>
          <span className={s.subject}>{t[psyRequest?.subject]}</span>

          {userUid === request.clientUid && request.status !== EReqStatus.Open && (
            <Button
              className={s.dayRowBtn}
              onClick={joinChatRoom}
            >Y</Button>
          )}
          {userUid === request.clientUid && request.status === EReqStatus.Open && (
            <Button

              className={s.dayRowBtnCancel}
              onClick={onNoviceDelete}
            >X</Button>
          )}

          {userUid === request.specUid && request.status !== EReqStatus.Open && (
            <span className={s.actionBtns}>
              <Button

                className={s.dayRowBtnCancel}
                onClick={onSpecialistCancelAccept}
              >X</Button>
              <Button
                className={s.dayRowBtn}
                onClick={joinChatRoom}
              >Y</Button>
              {/* <div>&#8942;</div> */}
            </span>
          )}
        </div>
      ) : (
        mark === EScheduleMark.OPEN_FOR_WORK && (
          <span className={s.openText}>{t.book_free_hour}</span>
        )
      )}
    </div>
  );
};

export default DayRow;
