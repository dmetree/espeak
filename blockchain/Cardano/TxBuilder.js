import { Lucid, Emulator } from "@lucid-evolution/lucid";
import * as FluidLib from "@/components/lib";

const getLucid = async (provider) =>
  await Lucid(provider, process.env.NEXT_PUBLIC_BLOCKFROST_NETWORK);

//Client lucid instance using wallet API
const getLucidByWalletApi = async (wallet) => {
  const walletInstance = await FluidLib.Cardano.Wallet.connect(wallet);
  const lucid = await getLucid(new Emulator([]));
  lucid.selectWallet.fromAPI(walletInstance);
  return lucid;
};

const lockTxToContract = async (wallet, validatorAddress, datum, amounts) => {
  try {
    const lucid = await getLucidByWalletApi(wallet);
    const senderAddress = await lucid.wallet().address();
    let tx = await lucid
      .newTx()
      .pay.ToContract(
        validatorAddress,
        { kind: "inline", value: datum },
        amounts
      )
      .addSigner(senderAddress)
      .complete();
    return tx.toCBOR();
  } catch (error) {
    console.error("Error building transaction:", error);
  }
};

const signAndSubmitTransaction = async (wallet, txCbor) => {
  try {
    const lucid = await getLucidByWalletApi(wallet);
    const tx = await lucid.fromTx(txCbor).sign.withWallet().complete();
    return tx.toCBOR();
  } catch (error) {
    console.error("Error submitting transaction:", error);
  }
};

export { lockTxToContract, signAndSubmitTransaction };

// export const spendTxFromContract = async (wallet, inputs, datum, recipientAddress, amounts, plutusScript) => {
//     try {
//         const lucid = await getLucidByWalletApi(wallet);
//         let tx = await lucid
//             .newTx()
//             .collectFrom(inputs, datum)
//             .pay.ToAddress(recipientAddress, amounts)
//             .attach.SpendingValidator(plutusScript)
//             .complete();
//         return tx.toCBOR();
//     } catch (error) {
//         console.error("Error building transaction:", error);
//     }
// }

// export const submitSignedTransaction = async (signedTx) => {
//     try {
//         const lucid = await getLucidBySeed();
//         const tx = await lucid.fromTx(signedTx)
//             .sign.withWallet()
//             .complete();
//         return await tx.submit();
//     } catch (error) {
//         console.error("Error submitting transaction:", error);
//     }
// };
