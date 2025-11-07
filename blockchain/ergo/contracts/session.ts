import { Amount, ensureBigInt, ensureUTxOBigInt } from "@fleet-sdk/common";
import {
  Box,
  ErgoAddress,
  ErgoTree,
  ErgoUnsignedInput,
  ErgoUnsignedTransaction,
  OutputBuilder,
  RECOMMENDED_MIN_FEE_VALUE,
  SAFE_MIN_BOX_VALUE,
  TokenAmount,
  TransactionBuilder,
} from "@fleet-sdk/core";
import {
  SInt,
  SPair,
  SSigmaProp,
  SGroupElement,
  SColl,
  SByte,
  SBool,
  SLong,
  SConstant,
} from "@fleet-sdk/serializer";

export const DEFAULT_CONTRACT_PARAMS: ContractParams = {
  address: process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS as string,
  tokens: {
    payment: "03faf2cb329f2e90d6d23b58d91bbb6c046aa143261cc21f52fbe2824bfcbf04", // SigUSD token ID
    registration:
      "f151f5c1aab0d47a82083d210346fb0cf919335a31308e1448ac0bff33eb2209", // PsychologistPass token ID
  },
  admin: "9hMdYB4fYJ37VhnPC3LgLnDJCvfjECdwX3nDkVe4Rzuo7KTNpRD",
  workshop: "9efDyqCqk457p94YsFfuSX4CDYDG2WvEPouSVswU3xoyjcqhXJT",
};

export class Session {
  readonly #contract: ContractParams = DEFAULT_CONTRACT_PARAMS;

  readonly #box: Box<bigint>;
  readonly #state: SessionState;

  constructor(box: Box, customParams?: Partial<ContractParams>) {
    if (customParams) {
      this.#contract = { ...DEFAULT_CONTRACT_PARAMS, ...customParams };
    }

    this.#box = ensureUTxOBigInt(box);

    // parse box registers
    const registers = this.#box.additionalRegisters;
    const [clientPk, therapistPk] = SConstant.from<[Uint8Array, Uint8Array]>(
      registers.R5
    ).data;
    const [isSessionAccepted, isSessionProblem] = SConstant.from<
      [boolean, boolean]
    >(registers.R7).data;

    const [partnerOne, partnerTwo] = SConstant.from<[Uint8Array, Uint8Array]>(
      registers.R6
    ).data;

    this.#state = {
      startHeight: SConstant.from<number>(registers.R4).data,
      clientPk,
      therapistPk,
      isSessionAccepted,
      isSessionProblem,
      price: SConstant.from<bigint>(registers.R8).data,
      collateral: SConstant.from<bigint>(registers.R9).data,
      partnerOne,
      partnerTwo,
    };
  }

  get box(): Box {
    return this.#box;
  }

  get startHeight(): number {
    return this.#state.startHeight;
  }

  get clientPk(): Uint8Array {
    return this.#state.clientPk;
  }

  get therapistPk(): Uint8Array {
    return this.#state.therapistPk;
  }

  get partnerOne(): Uint8Array {
    return this.#state.partnerOne;
  }

  get partnerTwo(): Uint8Array {
    return this.#state.partnerTwo;
  }

  get isSessionAccepted(): boolean {
    return this.#state.isSessionAccepted;
  }

  get isSessionProblem(): boolean {
    return this.#state.isSessionProblem;
  }

  get price(): bigint {
    return this.#state.price;
  }

  get collateral(): bigint {
    return this.#state.collateral;
  }

  get sessionToken(): TokenAmount<bigint> {
    return this.#box.assets[0]; // Session singleton token
  }

  get paymentToken(): TokenAmount<bigint> {
    return this.#box.assets[1]; // Payment token (e.g., SigUSD)
  }

  /**
   * Creates a new session transaction.
   */
  static create(
    params: SessionCreateParams,
    contractParams?: ContractParams
  ): ErgoUnsignedTransaction {
    // Tokens
    // 1. (SessionSingletonId, 1)
    // 2. (SigUSDId, SessionPrice + ?Collateral) // If provided by the psychologist.

    // Registers
    // R4: Int                              sessionStartTimeBlockHeight
    // R5: (SigmaProp, SigmaProp)           (clientAddressSigmaProp, psychologistAddressSigmaProp) // Psychologist address is initially the client address before the session is accepted.
    // R6: (Coll[Byte], Coll[Byte])         (partnerLayerOneAddressBytes, partnerLayerTwoAddressBytes) // Empty Coll[Byte]() if not present.
    // R7: (Boolean, Boolean)               (isSessionAccepted, isSessionProblem) // Both false initially.
    // R8: Long                             sessionPrice
    // R9: Long                             collateral  // Assume 0 initially.

    const clientPk = params.client.getPublicKeys()[0];
    const partnerOnePk = params.partnerOne.ergoTree;
    console.log("P1: ", params.partnerOne);
    const partnerTwoPk = params.partnerTwo.ergoTree;
    const { address, tokens } = contractParams;

    const isPartnerOnePkAvailable = partnerOnePk ? partnerOnePk : [];
    const isPartnerTwoPkAvailable = partnerTwoPk ? partnerTwoPk : [];

    return new TransactionBuilder(params.height)
      .from(params.inputs)
      .to(
        new OutputBuilder(SAFE_MIN_BOX_VALUE, address, params.height)
          .mintToken({ amount: 1n }) // mint a session singleton token
          .addTokens({ tokenId: tokens.payment, amount: params.price }) // add payment token (SigUSD)
          .setAdditionalRegisters({
            R4: SInt(params.startHeight), // session start height
            R5: SPair(
              SSigmaProp(SGroupElement(clientPk)),
              SSigmaProp(SGroupElement(clientPk)) // from contract: Psychologist address is initially the client address before the session is accepted.
            ),
            // R6: SPair(SColl(SByte, []), SColl(SByte, [])),
            R6: SPair(
              SColl(SByte, isPartnerOnePkAvailable),
              SColl(SByte, isPartnerTwoPkAvailable)
            ),
            R7: SPair(SBool(false), SBool(false)), // (isSessionAccepted, isSessionProblem), both false initially.
            R8: SLong(BigInt(params.price)), // session price
            R9: SLong(BigInt(0)), // collateral, assume 0 initially
          })
      )
      .payFee(params.fee || RECOMMENDED_MIN_FEE_VALUE)
      .sendChangeTo(params.client)
      .build();
  }

  /**
   * Cancels an existing session and refunds the payment token to the client.
   */
  cancel(refund: CancelSessionParams): ErgoUnsignedTransaction {
    const tx = new TransactionBuilder(refund.height)
      .from(
        new ErgoUnsignedInput(this.box).setContextExtension({ "0": SInt(4) }), // 4 == Refund action
        { ensureInclusion: true }
      )
      .from(refund.inputs, { ensureInclusion: true }) // at least one utxo from the client should be included at index 1
      .burnTokens(this.sessionToken) // Burn the session token
      .to(
        new OutputBuilder(SAFE_MIN_BOX_VALUE, refund.client).addTokens(
          this.paymentToken // Refund the payment token
        )
      )
      .sendChangeTo(refund.client);

    return this.#setFee(tx, refund.fee).build();
  }

  /**
   * Accepts a session
   */
  accept(params: AcceptSessionParams): ErgoUnsignedTransaction {
    /**
     * ===== BOX CONTENTS ===== //
     * Tokens
     * 1. (SessionSingletonId, 1)
     * 2. (SigUSDId, SessionPrice + ?Collateral) // If provided by the psychologist.
     * Registers
     * R4: Int                              sessionStartTimeBlockHeight
     * R5: (SigmaProp, SigmaProp)           (clientAddressSigmaProp, psychologistAddressSigmaProp) // Psychologist address is initially the client address before the session is accepted.
     * R6: (Coll[Byte], Coll[Byte])         (partnerLayerOneAddressBytes, partnerLayerTwoAddressBytes) // Empty Coll[Byte]() if not present.
     * R7: (Boolean, Boolean)               (isSessionAccepted, isSessionProblem) // Both false initially.
     * R8: Long                             sessionPrice
     * R9: Long                             collateral  // Assume 0 initially.
     *
     * ==== ACTION ====
     * 1. Accept Session Tx
     * Inputs: Session, Psychologist
     * Data Inputs: None
     * Outputs: Session, Psychologist,
     * Context Variables: TxType = 1
     */

    const sessionRegisters = this.box.additionalRegisters;
    const therapistPk = params.therapist.getPublicKeys()[0];
    const collateral = (10n * this.price) / 100n; // (outCollateral == (10L * sessionPrice) / 100L), see: https://github.com/4EYESConsulting/psyworkshop-contracts/blob/d25ad3c689014318313a8d03ff9db24961a1666f/contracts/psyworkshop_v1_session.es#L248

    const paymentToken: TokenAmount<bigint> = {
      tokenId: this.paymentToken.tokenId,
      amount: this.price + collateral, // update payment token amount to session price + collateral, , see: https://github.com/4EYESConsulting/psyworkshop-contracts/blob/main/contracts/psyworkshop_v1_session.es#L249
    };

    console.log("sessionRegisters", sessionRegisters);

    // recreate sessionBox with new registers and tokens, see: https://github.com/4EYESConsulting/psyworkshop-contracts/blob/d25ad3c689014318313a8d03ff9db24961a1666f/contracts/psyworkshop_v1_session.es#L254
    const newSessionBox = new OutputBuilder(this.box.value, this.box.ergoTree)
      .addTokens(this.sessionToken) // keep session singleton token
      .addTokens(paymentToken)
      .setAdditionalRegisters({
        ...sessionRegisters, // override registers
        R5: SPair(
          SSigmaProp(SGroupElement(this.clientPk)), // keep client pk
          SSigmaProp(SGroupElement(therapistPk)) // add therapist pk
        ),
        R7: SPair(SBool(true), SBool(false)), // (session accepted, no session problem),
        R9: SLong(collateral),
      });

    console.log("newSessionBox", newSessionBox);

    let inputs = params.inputs;
    const therapistInputIndex = inputs.findIndex((input) =>
      input.assets.some((a) => a.tokenId === this.#contract.tokens.registration)
    );
    if (therapistInputIndex < 0) throw new Error("Therapist input not found");

    const therapistInput = inputs[therapistInputIndex];
    inputs.splice(therapistInputIndex, 1); // remove therapist input from inputs

    const tx = new TransactionBuilder(params.height)
      .from(
        new ErgoUnsignedInput(this.box).setContextExtension({ 0: SInt(1) }),
        { ensureInclusion: true }
      )
      .from(therapistInput, { ensureInclusion: true })
      .from(inputs)
      .to(newSessionBox)
      .to(
        new OutputBuilder(SAFE_MIN_BOX_VALUE, params.therapist).addTokens({
          tokenId: this.#contract.tokens.registration,
          amount: 1n,
        })
      )
      .sendChangeTo(params.therapist);

    return this.#setFee(tx, params.fee).build();
  }

  /**
    Pscychologist cancels accepted session and ends contract.
   **/
  psychCancel(params: PsychCancelParams): ErgoUnsignedTransaction {
    /**
     * ===== BOX CONTENTS ===== //
     * Tokens
     * 1. (SessionSingletonId, 1)
     * 2. (SigUSDId, SessionPrice + ?Collateral) // If provided by the psychologist.
     * Registers
     * R4: Int                              sessionStartTimeBlockHeight
     * R5: (SigmaProp, SigmaProp)           (clientAddressSigmaProp, psychologistAddressSigmaProp) // Psychologist address is initially the client address before the session is accepted.
     * R6: (Coll[Byte], Coll[Byte])         (partnerLayerOneAddressBytes, partnerLayerTwoAddressBytes) // Empty Coll[Byte]() if not present.
     * R7: (Boolean, Boolean)               (isSessionAccepted, isSessionProblem) // Both false initially.
     * R8: Long                             sessionPrice
     * R9: Long                             collateral  // Assume 0 initially.
     *
     * ==== ACTION ====
     * 2. Cancel Session Tx: Psychologist
     * Inputs: Session, PsychologistPK
     * Data Inputs: None
     * Outputs: Client, Psychologist, PsyWorkshopFee
     * Context Variables: TxType = 2
     *
     * 60 block must pass before the session start time.
     */
    const inputs = params.inputs;
    const clientAddress = ErgoAddress.fromPublicKey(this.clientPk);

    const therapistInputIndex = inputs.findIndex((input) =>
      input.assets.some((a) => a.tokenId === this.#contract.tokens.registration)
    );
    if (therapistInputIndex < 0) throw new Error("Therapist input not found");

    const therapistInput = inputs[therapistInputIndex];
    inputs.splice(therapistInputIndex, 1); // remove therapist input from inputs

    console.log("Session Box R7:", this.box.additionalRegisters.R7);
    console.log("Session Registers:", this.box.additionalRegisters);
    console.log("Session Token:", this.sessionToken);
    console.log("Payment Token:", this.paymentToken);
    console.log("Collateral:", this.collateral);

    // === Collateral split ===
    const halfCollateral = this.collateral / 2n;
    const remainder = this.collateral - halfCollateral;

    const tx = new TransactionBuilder(params.height)
      .from(
        new ErgoUnsignedInput(this.box).setContextExtension({ 0: SInt(2) }),
        { ensureInclusion: true }
      )
      .from(therapistInput, { ensureInclusion: true })
      .from(inputs)
      .burnTokens(this.sessionToken) // Burn the session token
      .to(
        new OutputBuilder(SAFE_MIN_BOX_VALUE, clientAddress).addTokens({
          tokenId: this.paymentToken.tokenId,
          amount: this.price,
        })
      )
      .to(
        new OutputBuilder(SAFE_MIN_BOX_VALUE, params.therapist)
          .addTokens({
            tokenId: this.paymentToken.tokenId,
            amount: halfCollateral,
          })
          .addNfts(this.#contract.tokens.registration)
      )
      .to(
        new OutputBuilder(
          SAFE_MIN_BOX_VALUE,
          DEFAULT_CONTRACT_PARAMS.workshop
        ).addTokens({
          tokenId: this.paymentToken.tokenId,
          amount: remainder,
        })
      )
      .sendChangeTo(params.therapist);

    return this.#setFee(tx, params.fee).build();
  }

  /**
    Client cancels accepted session and ends contract.
   **/
  clientCancel(params: ClientCancelParams): ErgoUnsignedTransaction {
    /**
     * ===== BOX CONTENTS ===== //
     * Tokens
     * 1. (SessionSingletonId, 1)
     * 2. (SigUSDId, SessionPrice + ?Collateral) // If provided by the psychologist.
     * Registers
     * R4: Int                              sessionStartTimeBlockHeight
     * R5: (SigmaProp, SigmaProp)           (clientAddressSigmaProp, psychologistAddressSigmaProp) // Psychologist address is initially the client address before the session is accepted.
     * R6: (Coll[Byte], Coll[Byte])         (partnerLayerOneAddressBytes, partnerLayerTwoAddressBytes) // Empty Coll[Byte]() if not present.
     * R7: (Boolean, Boolean)               (isSessionAccepted, isSessionProblem) // Both false initially.
     * R8: Long                             sessionPrice
     * R9: Long                             collateral  // Assume 0 initially.
     *
     * ==== ACTION ====
     * 3. Cancel Session Tx: Client
     * Inputs: Session, PsychologistPK
     * Data Inputs: None
     * Outputs: Client, Psychologist, PsyWorkshopFee
     * Context Variables: TxType = 3
     */

    const therapistAddress = ErgoAddress.fromPublicKey(this.therapistPk);
    const startTime = this.startHeight;
    const currentTime = params.height;

    const blocksUntilSession = startTime - currentTime;
    const timeBeforeSessionStart = (blocksUntilSession * 2) / 60; // Approximate hours
    console.log("timeBeforeSessionStart:", timeBeforeSessionStart);

    const isLateCancel = timeBeforeSessionStart < 24;

    const sessionPrice = this.price;
    const collateral = this.collateral;

    const remainder = sessionPrice / 2n; // sessionPrice - sessionPrice/2 = 50%
    const workshopFee = remainder / 2n; // 25%
    const psychFee = remainder - workshopFee; // 25%

    const clientRefund = isLateCancel ? sessionPrice / 2n : sessionPrice;
    const therapistPayout = isLateCancel ? collateral + psychFee : collateral;

    const tx = new TransactionBuilder(params.height)
      .from(
        new ErgoUnsignedInput(this.box).setContextExtension({ 0: SInt(3) }),
        { ensureInclusion: true }
      )
      .from(params.inputs)
      .burnTokens(this.sessionToken) // Burn the session token
      .to(
        new OutputBuilder(SAFE_MIN_BOX_VALUE, params.client).addTokens({
          tokenId: this.paymentToken.tokenId,
          amount: clientRefund,
        })
      )
      .to(
        new OutputBuilder(SAFE_MIN_BOX_VALUE, therapistAddress).addTokens({
          tokenId: this.paymentToken.tokenId,
          amount: therapistPayout,
        })
      )
      .to(
        new OutputBuilder(
          SAFE_MIN_BOX_VALUE,
          DEFAULT_CONTRACT_PARAMS.workshop
        ).addTokens({
          tokenId: this.paymentToken.tokenId,
          amount: workshopFee,
        })
      )
      .sendChangeTo(params.client);

    return this.#setFee(tx, params.fee).build();
  }

  /**
     // Psychologist claims the reward, there is no problem after 15 minutes of the session end.
   **/
  psychEndNoProblem(params: psychEndNoProblemParams): ErgoUnsignedTransaction {
    //  * ===== BOX CONTENTS ===== //
    //  * Tokens
    //  * 1. (SessionSingletonId, 1)
    //  * 2. (SigUSDId, SessionPrice + ?Collateral) // If provided by the psychologist.
    //  * Registers
    //  * R4: Int                              sessionStartTimeBlockHeight
    //  * R5: (SigmaProp, SigmaProp)           (clientAddressSigmaProp, psychologistAddressSigmaProp) // Psychologist address is initially the client address before the session is accepted.
    //  * R6: (Coll[Byte], Coll[Byte])         (partnerLayerOneAddressBytes, partnerLayerTwoAddressBytes) // Empty Coll[Byte]() if not present.
    //  * R7: (Boolean, Boolean)               (isSessionAccepted, isSessionProblem) // Both false initially.
    //  * R8: Long                             sessionPrice
    //  * R9: Long                             collateral  // Assume 0 initially.
    //  *
    //  * ==== ACTION ====
    // 5. Session End Tx: No Problem
    // Inputs: Session, Psychologist
    // Data Inputs: None
    // Outputs: Psychologist, ?PartnerLayerOneFee, ?PartnerLayerTwoFee, PsyWorkshopFee
    // Context Variables: TxType = 5

    // Question: should there be a check of psychologist's NFT?
    // and validation of the psychologist's address?
    const therapistAddress = ErgoAddress.fromPublicKey(this.therapistPk);
    const startTime = this.startHeight;
    const currentTime = params.height;

    const isPartnerLayerOnePresent = this.partnerOne;
    console.log("P1: ", isPartnerLayerOnePresent);
    const isPartnerLayerTwoPresent = this.partnerTwo;
    console.log("P2: ", isPartnerLayerOnePresent);

    const sessionPrice = this.price;
    const collateral = this.collateral;

    const psychFee = (800n * sessionPrice) / 1000n;

    const partnerLayerOneFee = isPartnerLayerOnePresent
      ? (120n * sessionPrice) / 1000n
      : 0n;

    const partnerLayerTwoFee = isPartnerLayerTwoPresent
      ? (30n * sessionPrice) / 1000n
      : 0n;

    const workshopFee =
      sessionPrice - (psychFee + partnerLayerOneFee + partnerLayerTwoFee);

    const inputs = params.inputs;
    const therapistInputIndex = inputs.findIndex((input) =>
      input.assets.some((a) => a.tokenId === this.#contract.tokens.registration)
    );
    if (therapistInputIndex < 0) throw new Error("Therapist input not found");

    const therapistInput = inputs[therapistInputIndex];
    inputs.splice(therapistInputIndex, 1); // remove therapist input from inputs

    const tx = new TransactionBuilder(params.height)
      .from(
        new ErgoUnsignedInput(this.box).setContextExtension({ 0: SInt(5) }),
        { ensureInclusion: true }
      )
      .from(therapistInput, { ensureInclusion: true })
      .from(params.inputs)
      .burnTokens(this.sessionToken) // Burn the session token
      .to(
        new OutputBuilder(SAFE_MIN_BOX_VALUE, params.therapist)
          .addTokens({
            tokenId: this.paymentToken.tokenId,
            amount: collateral + psychFee,
          })
          .addNfts(this.#contract.tokens.registration)
      );

    if (isPartnerLayerOnePresent) {
      tx.to(
        new OutputBuilder(
          SAFE_MIN_BOX_VALUE,
          new ErgoTree(this.partnerOne)
        ).addTokens({
          tokenId: this.paymentToken.tokenId,
          amount: partnerLayerOneFee,
        })
      );
    }

    if (isPartnerLayerTwoPresent) {
      tx.to(
        new OutputBuilder(
          SAFE_MIN_BOX_VALUE,
          new ErgoTree(this.partnerTwo)
        ).addTokens({
          tokenId: this.paymentToken.tokenId,
          amount: partnerLayerTwoFee,
        })
      );
    }

    tx.to(
      new OutputBuilder(
        SAFE_MIN_BOX_VALUE,
        DEFAULT_CONTRACT_PARAMS.workshop
      ).addTokens({
        tokenId: this.paymentToken.tokenId,
        amount: workshopFee,
      })
    ).sendChangeTo(params.therapist);

    return this.#setFee(tx, params.fee).build();
  }

  /**
     // Client flags a problem before 15 minutes of the session end.
   **/
  clientEndProblem(params: clientEndProblemParams): ErgoUnsignedTransaction {
    //  * ===== BOX CONTENTS ===== //
    //  * Tokens
    //  * 1. (SessionSingletonId, 1)
    //  * 2. (SigUSDId, SessionPrice + ?Collateral) // If provided by the psychologist.
    //  * Registers
    //  * R4: Int                              sessionStartTimeBlockHeight
    //  * R5: (SigmaProp, SigmaProp)           (clientAddressSigmaProp, psychologistAddressSigmaProp) // Psychologist address is initially the client address before the session is accepted.
    //  * R6: (Coll[Byte], Coll[Byte])         (partnerLayerOneAddressBytes, partnerLayerTwoAddressBytes) // Empty Coll[Byte]() if not present.
    //  * R7: (Boolean, Boolean)               (isSessionAccepted, isSessionProblem) // Both false initially.
    //  * R8: Long                             sessionPrice
    //  * R9: Long                             collateral  // Assume 0 initially.
    //  *
    //  * ==== ACTION ====
    // 6. Session End Tx: Problem
    // Inputs: Session, Client
    // Data Inputs: None
    // Outputs: Session
    // Context Variables: TxType = 6

    let inputs = params.inputs;
    const sessionRegisters = this.box.additionalRegisters;

    const newSessionBox = new OutputBuilder(this.box.value, this.box.ergoTree)
      .addTokens(this.sessionToken) // keep session singleton token

      .setAdditionalRegisters({
        ...sessionRegisters, // override registers // Is it correct?
        R5: SPair(
          SSigmaProp(SGroupElement(this.clientPk)), // keep client pk
          SSigmaProp(SGroupElement(this.therapistPk)) // keep therapist pk
        ),
        R7: SPair(SBool(true), SBool(true)), // (session accepted, session problem),
        R9: SLong(this.collateral), // keep collateral
      });

    const tx = new TransactionBuilder(params.height)
      .from(
        new ErgoUnsignedInput(this.box).setContextExtension({ 0: SInt(6) }),
        { ensureInclusion: true }
      )
      .from(params.inputs, { ensureInclusion: true })
      // .from(inputs)
      .to(newSessionBox)
      .to(
        new OutputBuilder(SAFE_MIN_BOX_VALUE, params.client).addTokens({
          tokenId: this.#contract.tokens.registration,
          amount: 1n,
        })
      )
      .sendChangeTo(params.client);

    return this.#setFee(tx, params.fee).build();
  }

  /**
     // Admin makes a choice: psychologist bad.
   **/
  psychBad(params: serviceBadParams): ErgoUnsignedTransaction {
    /**
     * ===== BOX CONTENTS ===== //
     * Tokens
     * 1. (SessionSingletonId, 1)
     * 2. (SigUSDId, SessionPrice + ?Collateral) // If provided by the psychologist.
     * Registers
     * R4: Int                              sessionStartTimeBlockHeight
     * R5: (SigmaProp, SigmaProp)           (clientAddressSigmaProp, psychologistAddressSigmaProp) // Psychologist address is initially the client address before the session is accepted.
     * R6: (Coll[Byte], Coll[Byte])         (partnerLayerOneAddressBytes, partnerLayerTwoAddressBytes) // Empty Coll[Byte]() if not present.
     * R7: (Boolean, Boolean)               (isSessionAccepted, isSessionProblem) // Both false initially.
     * R8: Long                             sessionPrice
     * R9: Long                             collateral  // Assume 0 initially.
     *
     * ==== ACTION ====
      // 7. Session End Tx: Psychologist Bad
      // Inputs: Session, Admin
      // Data Inputs: None
      // Outputs: Client, PsyWorkshopFee
      // Context Variables: TxType = 7
      // **/

    let inputs = params.inputs;
    const clientAddress = ErgoAddress.fromPublicKey(this.clientPk);
    const therapistAddress = ErgoAddress.fromPublicKey(this.therapistPk);
    const adminAddress = DEFAULT_CONTRACT_PARAMS.admin;

    const tx = new TransactionBuilder(params.height)
      .from(
        new ErgoUnsignedInput(this.box).setContextExtension({ 0: SInt(9) }),
        { ensureInclusion: true }
      )
      // .from(therapistInput, { ensureInclusion: true })
      .from(inputs)
      .burnTokens(this.sessionToken) // Burn the session token
      .to(
        new OutputBuilder(SAFE_MIN_BOX_VALUE, clientAddress).addTokens({
          tokenId: this.paymentToken.tokenId,
          amount: this.price,
        })
      )
      .to(
        new OutputBuilder(SAFE_MIN_BOX_VALUE, therapistAddress).addTokens({
          tokenId: this.paymentToken.tokenId,
          amount: this.collateral / 2n,
        })
      )
      .sendChangeTo(params.admin);

    return this.#setFee(tx, params.fee).build();
  }

  /**
     // Admin makes a choice: client bad.
   **/
  clientBad(params: serviceBadParams): ErgoUnsignedTransaction {
    /**
     * ===== BOX CONTENTS ===== //
     * Tokens
     * 1. (SessionSingletonId, 1)
     * 2. (SigUSDId, SessionPrice + ?Collateral) // If provided by the psychologist.
     * Registers
     * R4: Int                              sessionStartTimeBlockHeight
     * R5: (SigmaProp, SigmaProp)           (clientAddressSigmaProp, psychologistAddressSigmaProp) // Psychologist address is initially the client address before the session is accepted.
     * R6: (Coll[Byte], Coll[Byte])         (partnerLayerOneAddressBytes, partnerLayerTwoAddressBytes) // Empty Coll[Byte]() if not present.
     * R7: (Boolean, Boolean)               (isSessionAccepted, isSessionProblem) // Both false initially.
     * R8: Long                             sessionPrice
     * R9: Long                             collateral  // Assume 0 initially.
     *
     * ==== ACTION ====
     // 8. Session End Tx: Client Bad
    // Inputs: Session, Admin
    // Data Inputs: None
    // Outputs: Psychologist, ?PartnerLayerOneFee, ?PartnerLayerTwoFee, PsyWorkshopFee
    // Context Variables: TxType = 8
     */

    let inputs = params.inputs;
    const clientAddress = ErgoAddress.fromPublicKey(this.clientPk);
    const therapistAddress = ErgoAddress.fromPublicKey(this.therapistPk);
    const adminAddress = DEFAULT_CONTRACT_PARAMS.admin;

    const tx = new TransactionBuilder(params.height)
      .from(
        new ErgoUnsignedInput(this.box).setContextExtension({ 0: SInt(9) }),
        { ensureInclusion: true }
      )
      // .from(therapistInput, { ensureInclusion: true })
      .from(inputs)
      .burnTokens(this.sessionToken) // Burn the session token
      .to(
        new OutputBuilder(SAFE_MIN_BOX_VALUE, clientAddress).addTokens({
          tokenId: this.paymentToken.tokenId,
          amount: this.price,
        })
      )
      .to(
        new OutputBuilder(SAFE_MIN_BOX_VALUE, therapistAddress).addTokens({
          tokenId: this.paymentToken.tokenId,
          amount: this.collateral / 2n,
        })
      )
      .sendChangeTo(params.admin);

    return this.#setFee(tx, params.fee).build();
  }

  /**
     // Admin makes a choice: service bad.
   **/
  serviceBad(params: serviceBadParams): ErgoUnsignedTransaction {
    /**
     * ===== BOX CONTENTS ===== //
     * Tokens
     * 1. (SessionSingletonId, 1)
     * 2. (SigUSDId, SessionPrice + ?Collateral) // If provided by the psychologist.
     * Registers
     * R4: Int                              sessionStartTimeBlockHeight
     * R5: (SigmaProp, SigmaProp)           (clientAddressSigmaProp, psychologistAddressSigmaProp) // Psychologist address is initially the client address before the session is accepted.
     * R6: (Coll[Byte], Coll[Byte])         (partnerLayerOneAddressBytes, partnerLayerTwoAddressBytes) // Empty Coll[Byte]() if not present.
     * R7: (Boolean, Boolean)               (isSessionAccepted, isSessionProblem) // Both false initially.
     * R8: Long                             sessionPrice
     * R9: Long                             collateral  // Assume 0 initially.
     *
     * ==== ACTION ====
     // 9. Session End Tx: Psyworkshop Bad
    // Inputs: Session, Admin
    // Data Inputs: None
    // Outputs: Client, Psychologist
    // Context Variables: TxType = 9
     */

    let inputs = params.inputs;
    const clientAddress = ErgoAddress.fromPublicKey(this.clientPk);
    const therapistAddress = ErgoAddress.fromPublicKey(this.therapistPk);
    const adminAddress = DEFAULT_CONTRACT_PARAMS.admin;

    const tx = new TransactionBuilder(params.height)
      .from(
        new ErgoUnsignedInput(this.box).setContextExtension({ 0: SInt(9) }),
        { ensureInclusion: true }
      )
      // .from(therapistInput, { ensureInclusion: true })
      .from(inputs)
      .burnTokens(this.sessionToken) // Burn the session token
      .to(
        new OutputBuilder(SAFE_MIN_BOX_VALUE, clientAddress).addTokens({
          tokenId: this.paymentToken.tokenId,
          amount: this.price,
        })
      )
      .to(
        new OutputBuilder(SAFE_MIN_BOX_VALUE, therapistAddress).addTokens({
          tokenId: this.paymentToken.tokenId,
          amount: this.collateral / 2n,
        })
      )
      .sendChangeTo(params.admin);

    return this.#setFee(tx, params.fee).build();
  }

  #setFee(builder: TransactionBuilder, amount?: bigint): TransactionBuilder {
    return builder.payFee(amount || RECOMMENDED_MIN_FEE_VALUE);
  }
}

interface SessionState {
  startHeight: number;
  clientPk: Uint8Array;
  therapistPk: Uint8Array;
  isSessionAccepted: boolean;
  isSessionProblem: boolean;
  price: bigint;
  collateral: bigint;
  partnerOne?: Uint8Array;
  partnerTwo?: Uint8Array;
}

export interface ContractParams {
  address: string;
  tokens: {
    payment: string; // ID of the payment token, e.g., SigUSD
    registration: string; // ID of the registration token, e.g., PsychologistPass
  };
  admin: string; // Admin address for the contract
  workshop: string; // Workshop address for the contract
}

interface BaseSessionParams {
  height: number; // Block height at which the session is created
  inputs: Box[]; // Inputs for the session
  fee?: bigint; // Optional fee for the transaction
}

export interface SessionCreateParams extends BaseSessionParams {
  price: bigint;
  client: ErgoAddress;
  startHeight: number;
  partnerOne?: ErgoAddress;
  partnerTwo?: ErgoAddress;
}

export interface CancelSessionParams extends BaseSessionParams {
  client: ErgoAddress; // Client's address
}

export interface AcceptSessionParams extends BaseSessionParams {
  therapist: ErgoAddress; // Psychologist's address
}

export interface PsychCancelParams extends BaseSessionParams {
  client?: ErgoAddress;
  therapist: ErgoAddress;
  workshop?: ErgoAddress;
}

export interface ClientCancelParams extends BaseSessionParams {
  client: ErgoAddress;
  therapist?: ErgoAddress;
  workshop?: ErgoAddress;
}

export interface psychEndNoProblemParams extends BaseSessionParams {
  therapist: ErgoAddress;
  partnerOne?: ErgoAddress;
  partnerTwo?: ErgoAddress;
  workshop?: ErgoAddress;
}

export interface clientEndProblemParams extends BaseSessionParams {
  client: ErgoAddress;
}

export interface serviceBadParams extends BaseSessionParams {
  admin?: ErgoAddress;
  client?: ErgoAddress;
  therapist?: ErgoAddress;
}
