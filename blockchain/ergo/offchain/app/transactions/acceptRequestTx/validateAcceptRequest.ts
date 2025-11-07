// import { Box, ErgoAddress, OutputBuilder } from "@fleet-sdk/core";
// import { decode } from "@fleet-sdk/serializer";

// export function validateAcceptRequest(
//     psychologistInput: Box, // from psychologiest wallet
//     sessionBoxInput: Box, // find by singletonID i will call API
//     sessionBoxOutput: OutputBuilder, // not exist yet
//     psychologistOutput: OutputBuilder, // not exist yet
// ) {
//    const validPsychologistRegistration = (() => {
//     const validSessionStatusUpdate = (() => {

//         // // Extract the client address from the session box
//         // const clientPsychologistPair = sessionBoxOutput.additionalRegisters.R5.value as [Buffer, Buffer];
//         const psycologistAddress = decode<[Uint8Array, Uint8Array]>(sessionBoxOutput.additionalRegisters.R5).data[1];

//         // // Get the psychologist's public key
//         // const psychologistPubKey = psychologistOutput.getPublicKeys()[0];

//         // Check if the psychologist is not the admin
//         const psyworkshopAdminPubKey = "YOUR_ADMIN_PUBKEY_HERE"; // Replace with actual admin pubkey
//         const isNotAdmin = !psychologistPubKey.equals(Buffer.from(psyworkshopAdminPubKey, 'hex'));

//         // Check if the psychologist box belongs to the psychologist address
//         const psychologistBoxPubKey = ErgoAddress.fromErgoTree(
//            psychologistBox.ergoTree,
//            psychologistOutput.network
//         ).getPublicKeys()[0];
//         const isSamePsychologist = psychologistPubKey.equals(psychologistBoxPubKey);

//         // Check if the status is set to (true, false)
//         // This would be checked in the actual transaction building

//         return isNotAdmin && isSamePsychologist;
//      })();

//       const validRegistrationToken = (() => {
//          // Check if the psychologist box has the registration token
//          return psychologistBox.assets.some(asset =>
//             asset.tokenId === "PSYCHOLOGIST_REGISTRATION_TOKEN_ID" && asset.amount >= 1n
//          );
//       })();

//       return validSessionStatusUpdate && validRegistrationToken;
//    })();

//    const validCollateralTransfer = (() => {
//         // Extract session price from R8 register
//         const sessionPrice = sessionBox.additionalRegisters.R8.value as bigint;

//         // Calculate expected collateral (10% of session price)
//         const expectedCollateral = (sessionPrice * 10n) / 100n;

//         // Get token amount from the second token in the session box
//         const sessionPriceTokenId = sessionBox.assets[1]?.tokenId;
//         const totalTokenValue = sessionBox.assets[1]?.amount || 0n;

//         // Check if collateral is greater than 0
//         const collateralPositive = expectedCollateral > 0n;

//         // Check if collateral is correctly calculated
//         const collateralCorrect = expectedCollateral === (10n * sessionPrice) / 100n;

//         // Check if total value equals session price + collateral
//         const totalValueCorrect = totalTokenValue === sessionPrice + expectedCollateral;

//         return collateralPositive && collateralCorrect && totalValueCorrect;
//     })();

//    const validSessionRecreation = (() => {
//         // Extract values from the session box
//         const sessionValue = sessionBox.value;
//         const sessionErgoTree = sessionBox.ergoTree;
//         const sessionSingletonId = sessionBox.assets[0]?.tokenId;
//         const sessionPriceTokenId = sessionBox.assets[1]?.tokenId;
//         const sessionStartTimeBlockHeight = sessionBox.additionalRegisters.R4.value as number;
//         const clientAddressPair = sessionBox.additionalRegisters.R5.value as [Buffer, Buffer];
//         const clientAddress = clientAddressPair[0];
//         const sessionDataR6 = sessionBox.additionalRegisters.R6;
//         const sessionPrice = sessionBox.additionalRegisters.R8.value as bigint;

//         // These checks would be used when building the transaction
//         // to ensure all values are preserved correctly
//         return true;
//     })();

//    const validPsychologistBoxOut = (() => {
//         // Check that psychologist box properties remain unchanged
//         const valueUnchanged = true; // Will check in transaction building
//         const propositionBytesUnchanged = true; // Will check in transaction building
//         const tokensUnchanged = true; // Will check in transaction building

//         return valueUnchanged && propositionBytesUnchanged && tokensUnchanged;
//     })();

//     // Return the overall validation result
//     return validPsychologistRegistration &&
//         validCollateralTransfer &&
//         validSessionRecreation &&
//         validPsychologistBoxOut;
// }
