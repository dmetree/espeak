import * as actionTypes from "../../actionTypes";

const initState = {
  blockchain: null,
  showBlockchainSelector: false,
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    // BLOCKCHAIN
    case actionTypes.SET_BLOCKCHAIN:
      return {
        ...state,
        blockchain: action.blockchain,
      };
    case actionTypes.DISCONNECT_BLOCKCHAIN:
      localStorage.removeItem("blockchain");
      return {
        ...state,
        blockchain: null,
      };
    case actionTypes.TOGGLE_BLOCKCHAIN_SELECTOR:
      return {
        ...state,
        showBlockchainSelector: !state.showBlockchainSelector,
      };
    default:
      return state;
  }
};

export default reducer;
