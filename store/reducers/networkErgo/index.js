import * as actionTypes from "@/store/actionTypes";

const initState = {
  ergoWalletAddress: "",
  ergoWalletConnected: false,
  ergoWalletName: "None",
  ergoIsMainNet: true,
  ergoBalance: 0,
  sigUsdBalance: 0,
  ergoUsdOracle: 0,
  ergoWalletAssets: [], // Changed to an empty array
  ergoExplorerApiClient: null,
  ergoIsLoading: false,
  ergoIsEyeOpen: false,
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.ERGO_SET_WALLET_ADDRESS:
      return {
        ...state,
        ergoWalletAddress: action.ergoWalletAddress,
      };
    case actionTypes.ERGO_SET_WALLET_CONNECTED:
      return {
        ...state,
        ergoWalletConnected: action.ergoWalletConnected,
      };
    case actionTypes.ERGO_SET_WALLET_NAME:
      return {
        ...state,
        ergoWalletName: action.ergoWalletName,
      };
    case actionTypes.ERGO_SET_IS_MAINNET:
      return {
        ...state,
        ergIsMainNet: action.ergIsMainNet,
      };
    case actionTypes.ERGO_SET_BALANCE:
      return {
        ...state,
        ergoBalance: action.ergoBalance / 1000000000,
      };
    case actionTypes.SIGUSD_SET_BALANCE:
      return {
        ...state,
        sigUsdBalance: action.sigUsdBalance / 100,
      };
    case actionTypes.ERGO_SET_USD_VALUE:
      return {
        ...state,
        ergUSDValue: action.ergUSDValue,
      };
    case actionTypes.ERGO_SET_USD_ORACLE:
      return {
        ...state,
        ergUsdOracle: action.ergUsdOracle,
      };
    case actionTypes.ERGO_SET_WALLET_ASSETS:
      return {
        ...state,
        ergoWalletAssets: action.ergoWalletAssets,
      };
    case actionTypes.ERGO_SET_EXPLORER_API_CLIENT:
      return {
        ...state,
        ergExplorerApiClient: action.ergExplorerApiClient,
      };
    case actionTypes.ERGO_SET_IS_LOADING:
      return {
        ...state,
        ergIsLoading: action.ergIsLoading,
      };
    case actionTypes.ERGO_SET_IS_EYE_OPEN:
      return {
        ...state,
        ergIsEyeOpen: action.ergIsEyeOpen,
      };
    case actionTypes.ERGO_CONNECT_NAUTILUS:
      return {
        ...state,
        ergoWalletAddress: action.ergoWalletAddress,
        ergoWalletConnected: action.ergoWalletConnected,
        ergoWalletName: action.ergoWalletName,
      };
    case actionTypes.ERGO_DISCONNECT:
      return {
        ...state,
        ergoWalletAddress: "",
        ergoWalletConnected: false,
        ergoWalletName: "",
        ergoIsMainNet: true,
        ergoBalance: "0",
        ergoUSDValue: "0",
        ergoUsdOracle: 0,
        ergoWalletAssets: [],
        ergoExplorerApiClient: null,
        ergoIsLoading: false,
        ergoIsEyeOpen: false,
      };
    default:
      return state;
  }
};

export default reducer;
