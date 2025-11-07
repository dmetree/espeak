import SpinnerXs from "@/components/shared/ui/SpinnerXs";
import { useDispatch, useSelector } from "react-redux";
import { selectBlockchain } from "@/store/actions/blockchain";
// import Loading from '@/components/shared/ui/Loader';
import s from "./.module.scss";

const Wallet = (props) => {
  const dispatch = useDispatch();

  const icons = {
    eternl: "/assets/images/wallets/eternl.png",
    gerowallet: "/assets/images/wallets/gero.ico",
    vespr: "/assets/images/wallets/vespr.jpg",
    lace: "/assets/images/wallets/lace.svg",
  };
  const walletNames = {
    eternl: "Eternl",
    gerowallet: "Gero Wallet",
    vespr: "Vespr",
    lace: "Lace",
  };

  const handleConnection = () => {
    props.connectWallet({ name: props.wallet, icon: icons[props.wallet] });
    dispatch(selectBlockchain("cardano"));
  };

  return (
    <div className={s.walletContainer} onClick={() => handleConnection()}>
      <div className={s.iconContainer}>
        <img
          src={icons[props.wallet]}
          alt={props.wallet}
          className={s.walletIcon}
        />
      </div>
      <span className={s.walletName}>{walletNames[props.wallet]}</span>
      {props.connecting === props.wallet ? (
        <div className={s.spinnerContainer}>
          <SpinnerXs />
        </div>
      ) : null}
    </div>
  );
};

export default Wallet;
