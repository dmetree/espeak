import {
  SET_BLOCKCHAIN,
  DISCONNECT_BLOCKCHAIN,
  TOGGLE_BLOCKCHAIN_SELECTOR,
} from "store/actionTypes";
import { toast } from "react-toastify";

export const selectBlockchain = (blockchain) => {
  return async (dispatch) => {
    try {
      localStorage.blockchain = JSON.stringify(blockchain);
      dispatch(setBlockchain(blockchain));
      return true;
    } catch (e) {
      toast.error(`Select blockchain err ${e}`);
      return false;
    }
  };
};

export const disconnectBlockchain = () => {
  return {
    type: DISCONNECT_BLOCKCHAIN,
  };
};

const setBlockchain = (blockchain) => {
  return {
    type: SET_BLOCKCHAIN,
    blockchain,
  };
};

export const toggleBlockchainSelector = () => {
  return {
    type: TOGGLE_BLOCKCHAIN_SELECTOR,
  };
};
