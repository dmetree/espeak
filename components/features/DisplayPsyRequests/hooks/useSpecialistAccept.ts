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
    const response = await fetch(
      `https://api.ergoplatform.com/api/v1/boxes/unspent/byTokenId/${singletonId}`
    );
    const data = await response.json();
    console.log("data: ", data);

    if (!data.items?.length) return;

    const sessionBox = data.items[0];
    setSessionBox(sessionBox);

    const ergo = await ergoConnector.nautilus.getContext();
    const nodeHeight = await ergo.get_current_height();
    const transactionHelper = new TransactionHelperAccept(ergo);

    const therapistAddress = ErgoAddress.fromBase58(therapistWalletAddress);
    const therapistTokenIdPass =
      "f151f5c1aab0d47a82083d210346fb0cf919335a31308e1448ac0bff33eb2209";
    const collateral = (price / 10).toString();

    const checkTherapistTokenIdPass = await ergo.get_utxos({
      tokens: [
        {
          tokenId: therapistTokenIdPass,
        },
      ],
    });

    const registrationBoxToken = checkTherapistTokenIdPass.find((box) =>
      box?.assets?.some(
        (asset) =>
          asset?.tokenId === therapistTokenIdPass && asset.amount >= "1"
      )
    );

    if (!registrationBoxToken) {
      return toast.error(t.requests.not_a_psychologist);
    }

    const registrationBox = checkTherapistTokenIdPass[0];

    let checkEnoughAmount = await ergo.get_utxos({
      tokens: [
        {
          tokenId:
            "03faf2cb329f2e90d6d23b58d91bbb6c046aa143261cc21f52fbe2824bfcbf04",
          amount: collateral,
        },
      ],
    });

    if (!checkEnoughAmount?.length) {
      return toast.error(t.requests.not_enough_funds);
    }

    const index = checkEnoughAmount.findIndex(
      (item) => item === registrationBox
    );

    if (index !== -1) {
      checkEnoughAmount = [
        ...checkEnoughAmount.slice(0, index),
        ...checkEnoughAmount.slice(index + 1),
      ];
    }

    const paymentToken = {
      tokenId:
        "03faf2cb329f2e90d6d23b58d91bbb6c046aa143261cc21f52fbe2824bfcbf04",
      amount: BigInt(price),
    };

    // console.log("paymentToken", paymentToken);

    await buildAcceptRequest(
      sessionBox,
      therapistAddress,
      registrationBox,
      checkEnoughAmount,
      singletonId,
      paymentToken,
      nanoErgMinerFee,
      nodeHeight,
      transactionHelper
    );

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
