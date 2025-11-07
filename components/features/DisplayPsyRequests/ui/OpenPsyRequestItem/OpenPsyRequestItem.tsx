import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import { showModal } from '@/store/actions/modal';
import { setRequestRoomId } from '@/store/actions/appointments';
import { EModalKind } from '@/components/shared/types';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import { useSpecialistAccept } from '@/components/features/DisplayPsyRequests/hooks/useSpecialistAccept';
import { useNoviceDelete } from '@/components/features/DisplayPsyRequests/hooks/useNoviceDelete';
import { useClientCancelAccept } from '@/components/features/DisplayPsyRequests/hooks/useClientCancelAccept';
import { useSpecialistClaimRewards } from '@/components/features/DisplayPsyRequests/hooks/useSpecialistClaimRewards';
import spacetime from 'spacetime';

import { RequestHeader } from './components/RequestHeader';
import { RequestDateTime } from './components/RequestDateTime';
import { RequestPrice } from './components/RequestPrice';
import { RequestActions } from './components/RequestActions';
import { useClickOutside } from '@/hooks/useClickOutside';
import { getLocalizedContent } from '@/hooks/localize';
import s from './OpenPsyRequestItem.module.css';

const OpenPsyRequestItem = (props) => {
  const {
    reqItem,
    reqID,
    clientUid,
    specUid,
    subject,
    scheduledUnixtime,
    psyRank,
    price,
    status,
    singletonId,
    confirmedOnChain,
    partnerOne,
    partnerTwo,
  } = props;

  const dispatch: AppDispatch = useDispatch();
  const userUid = useSelector(({ user }) => user.uid);
  const userData = useSelector(({ user }) => user?.userData);
  const userRole = useSelector(({ user }) => user?.userData.userRole);
  const draftAppointment = useSelector(({ appointments }) => appointments.draftAppointment);
  const therapistWalletAddress = useSelector(({ networkErgo }) => networkErgo?.ergoWalletAddress[0]);
  const ergoWalletConnected = useSelector(({ networkErgo }) => networkErgo.ergoWalletConnected);
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);

  const [freeTimestamps, setFreeTimestamps] = useState([]);
  const [isDateTimeLoaded, setIsDateTimeLoaded] = useState(false);
  const [isTimeZoneLoaded, setIsTimeZoneLoaded] = useState(false);
  const [reqDate, setReqDate] = useState(null);
  const [reqTime, setReqTime] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDropdownCancelAcceptClient, setShowDropdownCancelAcceptClient] = useState(false);
  const [showDropdownRefund, setShowDropdownRefund] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownRefundRef = useRef<HTMLDivElement>(null);
  const [canCancel, setCanCancel] = useState(true);

  useEffect(() => {
    const checkTimeConditions = () => {
      const now = spacetime.now();
      const sessionStart = spacetime(scheduledUnixtime * 1000);
      setCanCancel(now.isBefore(sessionStart.subtract(1, 'hour')));
    };
    checkTimeConditions();
    const interval = setInterval(checkTimeConditions, 60 * 1000);
    return () => clearInterval(interval);
  }, [scheduledUnixtime]);

  const toggleDropdownCancelAccept = () => setShowDropdownCancelAcceptClient((prev) => !prev);
  const toggleDropdownRefund = () => setShowDropdownRefund((prev) => !prev);

  useClickOutside(dropdownRef, () => {
    setShowDropdownCancelAcceptClient(false);
  });

  useClickOutside(dropdownRefundRef, () => {
    setShowDropdownRefund(false);
  });

  useEffect(() => {
    const loadDateTime = async () => {
      try {
        const st = spacetime(scheduledUnixtime * 1000);
        setReqDate(st.format('{date-ordinal} {month-short} {year}'));
        setReqTime(st.format('time-24'));
      } catch (error) {
        console.error('Error loading date and time:', error);
      } finally {
        setIsDateTimeLoaded(true);
      }
    };
    loadDateTime();
    setIsTimeZoneLoaded(true);
  }, [scheduledUnixtime]);

  useEffect(() => {
    if (userData?.freeTimestamps) {
      setFreeTimestamps(userData?.freeTimestamps);
    }
  }, [userData?.freeTimestamps]);

  const joinChatRoom = () => {
    dispatch(showModal(EModalKind.VideoCall));
    dispatch(setRequestRoomId(reqID));
  };

  const { onSpecialistAccept } = useSpecialistAccept({
    reqID,
    singletonId,
    price,
    scheduledUnixtime,
    therapistWalletAddress,
    freeTimestamps,
    setFreeTimestamps,
    t,
  });

  const { onNoviceDelete } = useNoviceDelete({ reqID, singletonId, draftAppointment });

  const { onSpecialistClaimRewards } = useSpecialistClaimRewards({
    singletonId,
    therapistWalletAddress,
    userData,
    reqID,
    clientUid,
    t,
  });

  const handleCancelClick = async () => {
    const ready = await prepareCancel();
    if (ready) setShowCancelModal(true);
  };

  const {
    prepareCancel,
    executeCancel,
    isLoading: cancelLoading,
    cancelMeta,
  } = useClientCancelAccept({ singletonId, reqID, t });

  return (
    <div className={s.wrapper}>
      <RequestHeader {...{ userUid, clientUid, specUid, reqID, confirmedOnChain, t }} />
      <div className={`${s.reqField} ${s.reqSubject} ${s.col1}`}>
        {reqItem?.type === "direct"
          ? getLocalizedContent(reqItem?.selectedService?.title, currentLocale)
          : t[subject]
        }
        </div>
      <RequestDateTime {...{ isTimeZoneLoaded, isDateTimeLoaded, reqDate, reqTime, t }} />
      <RequestPrice {...{ psyRank, price, t }} />
      <RequestActions
        {...{
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
          ergoWalletConnected,
          showCancelModal,
          setShowCancelModal,
          cancelMeta,
          joinChatRoom,
          handleCancelClick,
          executeCancel,
          onNoviceDelete,
          onSpecialistAccept,
          onSpecialistClaimRewards,
          canCancel,
          scheduledUnixtime,
        }}
      />
    </div>
  );
};

export default OpenPsyRequestItem;
