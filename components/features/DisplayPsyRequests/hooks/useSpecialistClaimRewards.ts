import { useCallback } from "react";
import { ErgoAddress } from "@fleet-sdk/core";
import { toast } from "react-toastify";

import { TransactionHelperEndSessionPsych } from "@/blockchain/ergo/offchain/app/transactions/endSessionPsychTx/end-session-psych-transaction-helper";
import { buildPsychEndNoProblem } from "@/blockchain/ergo/offchain/app/transactions/endSessionPsychTx/endSessionPsych";
import { nanoErgMinerFee } from "@/components/shared/utils/ergo-blockchain-utils";

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
  singletonId,
  therapistWalletAddress,
  userData,
  reqID,
  clientUid,
  t,
}) => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const userUid = useSelector(({ user }) => user.uid);
  const onSpecialistClaimRewards = useCallback(async () => {
    try {
      const response = await fetch(
        `https://api.ergoplatform.com/api/v1/boxes/unspent/byTokenId/${singletonId}`
      );
      const data = await response.json();

      console.log("data: ", data);

      if (!data.items || data.items.length === 0) {
        toast.error(t.requests.not_found_box);
        return;
      }

      const sessionBox = data.items[0];
      const ergo = await ergoConnector.nautilus.getContext();
      const nodeHeight = await ergo.get_current_height();
      const transactionHelper = new TransactionHelperEndSessionPsych(ergo);

      const therapistAddress = ErgoAddress.fromBase58(therapistWalletAddress);

      await buildPsychEndNoProblem(
        sessionBox,
        therapistAddress,
        nanoErgMinerFee,
        nodeHeight,
        transactionHelper
      );

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
      dispatch(psychDeleteRequestClaimRewards(userUid, reqID));
      dispatch(fetchMyAppointments(userUid));
      toast.success(t.requests.claim_rewards);
    } catch (error) {
      console.error("Error claiming rewards:", error);
      toast.error(t.requests.failed_claim_rewards);
    }
  }, [singletonId, therapistWalletAddress, userData]);

  return { onSpecialistClaimRewards };
};
