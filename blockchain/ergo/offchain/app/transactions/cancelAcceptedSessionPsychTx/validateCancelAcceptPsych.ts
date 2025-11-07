// @ts-nocheck
import { Box, OutputBuilder, ErgoAddress } from "@fleet-sdk/core";
import { decode } from "@fleet-sdk/serializer";

export function validateCancelAcceptPsych(
  sessionInput: Box,
  therapistInput: string,
  cancelTherapistOutput: OutputBuilder
): boolean {
  const therapistErgoTreeFromTherapistInput =
    ErgoAddress.fromBase58(therapistInput).ergoTree;

  const validTherapist = (() => {
    const therapistSigmaPropBytes = decode<[Uint8Array, Uint8Array]>(
      sessionInput.additionalRegisters.R5.serializedValue
    ).data[1];
    const address = ErgoAddress.fromPublicKey(therapistSigmaPropBytes);

    // Get the ErgoTree from the address
    const ergoTreeFromSigmaProp = address.ergoTree;

    // Compare the two ErgoTrees
    return therapistErgoTreeFromTherapistInput === ergoTreeFromSigmaProp;
  })();

  const validTherapistRefundBoxOut = (() => {
    const validValue =
      BigInt(cancelTherapistOutput.value) === BigInt(sessionInput.value);

    // propositionBytes equal to ergoTree
    const validClientRefundAddressBytes =
      cancelTherapistOutput.ergoTree === therapistErgoTreeFromTherapistInput;

    const check = cancelTherapistOutput.assets.toArray()[0];

    const validTherapistRefundAmount =
      check.tokenId == sessionInput.assets[1].tokenId &&
      check.amount ==
        decode<bigint>(sessionInput.additionalRegisters.R8.serializedValue)
          .data;

    return (
      validValue && validClientRefundAddressBytes && validTherapistRefundAmount
    );
  })();

  // Session should be previously accepted by therapist.
  const isSessionAccepted = decode<[boolean, boolean]>(
    sessionInput.additionalRegisters.R7.serializedValue
  ).data[0];

  const refundState =
    isSessionAccepted && validTherapist && validTherapistRefundBoxOut;

  return refundState;
}
