import {  getAddressDetails } from "@lucid-evolution/lucid";
import { getValidatorsData, buildRedeemerDatum, LESSON_ACCEPTED_REDEEMER_SCHEMA } from "../../../server/validators.js"
import { getLucid, getInputUtxoByHash } from "../../../server/lucid.js"
import { getDefaults } from "../../../server/defaults.js";

// This endpoint allows a student or teacher to cancel a lesson.
// It builds a transaction that spends the lesson UTXO from the script address
// back to the respective user's address, applying the cancellation policy.
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
    const { studentAddress, teacherAddress, requestor, lessonData, lessonPaymentUnit = 'lovelace' } = req.body;
    if (!lessonData.acceptationTxId)
      throw new Error("Accepted transaction hash is required in lesson data");
    if (!requestor || (requestor !== 'student' && requestor !== 'teacher'))
      throw new Error("Requestor must be either 'student' or 'teacher'");

    // Derive validator address from compiled Plutus script
    const { acceptedAddress, acceptedValidator } = getValidatorsData();
    console.log("Validator address:", acceptedAddress, acceptedValidator);
    // Fetch student's UTXOs and build transaction
    const requestorAddress = requestor === 'student' ? studentAddress : teacherAddress;
    const lucid = await getLucid(requestorAddress);
    const inputUtxo = await getInputUtxoByHash(lucid, acceptedAddress, lessonData.acceptationTxId);
    // Determine time window
    const windowType = decideWindowType(Date.now(), lessonData.scheduledUnixtime * 1000);
    // Build transaction amounts
    const { lockUnit, lockAmount, adminAddress } = getDefaults();
    const lessonPrice = BigInt(Math.round((lessonData.price / 100) * 1_000_000));
    const outputs = computeCancelOutputs(lockUnit, lessonPaymentUnit, BigInt(lockAmount), lessonPrice, requestor, windowType);
    console.log(`Determined cancellation window type: ${windowType}`);
    console.log("Computed cancellation outputs:", outputs);
    // Build redeemer datum
    const redeemerDatum = buildRedeemer(requestor, windowType);
    if (!redeemerDatum) {
      throw new Error("Failed to build redeemer datum");
    }
    // Calculate transaction validity range
    const { lower, upper } = getValidityRange(lessonData, windowType);
    console.log(`Setting transaction validity range: lower=${lower}, upper=${upper}`);
    // Create transaction
    const signingKeyHash = getAddressDetails(requestorAddress).paymentCredential.hash;
    if (!signingKeyHash) {
      throw new Error("Unable to extract signing key hash from address");
    }
    
    let tx = lucid
      .newTx()
      .collectFrom([inputUtxo], redeemerDatum);

    if (requestor === "student") {
      if (Object.keys(outputs.teacher).length) {
        tx = tx.pay.ToAddress(teacherAddress, outputs.teacher);
      }

      if (Object.keys(outputs.service).length) {
        const to = outputs.serviceReceiver === "teacher" ? teacherAddress : adminAddress;
        tx = tx.pay.ToAddress(to, outputs.service);
      }

      if (Object.keys(outputs.student).length) {
        tx = tx.pay.ToAddress(studentAddress, outputs.student);
      }
    } else {
      if (Object.keys(outputs.student).length) {
        tx = tx.pay.ToAddress(studentAddress, outputs.student);
      }

      if (Object.keys(outputs.service).length) {
        const to = outputs.serviceReceiver === "teacher" ? teacherAddress : adminAddress;
        tx = tx.pay.ToAddress(to, outputs.service);
      }
    }

    tx = await tx.attach
      .SpendingValidator(acceptedValidator)
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

function buildRedeemer(requestor, windowType) {
  if (requestor === "student") {
    // enforce: teacher(0), service(1), student(2)
    const teacherOutputIndex = 0n;
    const serviceOutputIndex = 1n;

    const base = { teacherOutputIndex, serviceOutputIndex };

    switch (windowType) {
      case "24h":
        return buildRedeemerDatum({ StudentCancel24Hours: base }, LESSON_ACCEPTED_REDEEMER_SCHEMA);
      case "12h":
        return buildRedeemerDatum({ StudentCancel12Hours: base }, LESSON_ACCEPTED_REDEEMER_SCHEMA);
      case "4h":
        return buildRedeemerDatum({ StudentCancel4Hours: base }, LESSON_ACCEPTED_REDEEMER_SCHEMA);
      case "<4h":
        return buildRedeemerDatum({ StudentCancelLessThan4Hours: base }, LESSON_ACCEPTED_REDEEMER_SCHEMA);
      default:
        throw new Error("Invalid windowType for student cancel");
    }
  }

  if (requestor === "teacher") {
    // enforce: student(0), service(1)
    return buildRedeemerDatum(
      { TeacherCancel: { studentOutputIndex: 0n, serviceOutputIndex: 1n } },
      LESSON_ACCEPTED_REDEEMER_SCHEMA
    );
  }

  throw new Error("Invalid requestor");
}

function add(map, unit, qty) {
  if (qty === 0n) return;
  map[unit] = (map[unit] || 0n) + qty;
}

function computeCancelOutputs(
  lockUnit,
  priceUnit,
  lockAmount,
  priceAmount,
  who,
  windowType
) {
  const teacher = {};
  const student = {};
  const service = {};
  const sameToken = lockUnit === priceUnit;

  const tenPct    = (priceAmount * 10n) / 100n;
  const fortyPct  = (priceAmount * 40n) / 100n;
  const sixtyPct  = (priceAmount * 60n) / 100n;
  const ninetyPct = (priceAmount * 90n) / 100n;

  if (who === "student") {
    if (windowType === "24h") {
      // teacher gets lock, admin gets 10%, student gets 90%
      add(teacher, lockUnit, lockAmount);
      add(service, priceUnit, tenPct);
      add(student, priceUnit, priceAmount - tenPct);
      return { teacher, student, service, serviceReceiver: "admin" };
    }

    if (windowType === "12h") {
      // teacher gets lock + 40%, admin gets 10%, student gets 50%
      if (sameToken) add(teacher, priceUnit, lockAmount + fortyPct);
      else {
        add(teacher, lockUnit, lockAmount);
        add(teacher, priceUnit, fortyPct);
      }
      add(service, priceUnit, tenPct);
      add(student, priceUnit, priceAmount - fortyPct - tenPct);
      return { teacher, student, service, serviceReceiver: "admin" };
    }

    if (windowType === "4h") {
      // teacher gets lock + 60%
      if (sameToken) add(teacher, priceUnit, lockAmount + sixtyPct);
      else {
        add(teacher, lockUnit, lockAmount);
        add(teacher, priceUnit, sixtyPct);
      }

      // service gets 10% (receiver differs by your validator rule)
      add(service, priceUnit, tenPct);

      // student gets remaining 30%
      add(student, priceUnit, priceAmount - sixtyPct - tenPct);

      return {
        teacher,
        student,
        service,
        serviceReceiver: sameToken ? "teacher" : "admin",
      };
    }

    if (windowType === "<4h") {
      // teacher gets lock + 90%, admin gets 10%, student gets 0
      if (sameToken) add(teacher, priceUnit, lockAmount + ninetyPct);
      else {
        add(teacher, lockUnit, lockAmount);
        add(teacher, priceUnit, ninetyPct);
      }
      add(service, priceUnit, priceAmount - ninetyPct);
      // student remainder is 0 -> omit
      return { teacher, student, service, serviceReceiver: "admin" };
    }

    throw new Error("Invalid windowType");
  }

  if (who === "teacher") {
    // TeacherCancel: admin gets lock, student gets 100% price
    add(service, lockUnit, lockAmount);
    add(student, priceUnit, priceAmount);
    return { teacher, student, service, serviceReceiver: "admin" };
  }

  throw new Error("Invalid who");
}

function decideWindowType(nowMs, lessonStartTimeMs) {
    const TWENTY_FOUR_H = 86400000; // 24h
    const TWELVE_H = 43200000;      // 12h
    const FOUR_H = 14400000;        // 4h

    if (nowMs < lessonStartTimeMs - TWENTY_FOUR_H)
        return "24h";
    if (nowMs < lessonStartTimeMs - TWELVE_H)
        return "12h";
    if (nowMs < lessonStartTimeMs - FOUR_H)
        return "4h";
    if (nowMs < lessonStartTimeMs)
        return "<4h";
    throw new Error("Lesson has already started; cancellation not allowed.");
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