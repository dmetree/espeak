import { compile } from "@fleet-sdk/compiler";
import { psySessionContractScript } from "../constants/psy_session_contract";
import {
  ErgoAddress,
  Network,
  SByte,
  SColl,
  SGroupElement,
  SSigmaProp,
} from "@fleet-sdk/core";

export const compileFunction = () => {
  // Create Coll[Byte] representations
  const tokenIdColl = SColl(
    SByte,
    "f151f5c1aab0d47a82083d210346fb0cf919335a31308e1448ac0bff33eb2209"
  );
  const tokenIdCollMiner = SColl(
    SByte,
    "e540cceffd3b8dd0f401193576cc413467039695969427df94454193dddfb375"
  );

  // Get the address bytes correctly
  const adminAddress = ErgoAddress.fromBase58(
    "9hMdYB4fYJ37VhnPC3LgLnDJCvfjECdwX3nDkVe4Rzuo7KTNpRD"
  );
  const adminPk = adminAddress.getPublicKeys()[0];

  const psyworkshopAddress = ErgoAddress.fromBase58(
    "9efDyqCqk457p94YsFfuSX4CDYDG2WvEPouSVswU3xoyjcqhXJT"
  );

  // Compile options
  const options = {
    map: {
      $psyworkshopRegistrationTokenId: tokenIdColl,
      //was: $psyworkshopFeeAddressBytes: SColl(SByte, adminAddress.ergoTree), // Remove the header byte
      $psyworkshopFeeAddressBytes: SColl(SByte, psyworkshopAddress.ergoTree),
      $psyworkshopAdminSigmaProp: SSigmaProp(SGroupElement(adminPk)),
      $minerFeeErgoTreeBytesHash: tokenIdCollMiner,
    },
  };

  // Compile the contract
  const tree = compile(psySessionContractScript, options);
  return tree;
};
// Generate the contract address
export const contractAddress = compileFunction()
  .toAddress(Network.Mainnet)
  .toString();
console.log("contractAddress", contractAddress);
