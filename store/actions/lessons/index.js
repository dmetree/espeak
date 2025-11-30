// import {
//   LESSON_REQUEST_TX_START,
//   LESSON_REQUEST_TX_FAIL,
//   LESSON_REQUEST_TX_SUCCESS,
// } from "store/actionTypes";
// import * as FluidLib from "@/components/lib";

// export const submitLessonRequestTx = (wallet, lessonData, amounts) =>
//   async (dispatch) => {
//     dispatch({ type: LESSON_REQUEST_TX_START });

//     try {
//         const walletInstance = await FluidLib.Cardano.Wallet.connect(wallet);
//         const validatorAddress = await FluidLib.Cardano.Validators.getValidatorAddress(lessonRequestPlutusScript);
//         const datum = await FluidLib.Cardano.Validators.buildTransactionDatum(
//             lessonData,
//             FluidLib.Cardano.Validators.LessonRequestDatumSchema
//         );
//         if (!datum) {
//             throw new Error("Failed to build datum");
//         }

//         const txHash = await FluidLib.Cardano.TxBuilder.signAndSubmitTransaction(walletInstance, unsignedTxCbor);
//         dispatch({
//             type: LESSON_REQUEST_TX_SUCCESS,
//             payload: { txHash },
//         });
//         return txHash;
//     } catch (err) {
//         console.error("submitLessonRequestTx error:", err);
//         dispatch({
//             type: LESSON_REQUEST_TX_FAIL,
//             error: err.message || "Unknown error",
//         });
//         throw err;
//     }
//   };

export const submitLessonRequestTx =
  (wallet, lessonData, amounts) => async (dispatch) => {
    dispatch({ type: LESSON_REQUEST_TX_START });

    try {
      const walletInstance = await FluidLib.Cardano.Wallet.connect(wallet);
      const validatorAddress =
        await FluidLib.Cardano.Validators.getValidatorAddress(
          lessonRequestPlutusScript
        );

      const datum = await FluidLib.Cardano.Validators.buildTransactionDatum(
        lessonData,
        FluidLib.Cardano.Validators.LessonRequestDatumSchema
      );

      const response = await fetch("/api/lockTx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet: walletInstance,
          validatorAddress,
          datum,
          amounts,
        }),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error);

      dispatch({
        type: LESSON_REQUEST_TX_SUCCESS,
        payload: { txHash: result.signedTxCbor },
      });

      return result.signedTxCbor;
    } catch (err) {
      console.error("submitLessonRequestTx error:", err);
      dispatch({ type: LESSON_REQUEST_TX_FAIL, error: err.message });
      throw err;
    }
  };
