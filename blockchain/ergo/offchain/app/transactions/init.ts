import { Box, EIP12UnsignedTransaction, OneOrMore } from "@fleet-sdk/common";
import { ErgoToken } from "../../models/transaction.types";
import { getInitializeSessionOutput } from "../../utils/outbox-helper";
import { ErgoAddress, Network } from "@fleet-sdk/core";
import { TransactionHelper } from "../../utils/transaction-helper";
import { Session } from "@/blockchain/ergo/contracts/session";
import { DEFAULT_CONTRACT_PARAMS } from "../../../contracts/session";

export async function buildCreateSession(
  inputs: OneOrMore<Box>,
  paymentToken: ErgoToken, // sigusd or ergo
  transactionExecutor: ErgoAddress,
  contract: ErgoAddress, //contract address = compiled address
  clientAddress: ErgoAddress,
  psychologistAddress: ErgoAddress,
  sessionStartHeight: number,
  nanoErgSessionValue: bigint, // TODO: Verify what amount this can be
  nanoErgMinerFee: bigint,
  height: number,
  transactionHelper: TransactionHelper,
  price: number,
  partnerOneAddress?: ErgoAddress,
  partnerTwoAddress?: ErgoAddress
): Promise<{ singletonId: any; txId: any }> {
  const tokenToMint = {
    decimals: 0,
    amount: "1",
  };

  console.log("P1 in init: ", partnerOneAddress);

  const output = getInitializeSessionOutput(
    contract,
    clientAddress,
    psychologistAddress,
    nanoErgSessionValue,
    tokenToMint,
    sessionStartHeight,
    price,
    paymentToken,
    height,
    partnerOneAddress,
    partnerTwoAddress
  );

  const unsignedTransaction = Session.create(
    {
      price: BigInt(price),
      client: clientAddress,
      startHeight: sessionStartHeight,
      height: height,
      inputs: await ergo.get_utxos(),
      fee: nanoErgMinerFee, // optional
      partnerOne: partnerOneAddress, // optional
      partnerTwo: partnerTwoAddress, // optional
    },
    {
      address: DEFAULT_CONTRACT_PARAMS.address,
      tokens: {
        payment: DEFAULT_CONTRACT_PARAMS.tokens.payment,
        registration: DEFAULT_CONTRACT_PARAMS.tokens.registration,
      },
      admin: DEFAULT_CONTRACT_PARAMS.admin,
      workshop: DEFAULT_CONTRACT_PARAMS.workshop,
    }
  ).toEIP12Object();

  function findSingletonId(unsignedTransaction) {
    for (const output of unsignedTransaction.outputs) {
      if (output.assets && output.assets.length > 0) {
        return output.assets[0].tokenId;
      }
    }
    return null;
  }

  const singletonId = findSingletonId(unsignedTransaction);

  const signedTransaction = await transactionHelper.signTransaction(
    unsignedTransaction
  );

  const txId = await transactionHelper.submitTransaction(signedTransaction);

  return { singletonId, txId };
}
