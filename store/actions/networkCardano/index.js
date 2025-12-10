import {
  CARDANO_SET_WALLET,
  CARDANO_DISCONNECT_WALLET,
  CARDANO_TOGGLE_WALLET_SELECTOR,
} from "store/actionTypes";
import * as FluidLib from "@/components/lib";
import { toast } from "react-toastify";

export const connectWallet = (wallet) => {
  return async (dispatch) => {
    try {
      const walletInstance = await FluidLib.Cardano.Wallet.connect(wallet);

      // Some wallets (or brand new wallets) can return an empty array from getUsedAddresses.
      // In that case we fall back to the change address so we still have a base address
      // to display and derive the stake address from.
      let addresses = await walletInstance.getUsedAddresses();
      if (!addresses || !addresses.length) {
        const changeAddress = await walletInstance.getChangeAddress?.();
        if (changeAddress) {
          addresses = [changeAddress];
        }
      }

      let user = {};
      if (addresses && addresses.length) {
        user.address = FluidLib.Cardano.Wallet.addressToBech32(addresses[0]);
      }
      if (user.address)
        user.stakeAddress = await FluidLib.Cardano.Wallet.getStakeAddress(
          user.address
        );
      localStorage.wallet = JSON.stringify(wallet);
      dispatch(setWallet(user, wallet));
      return true;
    } catch (e) {
      toast.error(`Auth Error ${e}`);
      return false;
    }
  };
};

export const signTx = async (wallet, tx) => {
  try {
    return await FluidLib.Cardano.Wallet.signTx(wallet, tx, false);
  } catch (err) {
    console.log(err);
    toast.error(err);
  }
};

export const disconnectWallet = () => {
  return {
    type: CARDANO_DISCONNECT_WALLET,
  };
};

const setWallet = (user, wallet) => {
  return {
    type: CARDANO_SET_WALLET,
    wallet,
    user,
  };
};

export const getWalletDetails = async (wallet) => {
  try {
    const walletInstance = await FluidLib.Cardano.Wallet.connect(wallet);

    const addresses = await walletInstance.getUsedAddresses();

    let address = FluidLib.Cardano.Wallet.addressToBech32(addresses[0]);
    let stakeAddress = await FluidLib.Cardano.Wallet.getStakeAddress(address);
    let utxos = await walletInstance.getUtxos();

    return { utxos, address, stakeAddress, wallet };
  } catch (err) {
    toast.error(err);
  }
};

export const toggleWalletSelector = () => {
  return {
    type: CARDANO_TOGGLE_WALLET_SELECTOR,
  };
};
