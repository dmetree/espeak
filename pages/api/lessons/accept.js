import {  getAddressDetails } from "@lucid-evolution/lucid";
import { getValidatorsData, createAppointmentDatum, LESSON_REQUEST_REDEEMER_SCHEMA, buildRedeemerDatum } from "../../../server/validators.js"
import { getLucid, getInputUtxoByHash } from "../../../server/lucid.js";
import { getDefaults } from "../../../server/defaults.js";

// This endpoint compiles the lesson accepted transaction from the request smart contract to the lesson accepted script.
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
    const { teacherAddress, lessonData, lessonPaymentUnit = 'lovelace' } = req.body;
    if (!lessonData || !lessonData.txId || !lessonData.studentWallet)
      throw new Error("Lesson data with valid txId is required or studentWallet is required");
    console.log("Received lesson acceptance request:", teacherAddress, lessonData, lessonPaymentUnit);

    // Derive validator address from compiled Plutus script
    const { requestAddress, acceptedAddress, requestValidator } = getValidatorsData();
    console.log("Validator addresses:", requestAddress, acceptedAddress);
    // Fetch student's UTXOs and build transaction
    const lucid = await getLucid(teacherAddress);
    const inputUtxo = await getInputUtxoByHash(lucid, requestAddress, lessonData.txId);
    // Build transaction amounts
    const { lockUnit, lockAmount } = getDefaults();
    const txAmount = calculateOutputs(lockUnit, lockAmount, lessonPaymentUnit, lessonData);
    console.log("Transaction amounts:", txAmount);
    // Build accepted contract datum
    const acceptedLessonDatum = await createAppointmentDatum(
      lessonData.studentWallet,
      teacherAddress,
      lessonData,
      lockUnit,
      lockAmount,
      lessonPaymentUnit
    )
    // Build redeemer datum
    const redeemerDatum = buildRedeemerDatum({ Accept: [BigInt(0)] }, LESSON_REQUEST_REDEEMER_SCHEMA);
    if (!redeemerDatum) {
      throw new Error("Failed to build redeemer datum");
    }
    // Create transaction
    const teacherKeyHash = getAddressDetails(teacherAddress).paymentCredential.hash;
    if (!teacherKeyHash) {
      throw new Error("Unable to extract teacher key hash from address");
    }

    let tx = await lucid
      .newTx()
      .collectFrom([inputUtxo], redeemerDatum)
      .pay.ToContract(
        acceptedAddress,
        { kind: "inline", value: acceptedLessonDatum },
        txAmount
      )
      .attach.SpendingValidator(requestValidator)
      .validFrom(Date.now() - 60_000)
      .validTo(Date.now() + 10 * 60_000)
      .addSignerKey(teacherKeyHash)
      .complete();

    return res.status(200).json({
      success: true,
      txCbor: tx.toCBOR(),
    });
  } catch (err) {
    console.error("API error in /api/lessons/accept:", err);
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