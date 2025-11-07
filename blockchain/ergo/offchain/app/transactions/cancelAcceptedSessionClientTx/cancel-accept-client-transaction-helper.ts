// @ts-nocheck
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

export class TransactionHelperCancelAcceptClient {
  constructor(readonly myErgo: any) {}
  public async getAddress(): Promise<ErgoAddress> {
    const rootKey = await this.myErgo.get_change_address();
    return rootKey;
  }

  public async buildTransaction(
    sessionInput: Box,
    blockHeight: number,
    inputs: Box[],
    outputs: OneOrMore<OutputBuilder>,
    nanoErgMinerFee: bigint = BigInt(100000),
    changeAddress?: string,
    walletIndex = 0,
    ensureInclusion = false,
    isBurned?: boolean,
    burnedToken?: any
  ): Promise<EIP12UnsignedTransaction> {
    if (!blockHeight) {
      throw new Error("issue getting block height");
    }

    try {
      const mappedInput: Box = {
        ...sessionInput,
        additionalRegisters: {
          R4: sessionInput.additionalRegisters.R4?.serializedValue,
          R5: sessionInput.additionalRegisters.R5?.serializedValue,
          R6: sessionInput.additionalRegisters.R6?.serializedValue,
          R7: sessionInput.additionalRegisters.R7?.serializedValue,
          R8: sessionInput.additionalRegisters.R8?.serializedValue,
          R9: sessionInput.additionalRegisters.R9?.serializedValue,
        },
      };
      const input = new ErgoUnsignedInput(mappedInput);
      input.setContextExtension({ "0": SInt(4) });

      // const changeErgoTree = ErgoAddress.fromBase58(changeAddress).ergoTree;
      const clientPk = hex.encode(
        decode<[Uint8Array, Uint8Array]>(
          sessionInput.additionalRegisters.R5?.serializedValue
        ).data[0]
      );

      let txBuilder = new TransactionBuilder(blockHeight)
        .from(input, { ensureInclusion: true })
        .from(
          inputs.filter((input) =>
            input.ergoTree.endsWith(clientPk)
          ) /** P2PK ErgoTree is 0008cd + publicKey, so this check is safe */,
          { ensureInclusion: true }
        )
        .to(outputs)
        .sendChangeTo(
          changeAddress ? changeAddress : await this.myErgo.get_change_address()
        )
        .payFee(nanoErgMinerFee);

      if (isBurned && burnedToken) {
        txBuilder = txBuilder.burnTokens({
          tokenId: burnedToken.tokenId,
          amount: burnedToken.amount,
        });
      }

      const builtTx = txBuilder.build();
      console.log("Transaction built successfully");

      return builtTx.toEIP12Object();
    } catch (error) {
      console.error("Transaction build error:", error);
      throw error;
    }
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
