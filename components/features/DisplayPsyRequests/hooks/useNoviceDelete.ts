import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ErgoAddress } from "@fleet-sdk/core";
import { ErgoToken } from "@/blockchain/ergo/offchain/models/transaction.types";
import { buildRefundClient } from "@/blockchain/ergo/offchain/app/transactions/refundClientTx/refundClient";
import {
  actionUpdateProfile,
  fetchUserData,
} from "@/store/actions/profile/user";
import { TransactionHelper } from "@/blockchain/ergo/offchain/utils/transaction-helper";
import { deleteRequest } from "@/store/actions/appointments";
import {
  nodeNetwork,
  nanoErgMinerFee,
} from "@/components/shared/utils/ergo-blockchain-utils";
import { loadMessages } from "@/components/shared/i18n/translationLoader";
import { TransactionHelperRefund } from "@/blockchain/ergo/offchain/app/transactions/refundClientTx/refund-transaction-helper";
import { AppDispatch } from "@/store";

export const useNoviceDelete = ({ reqID, singletonId, draftAppointment }) => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const userUid = useSelector(({ user }) => user.uid);
  const userData = useSelector(({ user }) => user?.userData);
  const ergoCustomerWalletAddress = useSelector(
    ({ networkErgo }) => networkErgo?.ergoWalletAddress[0]
  );
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);

  const onNoviceDelete = async () => {
    try {
      const response = await fetch(
        `https://api.ergoplatform.com/api/v1/boxes/unspent/byTokenId/${singletonId}`
      );
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const sessionBox = data.items[0];
        const ergo = await ergoConnector.nautilus.getContext();
        const nodeHeight = await ergo.get_current_height();
        const transactionHelper = new TransactionHelperRefund(ergo);

        const address = ergoCustomerWalletAddress.toString(nodeNetwork);

        const paymentToken: ErgoToken = {
          tokenId:
            "03faf2cb329f2e90d6d23b58d91bbb6c046aa143261cc21f52fbe2824bfcbf04",
          amount: BigInt(draftAppointment.price),
        };

        const customerAddress = ErgoAddress.fromBase58(
          ergoCustomerWalletAddress
        );
        const userInputs = await ergo.get_utxos();

        await buildRefundClient(
          userInputs,
          sessionBox,
          singletonId,
          paymentToken,
          customerAddress,
          customerAddress,
          nanoErgMinerFee,
          nodeHeight,
          transactionHelper
        );

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
      } else {
        console.log("No session box found with this singleton ID");
      }
    } catch (error) {
      toast.success(t.requests.failed_delete);
      console.error("Failed to delete novice request:", error);
    }
  };

  return { onNoviceDelete };
};
