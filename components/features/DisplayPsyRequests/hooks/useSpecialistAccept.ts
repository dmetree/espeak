import { useState } from "react";
import { AppDispatch } from "@/store";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  actionUpdateProfile,
  fetchUserData,
} from "@/store/actions/profile/user";
import { ErgoAddress } from "@fleet-sdk/core";
import { TransactionHelperAccept } from "@/blockchain/ergo/offchain/app/transactions/acceptRequestTx/accept-transaction-helper";
import { buildAcceptRequest } from "@/blockchain/ergo/offchain/app/transactions/acceptRequestTx/acceptRequest";
import { nanoErgMinerFee } from "@/components/shared/utils/ergo-blockchain-utils";
import { acceptRequest } from "@/store/actions/appointments";
import { saveSlots } from "@/store/actions/profile/user";

export const useSpecialistAccept = ({
  reqID,
  singletonId,
  price,
  scheduledUnixtime,
  therapistWalletAddress,
  freeTimestamps,
  setFreeTimestamps,
  t,
}) => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const userUid = useSelector(({ user }) => user?.uid);
  const userData = useSelector(({ user }) => user?.userData);

  const [sessionBox, setSessionBox] = useState();

  const onSpecialistAccept = async () => {
    dispatch(
      acceptRequest(
        userUid,
        reqID,
        userData.nickname,
        userData.avatar,
        userData.psyRank
      )
    );

    const now = Math.floor(Date.now() / 1000);
    const updatedTimestamps = freeTimestamps.filter(
      (timestamp) => timestamp > now && timestamp !== scheduledUnixtime
    );
    setFreeTimestamps(updatedTimestamps);
    dispatch(saveSlots(userUid, updatedTimestamps));

    //// pushing notifications and getting it back====
    const payload = {
      title: t.notification_spec_accept,
      message: t.text_spec_accept,
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

    toast.success(t.requests.accepted_therapy_request);
  };

  return { onSpecialistAccept, sessionBox };
};
