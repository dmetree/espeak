import * as actionTypes from "@/store/actionTypes";

const initState = {
  user: {},
  wallet: null,
  showWalletSelector: false,
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.CARDANO_SET_WALLET:
      return {
        ...state,
        wallet: action.wallet,
        user: action.user,
        showWalletSelector: false,
      };
    case actionTypes.CARDANO_DISCONNECT_WALLET:
      localStorage.removeItem("wallet");
      return {
        ...state,
        user: {},
        wallet: null,
      };
    case actionTypes.CARDANO_TOGGLE_WALLET_SELECTOR:
      return {
        ...state,
        showWalletSelector: !state.showWalletSelector,
      };
    default:
      return state;
  }
};

export default reducer;
