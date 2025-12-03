// --- useOpenPsyRequestItemLogic.ts ---
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { showModal } from "@/store/actions/modal";
import { setRequestRoomId } from "@/store/actions/appointments";
import {
  EModalKind,
  EUserRole,
  EReqStatus,
} from "@/components/shared/types/types";
import { loadMessages } from "@/components/shared/i18n/translationLoader";
import { ExpToPrice } from "@/components/shared/assets/expToPriceDictionary/ExpToPriceDictionary";
import { useSpecialistAccept } from "@/components/features/DisplayPsyRequests/hooks/useSpecialistAccept";
import { useNoviceDelete } from "@/components/features/DisplayPsyRequests/hooks/useNoviceDelete";
import { useClientCancelAccept } from "@/components/features/DisplayPsyRequests/hooks/useClientCancelAccept";
import { useSpecialistClaimRewards } from "@/components/features/DisplayPsyRequests/hooks/useSpecialistClaimRewards";
import spacetime from "spacetime";

export const useOpenPsyRequestItemLogic = (props) => {
  const {
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
    partnerOne, //
    partnerTwo, //
  } = props;

  const dispatch: AppDispatch = useDispatch();
  const userUid = useSelector(({ user }) => user.uid);
  const userData = useSelector(({ user }) => user?.userData);
  const userRole = useSelector(({ user }) => user?.userData.userRole);
  const draftAppointment = useSelector(
    ({ appointments }) => appointments.draftAppointment
  );
  const therapistWalletAddress = useSelector(
    ({ networkErgo }) => networkErgo?.ergoWalletAddress[0]
  );
  const ergoWalletConnected = useSelector(
    ({ networkErgo }) => networkErgo.ergoWalletConnected
  );

  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);

  const [freeTimestamps, setFreeTimestamps] = useState([]);
  const [isDateTimeLoaded, setIsDateTimeLoaded] = useState(false);
  const [isTimeZoneLoaded, setIsTimeZoneLoaded] = useState(false);
  const [reqDate, setReqDate] = useState(null);
  const [reqTime, setReqTime] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDropdownCancelAcceptClient, setShowDropdownCancelAcceptClient] =
    useState(false);
  const [showDropdownRefund, setShowDropdownRefund] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownRefundRef = useRef(null);
  const [canCancel, setCanCancel] = useState(true);

  useEffect(() => {
    const checkTimeConditions = () => {
      const now = spacetime.now();
      const sessionStart = spacetime(scheduledUnixtime * 1000);

      setCanCancel(now.isBefore(sessionStart.subtract(1, "hour"))); // Можно отменить только раньше, чем за 1 час
    };

    checkTimeConditions();
    const interval = setInterval(checkTimeConditions, 60 * 1000); // обновлять каждую минуту
    return () => clearInterval(interval);
  }, [scheduledUnixtime]);

  const toggleDropdownCancelAccept = () =>
    setShowDropdownCancelAcceptClient((prev) => !prev);
  const toggleDropdownRefund = () => setShowDropdownRefund((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdownCancelAcceptClient(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutsideRefund = (event) => {
      if (
        dropdownRefundRef.current &&
        !dropdownRefundRef.current.contains(event.target)
      ) {
        setShowDropdownRefund(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideRefund);
    return () =>
      document.removeEventListener("mousedown", handleClickOutsideRefund);
  }, []);

  useEffect(() => {
    const loadDateTime = async () => {
      try {
        const st = spacetime(scheduledUnixtime * 1000);
        setReqDate(st.format("{date-ordinal} {month-short} {year}"));
        setReqTime(st.format("time-24"));
      } catch (error) {
        console.error("Error loading date and time:", error);
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
    reqID: reqID,
    singletonId,
    price,
    scheduledUnixtime,
    therapistWalletAddress,
    freeTimestamps,
    setFreeTimestamps,
    t,
  });
  const { onNoviceDelete } = useNoviceDelete({
    reqID,
    singletonId,
    draftAppointment,
  });

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

  return {
    isTimeZoneLoaded,
    isDateTimeLoaded,
    reqDate,
    reqTime,
    t,
    userUid,
    clientUid,
    specUid,
    reqID,
    subject,
    psyRank,
    price,
    status,
    userRole,
    confirmedOnChain,
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
    partnerOne, //
    partnerTwo, //
  };
};
