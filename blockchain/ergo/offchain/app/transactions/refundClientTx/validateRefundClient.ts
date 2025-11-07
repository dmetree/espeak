// @ts-nocheck
import { Box, OutputBuilder, ErgoAddress } from "@fleet-sdk/core";
import { decode } from "@fleet-sdk/serializer";

export function validateRefundClient(
  sessionInput: Box,
  // clientInput: Box,
  clientInput: string,
  clientOutput: OutputBuilder
): boolean {
  const clientErgoTreeFromClientInput =
    ErgoAddress.fromBase58(clientInput).ergoTree;

  const validClient = (() => {
    const clientSigmaPropBytes = decode<[Uint8Array, Uint8Array]>(
      sessionInput.additionalRegisters.R5.serializedValue
    ).data[0];
    const address = ErgoAddress.fromPublicKey(clientSigmaPropBytes);

    // Get the ErgoTree from the address
    const ergoTreeFromSigmaProp = address.ergoTree;

    // Compare the two ErgoTrees
    return clientErgoTreeFromClientInput === ergoTreeFromSigmaProp;
  })();

  const validClientRefundBoxOut = (() => {
    const validValue =
      BigInt(clientOutput.value) === BigInt(sessionInput.value);

    // propositionBytes equal to ergoTree
    const validClientRefundAddressBytes =
      clientOutput.ergoTree === clientErgoTreeFromClientInput;

    const check = clientOutput.assets.toArray()[0];

    const validClientRefundAmount =
      check.tokenId == sessionInput.assets[1].tokenId &&
      check.amount ==
        decode<bigint>(sessionInput.additionalRegisters.R8.serializedValue)
          .data;

    return (
      validValue && validClientRefundAddressBytes && validClientRefundAmount
    );
  })();

  const isSessionAccepted = decode<[boolean, boolean]>(
    sessionInput.additionalRegisters.R7.serializedValue
  ).data[0];

  const refundState =
    !isSessionAccepted && validClient && validClientRefundBoxOut;

  return refundState;
}
