import {  getAddressDetails } from "@lucid-evolution/lucid";
import { createAppointmentDatum, getValidatorsData, LESSON_ACCEPTED_REDEEMER_SCHEMA, buildRedeemerDatum } from "../../../server/validators.js"
import { getLucid, getInputUtxoByHash } from "../../../server/lucid.js";
import { getDefaults } from "../../../server/defaults.js";

// This endpoint builds a complaint transaction for an accepted lesson on the Cardano blockchain.
// It receives the student's address, lesson data, and complaint type from the frontend.
// It constructs a transaction that files a complaint against the lesson acceptance.
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
    const { strudentAddress, lessonData, complaintType, lessonPaymentUnit = 'lovelace' } = req.body;
    if (!lessonData.acceptationTxId)
      throw new Error("Accepted transaction hash is required in lesson data");
    if (!strudentAddress || !complaintType)
      throw new Error("Address and complaint type are required");

    // Derive validator address from compiled Plutus script
    const { acceptedAddress, acceptedValidator, complaintAddress } = getValidatorsData();
    console.log("Validator address:", acceptedAddress, acceptedValidator);
    // Fetch student's UTXOs and build transaction
    const lucid = await getLucid(strudentAddress);
    const inputUtxo = await getInputUtxoByHash(lucid, acceptedAddress, lessonData.acceptationTxId);
    // Build transaction amounts
    const { lockUnit, lockAmount } = getDefaults();
    const txAmount = calculateOutputs(lockUnit, lockAmount, lessonPaymentUnit, lessonData);
    // Build redeemer datum
    const redeemerDatum = buildRedeemerDatum({ Complaint: { complaintOutputIndex: BigInt(0), complaintType: BigInt(complaintType) } }, LESSON_ACCEPTED_REDEEMER_SCHEMA);
    if (!redeemerDatum) {
      throw new Error("Failed to build redeemer datum");
    }
    // Build accepted contract datum
    const complainLessonDatum = await createAppointmentDatum(
      strudentAddress,
      lessonData.teacherWallet,
      lessonData,
      lockUnit,
      lockAmount,
      lessonPaymentUnit
    );
    // Calculate transaction validity range
    const { lower, upper } = getValidityRange(lessonData, windowType);
    console.log(`Setting transaction validity range: lower=${lower}, upper=${upper}`);
    // Create transaction
    const signingKeyHash = getAddressDetails(strudentAddress).paymentCredential.hash;
    if (!signingKeyHash) {
      throw new Error("Unable to extract signing key hash from address");
    }
    
    let tx = lucid
      .newTx()
      .collectFrom([inputUtxo], redeemerDatum)
      .pay.ToContract(
        complaintAddress,
        { kind: "inline", value: complainLessonDatum },
        txAmount
      )
      .attach.SpendingValidator(acceptedValidator)
      .validFrom(lower)
      .validTo(upper)
      .addSignerKey(signingKeyHash)
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
  const txAmount = {};
  txAmount[lockUnit] = (txAmount[lockUnit] || BigInt(0)) + BigInt(lockAmount);
  txAmount[lessonPaymentUnit] = (txAmount[lessonPaymentUnit] || BigInt(0)) + BigInt(Math.round((lessonData.price / 100) * 1_000_000));
  console.log("Transaction amounts:", txAmount);
  return txAmount;
}

function getValidityRange(_lessonData, windowType) {
  const now = Date.now();
  const lower = now - 2 * 60_000;

  const ttlMs =
    windowType === "24h" ? 60 * 60_000 :  // 60 min
    windowType === "12h" ? 45 * 60_000 :  // 45 min
    windowType === "4h"  ? 30 * 60_000 :  // 30 min
                          20 * 60_000;    // "<4h"

  return { lower, upper: now + ttlMs };
}