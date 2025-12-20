import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  actionUpdateProfile,
  fetchUserData,
} from "@/store/actions/profile/user";
import { ErgoAddress } from "@fleet-sdk/core";
import { TransactionHelperCancelAcceptClient } from "@/blockchain/ergo/offchain/app/transactions/cancelAcceptedSessionClientTx/cancel-accept-client-transaction-helper";
import { buildCancelAcceptClient } from "@/blockchain/ergo/offchain/app/transactions/cancelAcceptedSessionClientTx/cancelAcceptClient";
import { nanoErgMinerFee } from "@/components/shared/utils/ergo-blockchain-utils";
import { deleteRequest } from "@/store/actions/appointments";
import { AppDispatch } from "@/store";
import { toast } from "react-toastify";
import * as actions from "@/store/actions/networkCardano";

const CLIENT_CANCEL_PERIOD = 720; // 24h
const PSY_CANCEL_PERIOD = 60; // 2h

export const useClientCancelAccept = ({
  singletonId,
  reqID,
  t,
  reqItem,
}: {
  singletonId: string;
  reqID: string;
  t: any;
  reqItem: any;
}) => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const userUid = useSelector(({ user }) => user.uid);
  const userData = useSelector(({ user }) => user?.userData);
  const user = useSelector(({ networkCardano }) => networkCardano.user);
  const wallet = useSelector(({ networkCardano }) => networkCardano.wallet);
  const ergoCustomerWalletAddress = useSelector(
    ({ networkErgo }) => networkErgo?.ergoWalletAddress[0]
  );

  const [isLoading, setIsLoading] = useState(false);
  const [cancelMeta, setCancelMeta] = useState<null | {
    isClientCancelPenalty: boolean;
    blocksBeforeStart: number;
    sessionStartBlock: number;
    currentBlock: number;
  }>(null);

   const buildCancelTxToBackend = async (address, teacherAddress, appointment) => {
    const response = await fetch('/api/lessons/cancel/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        teacherAddress: teacherAddress,
        studentAddress: address,
        requestor: "student",
        lessonData: appointment,
      }),
    });

    if (response.status !== 200)
      throw new Error('Failed to create lesson cancel transaction');
    const { success, txCbor } = await response.json();
    if (!success)
      throw new Error('Lesson cancel transaction was not successful');
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

  const checkIfPenaltyApplies = async () => {
    const res = await fetch(
      `https://api.ergoplatform.com/api/v1/boxes/unspent/byTokenId/${singletonId}`
    );
    const data = await res.json();

    if (!data.items || data.items.length === 0) return null;

    const sessionBox = data.items[0];
    const sessionStartHeight = Number(
      sessionBox.additionalRegisters.R4?.renderedValue
    );

    const ergo = await ergoConnector.nautilus.getContext();
    const currentHeight = await ergo.get_current_height();

    const blocksBeforeStart = sessionStartHeight - currentHeight;

    const isClientCancelPenalty =
      blocksBeforeStart < CLIENT_CANCEL_PERIOD && blocksBeforeStart > 0;

    return {
      sessionBox,
      penaltyInfo: {
        isClientCancelPenalty,
        blocksBeforeStart,
        sessionStartBlock: sessionStartHeight,
        currentBlock: currentHeight,
      },
    };
  };

  const prepareCancel = async (): Promise<boolean> => {
    try {
      const result = await checkIfPenaltyApplies();
      if (!result) return false;

      setCancelMeta(result.penaltyInfo);
      return true;
    } catch (err) {
      console.error("Penalty check failed", err);
      toast.error(t.requests.cancel_penalty_check_failed);
      return false;
    }
  };

  const executeCancel = async () => {
    if (!cancelMeta) return;
    setIsLoading(true);

    try {
      
      const txCbor = await buildCancelTxToBackend(user.address, reqItem.teacherWallet, reqItem);
      const witnesses = await actions.signTx(wallet, txCbor);
      const txHash = await submitTxToBackend(user.address, txCbor, witnesses);
      console.log("txHash: ", txHash);
      
      const result = await checkIfPenaltyApplies();
      if (!result) return;
      const { sessionBox } = result;

      const ergo = await ergoConnector.nautilus.getContext();
      const nodeHeight = await ergo.get_current_height();
      const transactionHelper = new TransactionHelperCancelAcceptClient(ergo);
      const customerAddress = ErgoAddress.fromBase58(ergoCustomerWalletAddress);

      await buildCancelAcceptClient(
        sessionBox,
        customerAddress,
        nanoErgMinerFee,
        nodeHeight,
        transactionHelper
      );

      await dispatch(deleteRequest(userUid, reqID));

      //// pushing notifications and getting it back====
      const payload = {
        title: t.notificaiton_client_cancel_accept,
        message: t.text_client_cancel_accept,
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

      toast.success(t.requests.cancel_session_success);
    } catch (error) {
      console.error("Cancel error:", error);
      toast.error(t.requests.cancel_session_failed);
    } finally {
      setIsLoading(false);
      setCancelMeta(null);
    }
  };

  return {
    prepareCancel, // Call this before showing modal
    executeCancel, // Call this only after user confirms
    isLoading,
    cancelMeta, // Show info in modal (e.g. penalty)
  };
};
