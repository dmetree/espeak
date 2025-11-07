import {
    Amount,
    Box,
    CollectionLike,
    ErgoAddress,
    OutputBuilder,
    TransactionBuilder,
  } from '@fleet-sdk/core';

  import {
    EIP12UnsignedTransaction,
    OneOrMore,
    SignedTransaction,
  } from '@fleet-sdk/common';
  import { ErgoHDKey, Prover } from '@fleet-sdk/wallet';

  export class TransactionHelper {
    constructor(
      private readonly myErgo: any,
    ) {}
    public async getAddress(): Promise<ErgoAddress> {
      const rootKey = await this.myErgo.get_change_address();
      return rootKey;
    }

    public async buildTransaction(
      blockHeight: number,
      inputs: OneOrMore<Box<Amount>> | CollectionLike<Box<Amount>>,
      outputs: OneOrMore<OutputBuilder>,
      nanoErgMinerFee: bigint = BigInt(100000),
      changeAddress?: string,
      walletIndex = 0,
      ensureInclusion = false,
    ): Promise<EIP12UnsignedTransaction> {
      if (!blockHeight) {
        throw new Error('issue getting block height');
      }

      try {
        let txBuilder = new TransactionBuilder(blockHeight)
        .from(inputs)
        .to(outputs)
        .sendChangeTo(
          changeAddress ? changeAddress : await this.myErgo.get_change_address(),
        )
        .payFee(nanoErgMinerFee)


        return txBuilder
          .build()
          .toEIP12Object();

      } catch (error) {
        console.error('Transaction build error:', error);
        throw error;
      }

    }

    public async signTransaction(
      unsignedTransaction: EIP12UnsignedTransaction,
    ): Promise<SignedTransaction> {
      return await this.myErgo.sign_tx(unsignedTransaction);
    }

    public async submitTransaction (signTransaction: any) {
      const transactionId = await this.myErgo.submit_tx(signTransaction);

      return transactionId;
    }
  }
