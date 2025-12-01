import {
  Lucid,
  Blockfrost,
  validatorToAddress,
  Data,
} from "@lucid-evolution/lucid";

const getUserLucid = async (address) => {
  const apiKey = process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY || "";
  const apiUrl = process.env.NEXT_PUBLIC_BLOCKFROST_URL || "";
  const lucid = await Lucid(
    new Blockfrost(apiUrl, apiKey),
    process.env.NEXT_PUBLIC_BLOCKFROST_NETWORK
  );
  const utxos = await lucid.utxosAt(address);
  lucid.selectWallet.fromAddress(address, utxos);
  return lucid;
};

function buildTransactionDatum(data) {
  try {
    return Data.to(
      data,
      Data.Object({
        student: Data.Bytes(),
        teacher: Data.Bytes(),
        admin: Data.Bytes(),
        lessonStartTime: Data.Integer(),
        lessonDuration: Data.Integer(),
        deltaAfterLesson: Data.Integer(),
        lessonLockTokenPolicyId: Data.Bytes(),
        lessonLockTokenAssetName: Data.Bytes(),
        lessonLockAmount: Data.Integer(),
        lessonPriceTokenPolicyId: Data.Bytes(),
        lessonPriceTokenAssetName: Data.Bytes(),
        lessonPriceAmount: Data.Integer(),
      })
    );
  } catch (error) {
    console.error("Error building datum:", error);
    return null;
  }
}

export default async function handler(req, res) {
  // Basic CORS headers so that http://localhost:3000 can call https://localhost:3000 in dev
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userAddress, lessonData } = req.body;

    const script = {
      type: "PlutusV3",
      script: process.env.PLUTUS_LESSON_REQUEST_COMPILED_CODE?.trim(),
    };

    const validatorAddress = validatorToAddress(
      process.env.NEXT_PUBLIC_BLOCKFROST_NETWORK,
      script
    );
    const datum = buildTransactionDatum(lessonData);

    if (!datum) {
      throw new Error("Failed to build datum");
    }

    const lucid = await getUserLucid(userAddress);

    let tx = await lucid
      .newTx()
      .pay.ToContract(
        validatorAddress,
        { kind: "inline", value: datum },
        amounts
      )
      .addSigner(userAddress)
      .complete();

    return res.status(200).json({
      success: true,
      txCbor: tx.toCBOR(),
    });
  } catch (err) {
    console.error("API error in /api/lessons/request:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server error",
    });
  }
}
