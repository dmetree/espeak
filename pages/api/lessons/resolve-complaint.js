import {  getAddressDetails } from "@lucid-evolution/lucid";
import { getValidatorsData, buildRedeemerDatum, LESSON_COMPLAINT_REDEEMER_SCHEMA } from "../../../server/validators.js"
import { getLucid, getInputUtxoByHash } from "../../../server/lucid.js";
import { getDefaults } from "../../../server/defaults.js";

// This endpoint builds a resolution transaction for a lesson complaint on the Cardano blockchain.
// It receives the lesson data, resolution type, and target party from the frontend.
// It constructs a transaction that resolves the complaint according to the specified resolution type.
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
    const { lessonData, resolutionType, toStudent, lessonPaymentUnit = 'lovelace' } = req.body;
    if (!lessonData.complaintTxId)
      throw new Error("Accepted transaction hash is required in lesson data");
    if (!['money_to_one', 'money_to_both'].includes(resolutionType))
      throw new Error("Invalid resolution type");
    if (resolutionType === 'money_to_one' && typeof toStudent !== 'boolean') {
      throw new Error("toStudent must be a boolean when resolutionType is 'money_to_one'");
    }

    // Derive validator address from compiled Plutus script
    const { complaintAddress, complaintValidator } = getValidatorsData();
    console.log("Validator address:", complaintAddress);
    // Fetch teacher's UTXOs and build transaction
    const { lockUnit, lockAmount, adminAddress } = getDefaults();
    const lucid = await getLucid(adminAddress);
    const inputUtxo = await getInputUtxoByHash(lucid, complaintAddress, lessonData.complaintTxId);
    // Build transaction amounts
    const studentAddress = lessonData.studentWallet;
    const teacherAddress = lessonData.teacherWallet;
    const lessonPriceAmount = BigInt(Math.round((lessonData.price / 100) * 1_000_000));
    const outputs = computeComplaintOutputs(
      resolutionType,
      toStudent,
      studentAddress,
      teacherAddress,
      lessonPaymentUnit,
      lessonPriceAmount,
      lockUnit,
      BigInt(lockAmount),
      adminAddress
    );
    // Build redeemer datum
    const redeemerDatum = buildRedeemer(resolutionType, toStudent);
    if (!redeemerDatum) {
      throw new Error("Failed to build redeemer datum");
    }
    // Create transaction
    const adminKeyHash = getAddressDetails(adminAddress).paymentCredential.hash;
    if (!adminKeyHash) {
      throw new Error("Unable to extract student key hash from address");
    }

    let tx = lucid
      .newTx()
      .collectFrom([inputUtxo], redeemerDatum);

    for (const o of outputs) {
      txb = txb.pay.ToAddress(o.address, o.assets);
    }

    tx = await tx
      .attach.SpendingValidator(complaintValidator)
      .addSignerKey(adminKeyHash)
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

function buildRedeemer(resolution, toStudent = false) {
    if (resolution === 'money_to_one') {
        return buildRedeemerDatum({ MoneyToOne: { toStudent } }, LESSON_COMPLAINT_REDEEMER_SCHEMA);
    } else if (resolution === 'money_to_both') {
        return buildRedeemerDatum({ MoneyToToBoth: [] }, LESSON_COMPLAINT_REDEEMER_SCHEMA);
    }
    throw new Error("Invalid requestor");
}

function computeComplaintOutputs(resolutionType, toStudent, studentAddress, teacherAddress, priceUnit, priceAmount, lockUnit, lockAmount, adminAddress) {
  const add = (m, unit, qty) => {
    if (!unit || qty === 0n) return;
    m[unit] = (m[unit] ?? 0n) + qty;
  };

  if (resolutionType === "money_to_one") {
    const out0 = { lovelace: 0 };
    add(out0, priceUnit, priceAmount);
    const out1 = { lovelace: 0 };
    add(out1, lockUnit, lockAmount);

    return [
      {
        address: toStudent ? studentAddress : teacherAddress,
        assets: out0,
      },
      {
        address: toStudent ? teacherAddress : adminAddress,
        assets: out1,
      },
    ];
  }

  const half = (params.lessonPriceAmount * 50n) / 100n;

  const outTeacher = { lovelace: 0 };
  const outStudent = { lovelace: 0 };
  const outAdmin = { lovelace: 0 };

  add(outTeacher, priceUnit, half);
  add(outStudent, priceUnit, half);
  add(outAdmin, lockUnit, lockAmount);

  return [
    { address: teacherAddress, assets: outTeacher }, // outputs[0]
    { address: studentAddress, assets: outStudent }, // outputs[1]
    { address: adminAddress, assets: outAdmin },     // outputs[2]
  ];
}