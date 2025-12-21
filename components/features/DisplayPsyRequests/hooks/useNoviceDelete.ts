import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  actionUpdateProfile,
  fetchUserData,
} from "@/store/actions/profile/user";
import { deleteRequest } from "@/store/actions/appointments";
import { loadMessages } from "@/components/shared/i18n/translationLoader";
import { AppDispatch } from "@/store";
import * as actions from "@/store/actions/networkCardano";

export const useNoviceDelete = ({ reqID, reqItem }) => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const userUid = useSelector(({ user }) => user.uid);
  const userData = useSelector(({ user }) => user?.userData);
  const user = useSelector(({ networkCardano }) => networkCardano.user);
  const wallet = useSelector(({ networkCardano }) => networkCardano.wallet);
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);

   const buildRefundTxToBackend = async (address, appointment) => {
    const response = await fetch('/api/lessons/refund/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        studentAddress: address,
        lessonData: appointment
      }),
    });

    if (response.status !== 200)
      throw new Error('Failed to create lesson refund transaction');
    const { success, txCbor } = await response.json();
    if (!success)
      throw new Error('Lesson refund transaction was not successful');
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

  const onNoviceDelete = async () => {
    try {

      console.log("Initiating refund transaction for novice delete...", reqItem);
      const txCbor = await buildRefundTxToBackend(user.address, reqItem);
      const witnesses = await actions.signTx(wallet, txCbor);
      const txHash = await submitTxToBackend(user.address, txCbor, witnesses);
      console.log("Refund transaction submitted with hash:", txHash);

      const payload = {
        title: t.noviceDelete,
        message: t.text_noviceDelete,
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

      dispatch(deleteRequest(userUid, reqID));
      toast.success(t.tx_refunded);
      await dispatch(fetchUserData(userUid));
    } catch (error) {
      toast.success(t.requests.failed_delete);
      console.error("Failed to delete novice request:", error);
    }
  };

  return { onNoviceDelete };
};
