import * as actionTypes from "@/store/actionTypes";
import { type } from "os";

export const updateErgoBalance = (ergoBalance) => {
  return {
    type: actionTypes.ERGO_SET_BALANCE,
    ergoBalance: ergoBalance,
  };
};

export const updateSigUsdBalance = (sigUsdBalance) => {
  return {
    type: actionTypes.SIGUSD_SET_BALANCE,
    sigUsdBalance: sigUsdBalance,
  };
};

// Action to update ERG USD value
export const updateErgoUSDValue = (usdValue) => {
  return {
    type: actionTypes.ERGO_SET_USD_VALUE,
    usdValue: usdValue,
  };
};

// Action to update wallet assets
export const updateErgoWalletAssets = (assets) => {
  return {
    type: actionTypes.ERGO_SET_WALLET_ASSETS,
    assets: assets,
  };
};

export const updateErgoWalletAddress = (walletAddress) => {
  return {
    type: actionTypes.ERGO_SET_WALLET_ADDRESS,
    ergoWalletAddress: walletAddress,
  };
};

export const updateErgoWalletName = (ergoWalletName) => {
  return {
    type: actionTypes.ERGO_SET_WALLET_NAME,
    ergoWalletName,
  };
};

export const updateErgoWalletConnected = (ergoWalletConnected) => {
  return {
    type: actionTypes.ERGO_SET_WALLET_CONNECTED,
    ergoWalletConnected: ergoWalletConnected,
  };
};

export const updateErgoWalletMainnet = (ergoIsMainNet) => {
  return {
    type: actionTypes.ERGO_SET_IS_MAINNET,
    ergoIsMainNet,
  };
};

export const ergoConnectNautilus = (
  ergoWalletAddress,
  ergoWalletConnected,
  ergoWalletName
) => {
  const walletStorageConf = {
    walletConnected: ergoWalletConnected,
    walletAddress: ergoWalletAddress,
    walletName: ergoWalletName,
  };

  localStorage.setItem("walletConfig", JSON.stringify(walletStorageConf));

  return {
    type: actionTypes.ERGO_CONNECT_NAUTILUS,
    ergoWalletAddress,
    ergoWalletConnected,
    ergoWalletName,
  };
};

export const ergoDisconnect = (walletName) => {
  if (walletName && walletName === "nautilus") {
    ergoConnector!.nautilus!.disconnect();
  }

  localStorage.removeItem("walletConfig");
  sessionStorage.removeItem("uuid");

  return {
    type: actionTypes.ERGO_DISCONNECT,
  };
};
