import { Box, EIP12UnsignedTransaction } from "@fleet-sdk/common";
import { ErgoAddress } from "@fleet-sdk/core";
import { ErgoToken } from "../../../models/transaction.types";
import { TransactionHelperAccept } from "./accept-transaction-helper";
import { mapExplorerBox } from "../../../utils/mapping";
import { Session } from "@/blockchain/ergo/contracts/session";

export async function buildAcceptRequest(
  sessionBox: Box,
  therapistAddress: ErgoAddress,
  registrationBox: Box,
  checkEnoughAmount,
  sessionSingletonId,
  paymentToken: ErgoToken, // sigusd or ergo
  nanoErgMinerFee: bigint,
  height: number,
  transactionHelper: TransactionHelperAccept
): Promise<EIP12UnsignedTransaction> {
  // const validateAcceptRequestState = validateAcceptRequest();

  const unsignedTransaction = new Session(mapExplorerBox(sessionBox))
    .accept({
      therapist: therapistAddress,
      height: height,
      inputs: await ergo.get_utxos(),
      fee: nanoErgMinerFee,
    })
    .toEIP12Object();

  const signedTransaction = await transactionHelper.signTransaction(
    unsignedTransaction
  );

  const submitResponse = await transactionHelper.submitTransaction(
    signedTransaction
  );

  console.log(JSON.stringify(submitResponse, null, 2), "submitResponse");

  return submitResponse;
}
