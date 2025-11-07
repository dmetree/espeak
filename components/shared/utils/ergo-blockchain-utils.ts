import { TransactionHelper } from "@/blockchain/ergo/offchain/utils/transaction-helper";
import { Network } from "@fleet-sdk/core";

export const nodeNetwork = Network.Mainnet;
export const nanoErgSessionValue = BigInt(1_100_000);
export const nanoErgMinerFee = BigInt(1_100_000);

export const p2pkInputAmount = nanoErgSessionValue + nanoErgMinerFee;
