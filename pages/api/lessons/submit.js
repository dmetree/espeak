import {
  Lucid,
  Blockfrost
} from "@lucid-evolution/lucid";

const getLucid = async () => {
  const apiKey = process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY || "";
  const apiUrl = process.env.NEXT_PUBLIC_BLOCKFROST_URL || "";
  const lucid = await Lucid(
    new Blockfrost(apiUrl, apiKey),
    process.env.NEXT_PUBLIC_BLOCKFROST_NETWORK
  );
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
    const { tx, witnesses } = req.body;
    if (!tx || !witnesses)
        return res.status(400).json({ error: "Unsigned transaction and witness set are required." });
    console.log("Request body:", req.body);

    const lucid = await getLucid();
    const txBuilder = lucid.fromTx(tx);
    const signedTx = await txBuilder.assemble(witnesses).complete();
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
