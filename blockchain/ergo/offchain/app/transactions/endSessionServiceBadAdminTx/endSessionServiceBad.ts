import { Box, EIP12UnsignedTransaction, OneOrMore } from "@fleet-sdk/common";
import { ErgoAddress, Network } from "@fleet-sdk/core";
import { ErgoToken } from "../../../models/transaction.types";
import { TransactionHelperEndSessionServiceBad } from "./end-session-service-bad-transaction-helper";
import { getRefundClientOutput } from "../../../utils/outbox-helper";
import { mapExplorerBox } from "../../../utils/mapping";
import { Session } from "@/blockchain/ergo/contracts/session";

export async function buildEndServiceBad(
  sessionBox: Box, // tx input
  nanoErgMinerFee: bigint,
  height: number,
  transactionHelper: TransactionHelperEndSessionServiceBad
): Promise<string> {
  const unsignedTransaction = new Session(mapExplorerBox(sessionBox))
    .serviceBad({
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
