import { getAddressDetails } from "@lucid-evolution/lucid";
import { getValidatorsData, createAppointmentDatum } from "../../../server/validators.js"
import { getLucid } from "../../../server/lucid.js";
import { getDefaults } from "../../../server/defaults.js";

// This endpoint compiles the lesson request transaction from the student to the lesson request script.
// It builds the datum containing lesson details and the payment to be sent to the script address.
// It returns the unsigned transaction CBOR to the frontend for signing.
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight request");
    return res.status(204).end();
  }
  if (req.method !== "POST") {
    console.log("Invalid request method:", req.method);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userAddress, lessonData, specialistData, lessonPaymentUnit = 'lovelace' } = req.body;
    if (!userAddress || !lessonData || !specialistData)
        return res.status(400).json({ error: "User address, lesson data, and specialist data are required." });
    if ( !specialistData.walletAddress )
        return res.status(400).json({ error: "Specialist wallet address is required." });

    // Get request validator address
    const { requestAddress, requestValidator } = getValidatorsData();
    console.log("Request script address:", requestAddress, requestValidator.script);
    // Define lock data
    const { lockUnit, lockAmount } = getDefaults();
    // Build lesson request datum
    const datum = await createAppointmentDatum(
      userAddress,
      specialistData.walletAddress,
      lessonData,
      lockUnit,
      lockAmount,
      lessonPaymentUnit
    );
    // Calculate transaction amounts
    const txAmount = calculateOutputs(lockUnit, lockAmount, lessonPaymentUnit, lessonData);
    // Build the transaction to be sent to the script address
    const studentKeyHash = getAddressDetails(userAddress).paymentCredential.hash;
    if (!studentKeyHash) {
      throw new Error("Unable to extract student key hash from address");
    }
      
    const lucid = await getLucid(userAddress);
    let tx = await lucid
      .newTx()
      .pay.ToContract(
        requestAddress,
        { kind: "inline", value: datum },
        txAmount
      )
      .addSignerKey(studentKeyHash)
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

const calculateOutputs = (lockUnit, lockAmount, lessonPaymentUnit, lessonData) => {
  const lessonPrice = BigInt(Math.round((lessonData.price / 100) * 1_000_000));

  const txAmount = {};
  txAmount[lockUnit] = (txAmount[lockUnit] || BigInt(0)) + BigInt(lockAmount);
  txAmount[lessonPaymentUnit] = (txAmount[lessonPaymentUnit] || BigInt(0)) + lessonPrice;
  return txAmount;
}