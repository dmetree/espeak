import { C as CSL } from 'lucid-cardano';

async function loadCSL() {
    return CSL;
}

async function getStakeAddress(baseAddress) {
    if (!CSL) {
        await loadCSL();
    }
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
        const witnesses = await walletInstance.signTx(tx, partial)
        return witnesses;
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

export { connect, getStakeAddress, addressToBech32, signTx, signData, loadCSL, getPubkey }