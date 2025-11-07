import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';

import s from './PsyRequestList.module.css';

import OpenPsyRequestItem from '../OpenPsyRequestItem/OpenPsyRequestItem';

export const RequestList = ({ requests }) => {

  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);

  // Sort requests by scheduledUnixtime in ascending order (from now to the future)
  const sortedRequests = [...requests].sort((a, b) => a.scheduledUnixtime - b.scheduledUnixtime);

  return (
    <div className={s.reqList}>
      {sortedRequests.length === 0 ? (
        <p>{t.no_requests}</p>
      ) : (
        sortedRequests.map((reqItem) => (
          <OpenPsyRequestItem
            reqItem={reqItem}
            key={reqItem.id}
            reqID={reqItem.id}
            subject={reqItem.subject}
            scheduledUnixtime={reqItem.scheduledUnixtime}
            psyRank={reqItem.psyRank}
            price={reqItem.price}
            // gender={reqItem.gender}
            clientUid={reqItem.clientUid}
            specUid={reqItem.specUid}
            status={reqItem.status}
            singletonId={reqItem.singletonId}
            txId={reqItem.txId}
            complaintFromClient={reqItem.complaintFromClient}
            confirmedOnChain={reqItem.confirmedOnChain}
            partnerOne={reqItem.partnerOne}
            partnerTwo={reqItem.partnerTwo}
          />
        ))
      )}
    </div>
  );
};
