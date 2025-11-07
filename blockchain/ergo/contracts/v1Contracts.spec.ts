import { beforeEach, describe, expect, it, vi } from "vitest";
import { v1Contract } from "./v1Contract";
import {
  KeyedMockChainParty,
  MockChain,
  MockChainParty,
  mockUTxO,
} from "@fleet-sdk/mock-chain";
import {
  ErgoAddress,
  RECOMMENDED_MIN_FEE_VALUE,
  SAFE_MIN_BOX_VALUE,
  SBool,
  SByte,
  SColl,
  SGroupElement,
  SInt,
  SLong,
  SSigmaProp,
} from "@fleet-sdk/core";
import { SPair } from "@fleet-sdk/serializer";
import { compile } from "@fleet-sdk/compiler";
import { DEFAULT_CONTRACT_PARAMS, Session } from "./session";

const HEIGHT = 849_741; // Example height, adjust as needed
const ONE_ERG = 1_000_000_000n; // 1 ERG in nanoergs

// Update this constant whenever the contract changes
const CACHED_CONTRACT_ADDRESS = ErgoAddress.fromBase58(
  "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"
);

const SESSION_TOKEN_ID =
  "a85519a2d1fe7a7714e72c3c90f00b672288dfa749aa24baa1866b6fff75099f"; // Example session token ID, it should be randomly generated in practice but we keep it static for convenience in tests

describe("contract actions", () => {
  const chain = new MockChain({ height: HEIGHT });

  // Setup parties
  const therapist = chain.newParty("Therapist");
  const client = chain.newParty("Client");
  const contract = chain.addParty(build(v1Contract), "Contract");
  const workshop = chain.addParty(
    ErgoAddress.fromBase58(DEFAULT_CONTRACT_PARAMS.workshop).ergoTree,
    "Workshop"
  );

  const injectedContractParams = {
    ...DEFAULT_CONTRACT_PARAMS,
    ...{ address: contract.address.encode() },
  };

  // Setup token metadata for improved logging
  chain.assetsMetadata.set("nanoerg", { name: "ERG", decimals: 9 });
  chain.assetsMetadata.set(DEFAULT_CONTRACT_PARAMS.tokens.payment, {
    name: "SigUSD",
    decimals: 2,
  });
  chain.assetsMetadata.set(DEFAULT_CONTRACT_PARAMS.tokens.registration, {
    name: "PsychologistPass",
  });
  chain.assetsMetadata.set(SESSION_TOKEN_ID, { name: "SessionToken" });

  beforeEach(() => chain.reset());

  it("should create and accept a new session", () => {
    client.addBalance({ nanoergs: ONE_ERG, tokens: [paymentToken(100n)] });

    const transaction = Session.create(
      {
        inputs: client.utxos.toArray(),
        client: client.address,
        height: chain.height,
        price: 10n,
        startHeight: chain.height + 1,
      },
      injectedContractParams
    );

    const sessionTokenId = transaction.outputs[0].assets[0].tokenId;

    expect(chain.execute(transaction, { signers: [client] })).toBe(true);

    expect(client.balance).toMatchObject({ tokens: [paymentToken(90n)] });
    expect(contract.balance).toMatchObject({
      tokens: [{ tokenId: sessionTokenId, amount: 1n }, paymentToken(10n)],
    });

    // spend
    therapist.addBalance({
      nanoergs: ONE_ERG,
      tokens: [registrationToken(1n), paymentToken(100n)],
    });

    const sessionBox = contract.utxos.at(0); // Get the session box created by the client

    const unsignedTransaction = new Session(
      sessionBox,
      injectedContractParams
    ).accept({
      inputs: therapist.utxos.toArray(),
      therapist: therapist.address,
      height: chain.height,
      fee: RECOMMENDED_MIN_FEE_VALUE,
    });

    chain.execute(unsignedTransaction, { signers: [therapist] });
  });

  it("should refund the assets to the user", () => {
    client.addBalance({ nanoergs: ONE_ERG });
    const sessionBox = mockSession(contract, client);
    contract.addUTxOs(sessionBox);

    expect(contract.balance).toStrictEqual({
      nanoergs: SAFE_MIN_BOX_VALUE,
      tokens: [sessionToken(1n), paymentToken(10n)],
    });
    expect(client.balance).toStrictEqual({ nanoergs: ONE_ERG, tokens: [] });

    const refundTx = new Session(sessionBox, injectedContractParams).cancel({
      client: client.address,
      inputs: client.utxos.toArray(),
      height: chain.height,
      fee: RECOMMENDED_MIN_FEE_VALUE,
    });

    expect(chain.execute(refundTx, { signers: [client] })).toBe(true);
    expect(client.balance).toStrictEqual({
      nanoergs: ONE_ERG + sessionBox.value - RECOMMENDED_MIN_FEE_VALUE, // should withdrawal the erg value from the request box
      tokens: [paymentToken(sessionBox.assets[1].amount)], // should withdrawal the payment token
    });
  });

  it("should accept a session", () => {
    therapist
      .addBalance({ nanoergs: ONE_ERG, tokens: [registrationToken(1n)] })
      .addBalance({ tokens: [paymentToken(100n)] });

    const sessionBox = mockSession(contract, client);
    contract.addUTxOs(sessionBox);

    const unsignedTransaction = new Session(
      sessionBox,
      injectedContractParams
    ).accept({
      inputs: therapist.utxos.toArray(),
      therapist: therapist.address,
      height: chain.height,
      fee: RECOMMENDED_MIN_FEE_VALUE,
    });

    chain.execute(unsignedTransaction, { signers: [therapist] });

    expect(therapist.balance).toStrictEqual({
      nanoergs: ONE_ERG + SAFE_MIN_BOX_VALUE - RECOMMENDED_MIN_FEE_VALUE,
      tokens: [paymentToken(99n), registrationToken(1n)],
    });

    expect(contract.balance).toStrictEqual({
      nanoergs: SAFE_MIN_BOX_VALUE,
      tokens: [
        sessionToken(1n),
        paymentToken(sessionBox.assets[1].amount + 1n), // should add the collateral to the session payment token
      ],
    });
  });

  it("should be able to be CANCEL by the THERAPIST when 60 blocks have passed since accepted", () => {
    therapist
      .addBalance({ nanoergs: ONE_ERG, tokens: [registrationToken(1n)] })
      .addBalance({ tokens: [paymentToken(1_000n)] });

    const sessionBox = mockSession(contract, client, 100n, chain.height + 100);
    contract.addUTxOs(sessionBox);

    const acceptTx = new Session(sessionBox, injectedContractParams).accept({
      inputs: therapist.utxos.toArray(),
      therapist: therapist.address,
      height: chain.height,
      fee: RECOMMENDED_MIN_FEE_VALUE,
    });

    chain.execute(acceptTx, { signers: [therapist] });
    chain.newBlocks(160); // Jump 60 blocks to simulate time passing and allow the session to be canceled by the therapist

    const unsignedTransaction = new Session(
      contract.utxos.at(0), // Get accepted session box from then chain
      injectedContractParams
    ).psychCancel({
      inputs: therapist.utxos.toArray(),
      therapist: therapist.address,
      height: chain.height,
      fee: RECOMMENDED_MIN_FEE_VALUE,
    });

    chain.execute(unsignedTransaction, { signers: [therapist] });

    expect(therapist.balance).toMatchObject({
      tokens: [
        paymentToken(995n), // lost 5 from the collateral
        registrationToken(1n),
      ],
    });
    expect(client.balance).toMatchObject({ tokens: [paymentToken(100n)] }); // client should get back the session payment amount
    expect(contract.balance).toStrictEqual({ nanoergs: 0n, tokens: [] }); // contract should be empty after the session is canceled
    expect(workshop.balance).toMatchObject({ tokens: [paymentToken(5n)] }); // should receive half of the collateral
  });

  it("should be able to be CANCEL by the CLIENT after accepted", () => {
    client.addBalance({ nanoergs: ONE_ERG });
    therapist
      .addBalance({ nanoergs: ONE_ERG, tokens: [registrationToken(1n)] })
      .addBalance({ tokens: [paymentToken(1_000n)] });

    const sessionBox = mockSession(contract, client, 100n);
    contract.addUTxOs(sessionBox);

    const acceptTx = new Session(sessionBox, injectedContractParams).accept({
      inputs: therapist.utxos.toArray(),
      therapist: therapist.address,
      height: chain.height,
      fee: RECOMMENDED_MIN_FEE_VALUE,
    });

    chain.execute(acceptTx, { signers: [therapist] });

    const unsignedTransaction = new Session(
      contract.utxos.at(0), // Get accepted session box from then chain
      injectedContractParams
    ).clientCancel({
      inputs: client.utxos.toArray(),
      client: client.address,
      height: chain.height,
      fee: RECOMMENDED_MIN_FEE_VALUE,
    });

    chain.execute(unsignedTransaction, { signers: [client] });

    expect(therapist.balance).toMatchObject({
      tokens: [
        paymentToken(1025n), // should get back the collateral plus fees
        registrationToken(1n), // should preserve the registration token
      ],
    });
    expect(client.balance).toMatchObject({ tokens: [paymentToken(50n)] }); // should receive half of the session payment amount
    expect(contract.balance).toStrictEqual({ nanoergs: 0n, tokens: [] }); // contract should be empty after the session is canceled
    expect(workshop.balance).toMatchObject({ tokens: [paymentToken(25n)] }); // should receive half of the fees
  });

  it("should be able to be END the session with NO PROBLEMS by the THERAPIST when X blocks have passed since accepted", () => {
    therapist
      .addBalance({ nanoergs: ONE_ERG, tokens: [registrationToken(1n)] })
      .addBalance({ tokens: [paymentToken(1_000n)] });

    const sessionBox = mockSession(contract, client, 100n);
    contract.addUTxOs(sessionBox);

    const acceptTx = new Session(sessionBox, injectedContractParams).accept({
      inputs: therapist.utxos.toArray(),
      therapist: therapist.address,
      height: chain.height,
      fee: RECOMMENDED_MIN_FEE_VALUE,
    });

    chain.execute(acceptTx, { signers: [therapist] });
    chain.newBlocks(36); // Jump 36 blocks to simulate time passing and allow the session to be finished by the therapist

    const unsignedTransaction = new Session(
      contract.utxos.at(0), // Get accepted session box from then chain
      injectedContractParams
    ).psychEndNoProblem({
      inputs: therapist.utxos.toArray(),
      therapist: therapist.address,
      height: chain.height,
      fee: RECOMMENDED_MIN_FEE_VALUE,
    });

    chain.execute(unsignedTransaction, { signers: [therapist] });

    expect(therapist.balance).toMatchObject({
      tokens: [
        paymentToken(1080n), // should get back the collateral plus 80% of the session payment
        registrationToken(1n), // preserved the registration token
      ],
    });
    expect(contract.balance).toStrictEqual({ nanoergs: 0n, tokens: [] }); // contract should be empty after the session is canceled
    expect(workshop.balance).toMatchObject({ tokens: [paymentToken(20n)] }); // should receive 20% of the session payment
  });

  it("should be able to be END the session with NO PROBLEMS and PARTNERS by the THERAPIST when 38 blocks have passed since accepted", () => {
    therapist
      .addBalance({ nanoergs: ONE_ERG, tokens: [registrationToken(1n)] })
      .addBalance({ tokens: [paymentToken(1_000n)] });

    const partnerOne = chain.newParty("PartnerOne");
    const partnerTwo = chain.newParty("PartnerTwo");

    const sessionBox = mockSession(
      contract,
      client,
      100n,
      chain.height + 1,
      partnerOne,
      partnerTwo
    );
    contract.addUTxOs(sessionBox);

    const acceptTx = new Session(sessionBox, injectedContractParams).accept({
      inputs: therapist.utxos.toArray(),
      therapist: therapist.address,
      height: chain.height,
      fee: RECOMMENDED_MIN_FEE_VALUE,
    });

    chain.execute(acceptTx, { signers: [therapist] });
    chain.newBlocks(38); // Jump 60 blocks to simulate time passing and allow the session to be canceled by the therapist

    const unsignedTransaction = new Session(
      contract.utxos.at(0), // Get accepted session box from then chain
      injectedContractParams
    ).psychEndNoProblem({
      inputs: therapist.utxos.toArray(),
      therapist: therapist.address,
      partnerOne: partnerOne.address,
      partnerTwo: partnerTwo.address,
      height: chain.height,
      fee: RECOMMENDED_MIN_FEE_VALUE,
    });

    chain.execute(unsignedTransaction, { signers: [therapist] });

    expect(therapist.balance).toMatchObject({
      tokens: [
        paymentToken(1080n), // should get back the collateral plus 80% of the session payment
        registrationToken(1n), // preserved the registration token
      ],
    });
    expect(partnerOne.balance).toMatchObject({ tokens: [paymentToken(12n)] });
    expect(partnerTwo.balance).toMatchObject({ tokens: [paymentToken(3n)] });
    expect(workshop.balance).toMatchObject({ tokens: [paymentToken(5n)] }); // should receive 20% of the session payment
    expect(contract.balance).toStrictEqual({ nanoergs: 0n, tokens: [] }); // contract should be empty after the session is canceled
  });
});

function mockSession(
  contract: MockChainParty,
  client: KeyedMockChainParty,
  price = 10n,
  startHeight = HEIGHT,
  partnerOne?: KeyedMockChainParty,
  partnerTwo?: KeyedMockChainParty
) {
  return mockUTxO({
    ergoTree: contract.ergoTree,
    value: SAFE_MIN_BOX_VALUE,
    creationHeight: HEIGHT,
    assets: [sessionToken(1n), paymentToken(price)],
    additionalRegisters: {
      R4: SInt(startHeight).toHex(), // session start height, assume current height
      R5: SPair(
        SSigmaProp(SGroupElement(client.address.getPublicKeys()[0])),
        SSigmaProp(SGroupElement(client.address.getPublicKeys()[0]))
      ).toHex(), // (clientAddressSigmaProp, pyschologistAddressSigmaProp) // Psychologist address is initially the client address before the session is accepted.
      R6: SPair(
        SColl(SByte, partnerOne?.ergoTree ?? []),
        SColl(SByte, partnerTwo?.ergoTree ?? [])
      ).toHex(), // (partnerLayerOneAddressBytes, partnerLayerTwoAddressBytes) // Empty Coll[Byte]() if not present.
      R7: SPair(SBool(false), SBool(false)).toHex(), // (isSessionAccepted, isSessionProblem) // Both false initially.
      R8: SLong(BigInt(price)).toHex(), // session price
      R9: SLong(BigInt(0)).toHex(), // collateral, assume 0 initially
    },
  });
}

function registrationToken(amount: bigint) {
  return { tokenId: DEFAULT_CONTRACT_PARAMS.tokens.registration, amount };
}

function sessionToken(amount: bigint) {
  return { tokenId: SESSION_TOKEN_ID, amount };
}

function paymentToken(amount: bigint) {
  return { tokenId: DEFAULT_CONTRACT_PARAMS.tokens.payment, amount };
}

function build(script: string): string {
  if (process.env.BUILD === "false") {
    console.log("Skipping contract compilation, using cached address.");
    return CACHED_CONTRACT_ADDRESS.ergoTree;
  }

  const { tokens, workshop, admin } = DEFAULT_CONTRACT_PARAMS;
  const adminPk = ErgoAddress.decode(admin).getPublicKeys()[0];
  const workshopErgoTree = ErgoAddress.decode(workshop).ergoTree;
  const tree = compile(script, {
    map: {
      $psyworkshopRegistrationTokenId: SColl(SByte, tokens.registration),
      $psyworkshopFeeAddressBytes: SColl(SByte, workshopErgoTree),
      $psyworkshopAdminSigmaProp: SSigmaProp(SGroupElement(adminPk)),
    },
  });

  console.log("Compiled contract address:");
  console.log(tree.toAddress().encode());

  return tree.toHex();
}
