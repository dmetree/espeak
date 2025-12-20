import {  getAddressDetails } from "@lucid-evolution/lucid";
import { getValidatorsData, buildRedeemerDatum, LESSON_ACCEPTED_REDEEMER_SCHEMA } from "../../../server/validators.js"
import { getLucid, getInputUtxoByHash } from "../../../server/lucid.js"
import { getDefaults } from "../../../server/defaults.js";

// This endpoint handles lesson withdrawal requests from teachers.
// It constructs and submits a transaction that unlocks funds from the lesson accepted script UTXO.
// It requires the teacher's address and lesson data including the accepted transaction hash.
// It returns the transaction hash to the frontend.
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
    if (!lessonData.acceptationTxId)
      throw new Error("Accepted transaction hash is required in lesson data");

    // Derive validator address from compiled Plutus script
    const { acceptedAddress, acceptedValidator } = getValidatorsData();
    console.log("Validator address:", acceptedAddress);
    // Fetch teacher's UTXOs and build transaction
    const lucid = await getLucid(teacherAddress);
    const inputUtxo = await getInputUtxoByHash(lucid, acceptedAddress, lessonData.acceptationTxId);
    // Build transaction amounts
    const { lockUnit, lockAmount, adminAddress } = getDefaults();
    const outputs = calculateOutputs(lockUnit, lockAmount, lessonPaymentUnit, lessonData);
    // Build redeemer datum
    const redeemerDatum = buildRedeemerDatum({ TeacherWithdraw: { currentAcceptedLessonInputIndex: BigInt(0) }}, LESSON_ACCEPTED_REDEEMER_SCHEMA);
    if (!redeemerDatum) {
      throw new Error("Failed to build redeemer datum");
    }
    // Calculate transaction validity range
    const { validFrom, validTo } = getValidityRange();
    // Create transaction
    const teacherKeyHash = getAddressDetails(teacherAddress).paymentCredential.hash;
    if (!teacherKeyHash) {
      throw new Error("Unable to extract student key hash from address");
    }

    let tx = lucid
      .newTx()
      .collectFrom([inputUtxo], redeemerDatum);

    if (outputs.admin && Object.keys(outputs.admin).length > 0) 
      tx = tx.pay.ToAddress(adminAddress, outputs.admin);
    if (outputs.teacher && Object.keys(outputs.teacher).length > 0)
      tx = tx.pay.ToAddress(teacherAddress, outputs.teacher);

    tx = await tx
      .attach.SpendingValidator(acceptedValidator)
      .validFrom(validFrom)
      .validTo(validTo)
      .addSignerKey(teacherKeyHash)
      .complete();

    return res.status(200).json({
      success: true,
      txCbor: tx.toCBOR(),
    });
  } catch (err) {
    console.error("API error in /api/lessons/withdraw:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server error",
    });
  }
}

const calculateOutputs = (lockUnit, lockAmount, lessonPaymentUnit, lessonData) => {
  const lessonPrice = BigInt(Math.round((lessonData.price / 100) * 1_000_000));

  const admin = {};
  const teacher = {};
  admin[lockUnit] = (admin[lockUnit] || BigInt(0)) + BigInt(lockAmount);
  teacher[lessonPaymentUnit] = (teacher[lessonPaymentUnit] || BigInt(0)) + lessonPrice;
  console.log("Computed confirmation outputs:", admin, teacher);

  return { admin, teacher };
}

const getValidityRange = () => {
  const now = Date.now();
  return {
    validFrom: now - 60_000,        // 1 min in the past (safer)
    validTo:   now + 30 * 60_000,   // 30 min window
  };
}