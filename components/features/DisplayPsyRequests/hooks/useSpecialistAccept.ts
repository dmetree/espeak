import { useState } from "react";
import { AppDispatch } from "@/store";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  actionUpdateProfile,
  fetchUserData,
  saveSlots,
} from "@/store/actions/profile/user";
import { acceptRequest, fetchMyAppointments } from "@/store/actions/appointments";
import * as actions from "@/store/actions/networkCardano";

export const useSpecialistAccept = ({
  reqID,
  reqItem,
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
  const user = useSelector(({ networkCardano }) => networkCardano.user);
  const wallet = useSelector(({ networkCardano }) => networkCardano.wallet);

  const [sessionBox, setSessionBox] = useState();

  const buildAcceptTxToBackend = async (address, appointment) => {
    const response = await fetch("/api/lessons/accept/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teacherAddress: address,
        lessonData: appointment,
      }),
    });

    console.log(response);

    if (response.status !== 200)
      throw new Error("Failed to create lesson accept transaction");
    const { success, txCbor } = await response.json();
    if (!success)
      throw new Error("Lesson accept transaction was not successful");
    return txCbor;
  };

  const submitTxToBackend = async (address, tx, witnesses) => {
    const response = await fetch("/api/lessons/submit/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address,
        tx,
        witnesses,
      }),
    });

    if (response.status !== 200)
      throw new Error("Failed to create lesson request transaction");
    const { success, hash } = await response.json();
    if (!success)
      throw new Error("Lesson request transaction was not successful");
    return hash;
  };

  const onSpecialistAccept = async () => {
    try {
      if (!user || !wallet) {
        toast.error(t?.connect_wallet_first ?? "Please, connect wallet first");
        return;
      }

      const txCbor = await buildAcceptTxToBackend(user.address, reqItem);
      const witnesses = await actions.signTx(wallet, txCbor);
      const txHash = await submitTxToBackend(user.address, txCbor, witnesses);

      await dispatch(
        acceptRequest(
          userUid,
          reqID,
          userData.nickname,
          userData.avatar,
          userData.psyRank,
          txHash
        )
      );
      await dispatch(fetchMyAppointments(userUid));

      const now = Math.floor(Date.now() / 1000);
      const updatedTimestamps = freeTimestamps.filter(
        (timestamp) => timestamp > now && timestamp !== scheduledUnixtime
      );
      setFreeTimestamps(updatedTimestamps);
      dispatch(saveSlots(userUid, updatedTimestamps));

      //// pushing notifications and getting it back====
      const payload = {
        title: t.notification_accept_request,
        message: t.text_accept_request,
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

      toast.success("You accepted a personal request.");
    } catch (error) {
      console.error("Failed to accept request:", error);
      toast.error(
        t?.requests?.failed_accept ?? "Failed to accept therapy request"
      );
    }
  };

  return { onSpecialistAccept, sessionBox };
};
