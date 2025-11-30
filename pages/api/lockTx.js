import {
  lockTxToContract,
  signAndSubmitTransaction,
} from "@/server/cardano/txBuilder";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { wallet, validatorAddress, datum, amounts } = req.body;

    // 1) Build tx
    const unsignedTxCbor = await lockTxToContract(
      wallet,
      validatorAddress,
      datum,
      amounts
    );

    // 2) Sign tx on the server
    const signedTxCbor = await signAndSubmitTransaction(wallet, unsignedTxCbor);

    return res.status(200).json({
      success: true,
      signedTxCbor,
    });
  } catch (err) {
    console.error("API error in /api/lockTx:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server error",
    });
  }
}
