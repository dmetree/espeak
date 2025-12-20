import {  getAddressDetails } from "@lucid-evolution/lucid";
import { getValidatorsData, LESSON_REQUEST_REDEEMER_SCHEMA, buildRedeemerDatum } from "../../../server/validators.js"
import { getLucid, getInputUtxoByHash } from "../../../server/lucid.js";
import { getDefaults } from "../../../server/defaults.js";

// This endpoint builds a refund transaction for a lesson request on the Cardano blockchain.
// It receives the teacher's address, student's address, and lesson data from the frontend.
// It constructs a transaction that refunds the lesson payment back to the student.
// It returns the unsigned transaction CBOR to the frontend.
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
    const { studentAddress, lessonData, lessonPaymentUnit = 'lovelace' } = req.body;
    if (!studentAddress || lessonData === undefined)
      throw new Error("Both studentAddress and lessonData are required");

    // Derive validator address from compiled Plutus script
    const { requestAddress, requestValidator } = getValidatorsData();
    console.log("Validator address:", requestAddress);
    // Fetch student's UTXOs and build transaction
    const lucid = await getLucid(studentAddress);
    const inputUtxo = await getInputUtxoByHash(lucid, requestAddress, lessonData.txId);
    // Build transaction amounts
    const { lockUnit, lockAmount } = getDefaults();
    const txAmount = calculateOutputs(lockUnit, lockAmount, lessonPaymentUnit, lessonData);
    // Build redeemer datum
    const redeemerDatum = buildRedeemerDatum({ Refund: [] }, LESSON_REQUEST_REDEEMER_SCHEMA);
    if (!redeemerDatum) {
      throw new Error("Failed to build redeemer datum");
    }
    // Create transaction
    const signerKeyHash = getAddressDetails(studentAddress)?.paymentCredential?.hash;
    if (!signerKeyHash) {
      throw new Error("Failed to extract teacher address hash");
    }
    let tx = await lucid
      .newTx()
      .collectFrom([inputUtxo], redeemerDatum)
      .pay.ToAddress(studentAddress, txAmount)
      .attach.SpendingValidator(requestValidator)
      .addSignerKey(signerKeyHash)
      .complete();

    return res.status(200).json({
      success: true,
      txCbor: tx.toCBOR(),
    });
  } catch (err) {
    console.error("API error in /api/lessons/refund:", err);
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