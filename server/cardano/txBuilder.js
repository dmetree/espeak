// server/cardano/txBuilder.js
import { Lucid, Emulator } from "@lucid-evolution/lucid";
import * as FluidLib from "@/components/lib";

async function getLucid(provider) {
  return await Lucid(provider, process.env.NEXT_PUBLIC_BLOCKFROST_NETWORK);
}

// Create Lucid instance using Wallet API
async function getLucidByWalletApi(wallet) {
  try {
    const walletInstance = await FluidLib.Cardano.Wallet.connect(wallet);
    const lucid = await getLucid(new Emulator([]));

    lucid.selectWallet.fromAPI(walletInstance);
    return lucid;
  } catch (err) {
    console.error("Error initializing Lucid:", err);
    throw new Error("Failed to initialize Lucid with wallet");
  }
}

// Lock tx to contract
export async function lockTxToContract(
  wallet,
  validatorAddress,
  datum,
  amounts
) {
  try {
    const lucid = await getLucidByWalletApi(wallet);
    const senderAddress = await lucid.wallet().address();

    const tx = await lucid
      .newTx()
      .pay.ToContract(
        validatorAddress,
        { kind: "inline", value: datum },
        amounts
      )
      .addSigner(senderAddress)
      .complete();

    return tx.toCBOR();
  } catch (err) {
    console.error("Error building transaction:", err);
    throw new Error("Failed to build lock transaction");
  }
}

// Sign + return signed tx CBOR
export async function signAndSubmitTransaction(wallet, txCbor) {
  try {
    const lucid = await getLucidByWalletApi(wallet);

    const tx = await lucid.fromTx(txCbor).sign.withWallet().complete();
    return tx.toCBOR();
  } catch (err) {
    console.error("Error submitting transaction:", err);
    throw new Error("Failed to sign transaction");
  }
}

/*
OPTIONAL EXTRA ENDPOINTS — preserved from your original code:

export async function spendTxFromContract(wallet, inputs, datum, recipientAddress, amounts, plutusScript) {
  try {
    const lucid = await getLucidByWalletApi(wallet);
    const tx = await lucid
      .newTx()
      .collectFrom(inputs, datum)
      .pay.ToAddress(recipientAddress, amounts)
      .attach.SpendingValidator(plutusScript)
      .complete();

    return tx.toCBOR();
  } catch (err) {
    console.error("Error building spend tx:", err);
    throw new Error("Failed to build spend transaction");
  }
}
*/
