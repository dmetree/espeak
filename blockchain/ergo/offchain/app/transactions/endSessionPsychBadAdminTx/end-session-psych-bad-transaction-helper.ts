import {
  Amount,
  Box,
  CollectionLike,
  ErgoAddress,
  OutputBuilder,
  TransactionBuilder,
  ErgoUnsignedInput,
  SInt,
} from "@fleet-sdk/core";

import {
  EIP12UnsignedTransaction,
  OneOrMore,
  SignedTransaction,
} from "@fleet-sdk/common";
import { ErgoHDKey, Prover } from "@fleet-sdk/wallet";
import { decode } from "@fleet-sdk/serializer";
import { hex } from "@fleet-sdk/crypto";
import { mapExplorerBox } from "../../../utils/mapping";

export class TransactionHelperEndSessionPsychBad {
  constructor(private readonly myErgo: any) {}
  public async getAddress(): Promise<ErgoAddress> {
    const rootKey = await this.myErgo.get_change_address();
    return rootKey;
  }

  public async signTransaction(
    unsignedTransaction: EIP12UnsignedTransaction
  ): Promise<SignedTransaction> {
    return await this.myErgo.sign_tx(unsignedTransaction);
  }

  public async submitTransaction(signTransaction: any) {
    const transactionId = await this.myErgo.submit_tx(signTransaction);

    return transactionId;
  }
}
