import { Box, EIP12UnsignedTransaction, OneOrMore } from "@fleet-sdk/common";
import { ErgoAddress, Network } from "@fleet-sdk/core";
import { validateRefundClient } from "./validateRefundClient";
import { ErgoToken } from "../../../models/transaction.types";
import { getRefundClientOutput } from "../../../utils/outbox-helper";
import { mapExplorerBox } from "../../../utils/mapping";
import { Session } from "@/blockchain/ergo/contracts/session";
import { TransactionHelper } from "@/blockchain/ergo/offchain/utils/transaction-helper";
import { TransactionHelperRefund } from "@/blockchain/ergo/offchain/app/transactions/refundClientTx/refund-transaction-helper";

export async function buildRefundClient(
  inputs: Box[], // users
  sessionBox: Box, // tx input
  sessionTokenId: string,
  paymentToken: ErgoToken, // sigusd or ergo
  transactionExecutor: ErgoAddress,
  clientAddress: ErgoAddress,
  nanoErgMinerFee: bigint,
  height: number,
  // transactionHelper: TransactionHelper,
  transactionHelper: TransactionHelperRefund,

): Promise<string> {

  const refundOutput = getRefundClientOutput(
    clientAddress,
    sessionBox.value,
    paymentToken
  );

  const userAddress = await ergo.get_change_address();

  const validateRefundClientState = validateRefundClient(
    sessionBox,
    userAddress,
    refundOutput
  );

  //TODO:  add notification if we can't return the money to the client
  // if (!validateRefundClientState) {
  //   console.log(`Client doesn't match the session`);
  // } else {
    const unsignedTransaction = new Session(mapExplorerBox(sessionBox))
      .cancel({
        client: clientAddress,
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
// }
