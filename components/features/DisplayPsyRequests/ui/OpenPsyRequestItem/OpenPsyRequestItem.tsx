import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import { showModal } from '@/store/actions/modal';
import { setRequestRoomId } from '@/store/actions/appointments';

import { loadMessages } from '@/components/shared/i18n/translationLoader';
import { useSpecialistAccept } from '@/components/features/DisplayPsyRequests/hooks/useSpecialistAccept';
import { useNoviceDelete } from '@/components/features/DisplayPsyRequests/hooks/useNoviceDelete';
import { useClientCancelAccept } from '@/components/features/DisplayPsyRequests/hooks/useClientCancelAccept';
import { useSpecialistClaimRewards } from '@/components/features/DisplayPsyRequests/hooks/useSpecialistClaimRewards';
import { deleteAcceptedReqPsych, fetchMyAppointments } from "@/store/actions/appointments";
import {
  actionUpdateProfile,
  fetchUserData,
} from "@/store/actions/profile/user";
import spacetime from 'spacetime';
import { EModalKind } from '@/components/shared/types/types';
import { toast } from "react-toastify";
import * as actions from "@/store/actions/networkCardano";

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
    scheduledUnixtime,
    price,
    status,
    singletonId,
  } = props;

  const dispatch: AppDispatch = useDispatch();
  const userUid = useSelector(({ user }) => user.uid);
  const userData = useSelector(({ user }) => user?.userData);
  const userRole = useSelector(({ user }) => user?.userData.userRole);
  const therapistWalletAddress = useSelector(({ user }) => user?.userData.walletAddress);
  const cardanoUser = useSelector(({ networkCardano }) => networkCardano.user);
  const cardanoWallet = useSelector(({ networkCardano }) => networkCardano.wallet);
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
        setReqDate(st.format('{date-ordinal} {month-short}'));
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
    reqItem,
    scheduledUnixtime,
    freeTimestamps,
    setFreeTimestamps,
    t,
  });

  const { onNoviceDelete } = useNoviceDelete({ reqID, reqItem });

  const { onSpecialistClaimRewards } = useSpecialistClaimRewards({
    userData,
    reqItem,
    clientUid,
    t,
  });

  const handleCancelClick = async () => {
    const ready = await prepareCancel();
    if (ready)
      setShowCancelModal(true);
  };

  const {
    prepareCancel,
    executeCancel,
    cancelMeta,
  } = useClientCancelAccept({ singletonId, reqID, t, reqItem });

  return (
    <div className={s.wrapper}>
      <div className={`${s.reqField} ${s.reqSubject} ${s.col1}`}>
        {reqItem?.type === "direct"
          ? getLocalizedContent(reqItem?.selectedService?.title, currentLocale)
          : reqItem?.subject
        }
      </div>
      <RequestDateTime {...{ isTimeZoneLoaded, isDateTimeLoaded, reqDate, reqTime, t }} />
      <RequestPrice {...{ price }} />
      <RequestActions
        {...{
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
          walletConnected: !!(cardanoUser?.address || cardanoWallet),
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
