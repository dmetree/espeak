import { validatorToAddress, Data } from "@lucid-evolution/lucid";

const lessonRequestPlutusScript = {
  type: "PlutusV3",
  script: process.env.PLUTUS_LESSON_REQUEST_COMPILED_CODE.trim(),
};

const lessonAcceptedPlutusScript = {
  type: "PlutusV3",
  script: process.env.PLUTUS_LESSON_ACCEPTED_COMPILED_CODE.trim(),
};

const lessonComplaintPlutusScript = {
  type: "PlutusV3",
  script: process.env.PLUTUS_LESSON_COMPLAINT_COMPILED_CODE.trim(),
};

const getValidatorAddress = async (plutusScript) =>
  validatorToAddress(process.env.NEXT_PUBLIC_BLOCKFROST_NETWORK, plutusScript);

const LessonRequestDatumSchema = Data.Object({
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
});

const AcceptedLessonDatumSchema = Data.Object({
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
});

const LessonComplaintDatumSchema = Data.Object({
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
  complaintType: Data.Integer(),
});

async function buildTransactionDatum(data, schema) {
  try {
    return Data.to(data, schema);
  } catch (error) {
    console.error("Error building datum:", error);
    return null;
  }
}

export {
  lessonRequestPlutusScript,
  lessonAcceptedPlutusScript,
  lessonComplaintPlutusScript,
  getValidatorAddress,
  LessonRequestDatumSchema,
  AcceptedLessonDatumSchema,
  LessonComplaintDatumSchema,
  buildTransactionDatum,
};
