import {
  ErgoAddress,
  OutputBuilder,
  SBool,
  SGroupElement,
  SInt,
  SSigmaProp,
} from "@fleet-sdk/core";
import { Amount, NewToken, OneOrMore } from "@fleet-sdk/common";
import { SByte, SColl, SLong, SPair } from "@fleet-sdk/serializer";
import { ErgoToken } from "../models/transaction.types";

export function getMintOutput(
  address: ErgoAddress,
  value: Amount,
  tokenToMint: NewToken<Amount>,
  tokens?: OneOrMore<ErgoToken>,
  height?: number
): OutputBuilder {
  const output = new OutputBuilder(value, address, height).mintToken(
    tokenToMint
  );

  if (tokens) {
    output.addTokens(tokens);
  }

  return output;
}

export function getInitializeSessionOutput(
  address: ErgoAddress,
  clientAddress: ErgoAddress,
  psychologistAddress: ErgoAddress,
  value: Amount,
  tokenToMint: NewToken<Amount>,
  sessionStartHeight: number,
  price: number,
  tokens?: OneOrMore<ErgoToken>,
  height?: number,
  partnerOneAddress?: ErgoAddress,
  partnerTwoAddress?: ErgoAddress
): OutputBuilder {
  const output = new OutputBuilder(value, address, height).mintToken(
    tokenToMint
  );

  if (tokens) {
    output.addTokens(tokens);
  }

  // Tokens
  // 1. (SessionSingletonId, 1)
  // 2. (SigUSDId, SessionPrice + ?Collateral) // If provided by the psychologist.
  // Registers
  // R4: Int                              sessionStartTimeBlockHeight
  // R5: (SigmaProp, SigmaProp)           (clientAddressSigmaProp, pyschologistAddressSigmaProp) // Psychologist address is initially the client address before the session is accepted.
  // R6: (Coll[Byte], Coll[Byte])         (partnerLayerOneAddressBytes, partnerLayerTwoAddressBytes) // Empty Coll[Byte]() if not present.
  // R7: (Boolean, Boolean)               (isSessionAccepted, isSessionProblem) // Both false initially.
  // R8: Long                             sessionPrice
  // R9: Long                             collateral  // Assume 0 initially.

  const clientAddressPk = clientAddress.getPublicKeys()[0];
  const psychologistAddressPk = psychologistAddress.getPublicKeys()[0];

  output.setAdditionalRegisters({
    R4: SInt(sessionStartHeight),
    R5: SPair(
      SSigmaProp(SGroupElement(clientAddressPk)),
      SSigmaProp(SGroupElement(psychologistAddressPk))
    ),
    R6: SPair(
      SColl(SByte, partnerOneAddress.ergoTree),
      SColl(SByte, partnerTwoAddress.ergoTree)
    ),
    R7: SPair(SBool(false), SBool(false)),
    R8: SLong(BigInt(price)),
    R9: SLong(BigInt(0)),
  });

  return output;
}

export function getRefundClientOutput(
  clientAddress: ErgoAddress,
  value: Amount,
  paymentToken: OneOrMore<ErgoToken>
): OutputBuilder {
  const output = new OutputBuilder(value, clientAddress);

  output.addTokens(paymentToken);

  return output;
}
