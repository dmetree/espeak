import React from 'react';
import s from '../OpenPsyRequestItem.module.css';

export const RequestHeader = ({ userUid, clientUid, specUid, reqID, confirmedOnChain, t }) => {

  return (
  <div className={`${s.wrapperHeader} ${s.fullWidth}`}>
    {(userUid === clientUid || userUid === specUid) && (
      <div
        className={`${s.req_status} ${userUid === clientUid ? s.myReq : s.myWork}`}
      >
        {userUid === clientUid ? `${t.my_request}` : `${t.my_work}`}
      </div>
    )}
    <div className={s.req_id}>ID: {reqID}</div>
    <div>
      <div className={confirmedOnChain ? s.onchain_y : s.onchain_n}>
        {confirmedOnChain ? t.requests.confirmed : t.requests.pending}
      </div>
    </div>
  </div>
)};
