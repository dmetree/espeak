import { C as CSL } from 'lucid-cardano';

async function loadCSL() {
    return CSL;
}

async function getStakeAddress(baseAddress) {
    
    return CSL.RewardAddress.new(
        CSL.NetworkInfo.mainnet().network_id(),
        CSL.BaseAddress.from_address(CSL.Address.from_bech32(baseAddress)).stake_cred()
    ).to_address().to_bech32().toLowerCase()
}

function addressToBech32(address) {
    return CSL.Address.from_bytes(Buffer.from(address, 'hex')).to_bech32();
}

async function connect(wallet) {
    await loadCSL();
    const walletInstance = await window.cardano[wallet.name.toLowerCase()]?.enable();
    return walletInstance;
}

async function signTx(wallet, tx, partial = false) {
    try {
        const walletInstance = await connect(wallet)
        const witnesses = await walletInstance.signTx(tx, partial);
        console.log("Transaction signed witnesses:", witnesses);

        return witnesses;
    }
    catch (err) {
        console.log(err);
        throw new Error(err)
    }
}

async function submitTx(wallet, tx, witnesses) {
    try {
        if (!CSL)
            await loadCSL();

        const walletInstance = await connect(wallet);
        const witnessSet = CSL.TransactionWitnessSet.from_bytes(
            Buffer.from(witnesses, "hex")
        );
        const unsignedTx = CSL.Transaction.from_bytes(Buffer.from(tx, "hex"));
        const signedTx = CSL.Transaction.new(unsignedTx.body(), witnessSet, undefined);
        console.log("Signed Transaction:", signedTx);
        const signedTxHex = Buffer.from(signedTx.to_bytes()).toString("hex");
        console.log("Signed Transaction Hex:", signedTxHex);
        const txHash = await walletInstance.submitTx(signedTxHex);
        console.log("Lesson request transaction tx Hash:", txHash);
        return txHash;
    }
    catch (err) {
        console.log(err);
        throw new Error(err)
    }
}

async function signData(wallet, data) {
    try {
        const walletInstance = await connect(wallet);
        const addresses = await walletInstance.getUsedAddresses();
        const witnesses = await walletInstance.signData(addresses[0], data)
        return { witnesses, rewardAddress: addresses[0] };
    }
    catch (err) {
        console.log(err);
    }
}

const getPubkey = async (addr) => {
    if (!CSL) {
        await loadCSL();
    }
    const address = CSL.Address.from_bech32(addr);
    const baseAddress = CSL.BaseAddress.from_address(address);

    const pubkey = Buffer.from(
        baseAddress.payment_cred().to_keyhash().to_bytes(),
        "hex"
    ).toString("hex");
    return pubkey;
};

export { connect, getStakeAddress, addressToBech32, signTx, signData, loadCSL, getPubkey, submitTx }