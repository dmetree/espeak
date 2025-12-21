import { useCallback } from "react";
import { toast } from "react-toastify";
import * as actions from "@/store/actions/networkCardano";
import { useDispatch, useSelector } from "react-redux";
import {
  actionUpdateProfile,
  fetchUserData,
} from "@/store/actions/profile/user";
import {
  incrementHrPsy,
  incrementHrInPsy,
  psychDeleteRequestClaimRewards,
  fetchMyAppointments,
} from "@/store/actions/appointments";
import { AppDispatch } from "@/store";

export const useSpecialistClaimRewards = ({
  userData,
  reqItem,
  clientUid,
  t,
}) => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const userUid = useSelector(({ user }) => user.uid);
  const user = useSelector(({ networkCardano }) => networkCardano.user);
  const wallet = useSelector(({ networkCardano }) => networkCardano.wallet);

  const buildTxToBackend = async (address, appointment) => {
    const response = await fetch('/api/lessons/withdraw/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        teacherAddress: address,
        lessonData: appointment,
      }),
    });

    if (response.status !== 200)
      throw new Error('Failed to create lesson withdraw transaction');
    const { success, txCbor } = await response.json();
    if (!success)
      throw new Error('Lesson withdraw transaction was not successful');
    return txCbor;
  }

  const submitTxToBackend = async (address, tx, witnesses) => {
    const response = await fetch('/api/lessons/submit/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address,
        tx,
        witnesses
      }),
    });

    if (response.status !== 200)
      throw new Error('Failed to create lesson request transaction');
    const { success, hash } = await response.json();
    if (!success)
      throw new Error('Lesson request transaction was not successful');
    return hash;
  }

  const onSpecialistClaimRewards = useCallback(async () => {
    try {
      const txCbor = await buildTxToBackend(user.address, reqItem);
      const witnesses = await actions.signTx(wallet, txCbor);
      const txHash = await submitTxToBackend(user.address, txCbor, witnesses);
      console.log("txHash: ", txHash);
      //TODO: save txhash in appointment in database

      //// pushing notifications and getting it back====
      const payload = {
        title: t.notification_spec_claim_rewards,
        message: t.text_spec_claim_rewards,
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

      dispatch(incrementHrPsy(userUid));
      dispatch(incrementHrInPsy(clientUid));
      dispatch(psychDeleteRequestClaimRewards(userUid, reqItem.id));
      dispatch(fetchMyAppointments(userUid));
      toast.success(t.requests.claim_rewards);
    } catch (error) {
      console.error("Error claiming rewards:", error);
      toast.error(t.requests.failed_claim_rewards);
    }
  }, [user.address, wallet, reqItem, userData, userUid, clientUid, t, dispatch]);

  return { onSpecialistClaimRewards };
};
