import {
  Lucid,
  Blockfrost
} from "@lucid-evolution/lucid";

// This endpoint submits the signed lesson request transaction to the Cardano blockchain.
// It receives the signed transaction CBOR from the frontend and submits it via Blockfrost.
// It returns the transaction hash to the frontend.

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

export default async function handler(req, res) {
  // Basic CORS headers so that http://localhost:3000 can call https://localhost:3000 in dev
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight request");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    console.log("Invalid request method:", req.method);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { address, tx, witnesses } = req.body;
    if (!tx || !witnesses)
        return res.status(400).json({ error: "Unsigned transaction and witness set are required." });

    // Load and submit the signed transaction
    const lucid = await getUserLucid(address);
    const txBuilder = lucid.fromTx(tx);
    const signedTx = await txBuilder.assemble([witnesses]).complete();
    const txHash = await signedTx.submit();
    console.log("Transaction submitted with hash:", txHash);

    return res.status(200).json({
      success: true,
      hash: txHash,
    });
  } catch (err) {
    console.error("API error in /api/lessons/request:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server error",
    });
  }
}
