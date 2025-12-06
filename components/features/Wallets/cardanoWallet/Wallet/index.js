import SpinnerXs from "@/components/shared/ui/SpinnerXs";
import { useDispatch, useSelector } from "react-redux";
import { selectBlockchain } from "@/store/actions/blockchain";
// import Loading from '@/components/shared/ui/Loader';
import s from "./.module.scss";
import Image from "next/image";
import eternlIcon from "@/components/shared/assets/image_icons/eternl.png";
import vesprIcon from "@/components/shared/assets/image_icons/vespr.jpg";
import laceIcon from "@/components/shared/assets/image_icons/lace.svg";

const Wallet = (props) => {
  const dispatch = useDispatch();

  const icons = {
    eternl: eternlIcon,
    vespr: vesprIcon,
    lace: laceIcon,
  };
  const walletNames = {
    eternl: "Eternl",
    vespr: "Vespr",
    lace: "Lace",
  };

  const handleConnection = () => {
    const icon = icons[props.wallet];
    const iconSrc = typeof icon === "string" ? icon : icon?.src;

    props.connectWallet({ name: props.wallet, icon: iconSrc });
    dispatch(selectBlockchain("cardano"));
  };

  return (
    <div className={s.walletContainer} onClick={() => handleConnection()}>
      <div className={s.iconContainer}>
        <Image
          src={icons[props.wallet]}
          alt={props.wallet}
          className={s.walletIcon}
          width={40}
          height={25}
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
