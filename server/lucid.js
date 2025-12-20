import {
  Lucid,
  Blockfrost
} from "@lucid-evolution/lucid";

export const getLucid = async (address) => {
  const apiKey = process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY || "";
  const apiUrl = process.env.NEXT_PUBLIC_BLOCKFROST_URL || "";
  const lucid = await Lucid(
    new Blockfrost(apiUrl, apiKey),
    process.env.NEXT_PUBLIC_BLOCKFROST_NETWORK
  );
  const utxos = await lucid.utxosAt(address);
  lucid.selectWallet.fromAddress(address, utxos);
  return lucid;
};

export const getInputUtxoByHash = async (lucid, address, txHash) => {
  const utxos = await lucid.utxosAt(address);
  const inputUtxo = utxos.find((utxo) => utxo.txHash === txHash);
  if (!inputUtxo) {
    throw new Error("Input UTXO not found in " + address + "'s UTXOs");
  }
  console.log("Found input UTXO:", inputUtxo);
  return inputUtxo;
}