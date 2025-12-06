import { useCallback, useState, useEffect } from "react";
import { FaWallet } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import NautilusLogo from "@/public/NautilusLogo.png";
import { useDispatch, useSelector } from "react-redux";
import { loadMessages } from "@/components/shared/i18n/translationLoader";

import { selectBlockchain } from "@/store/actions/blockchain";
import Wallet from "../cardanoWallet/Wallet";
import {
  updateErgoBalance,
  updateSigUsdBalance,
  updateErgoUSDValue,
  updateErgoWalletAssets,
  updateErgoWalletMainnet,
  updateErgoWalletAddress,
  updateErgoWalletName,
  updateErgoWalletConnected,
  ergoConnectNautilus,
  ergoDisconnect,
} from "@/store/actions/networkErgo";
import * as actions from "@/store/actions/networkCardano";

import Link from "next/link";
import s from "./walletDrawer.module.scss";

const WalletDrawer = (props) => {
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);
  const supportedWallets = ["eternl", "vespr", "lace"];
  const [connecting, setConnecting] = useState(null);
  const [isNautilusInstalled, setNautilusIsInstalled] = useState(false);
  const dispatch = useDispatch();

  const connectBrowserWallet = async (wallet) => {
    try {
      setConnecting(wallet.name);
      const connectRes = await dispatch(actions.connectWallet(wallet));
      if (connectRes) setConnecting(null);
    } catch (err) {
      setConnecting(null);
    }
  };

  const close = () => {
    dispatch(actions.toggleWalletSelector());
  };

  const walletsList = supportedWallets.map((wallet, i) => (
    <Wallet
      key={i}
      wallet={wallet}
      connectWallet={connectBrowserWallet}
      connecting={connecting}
    />
  ));

  useEffect(() => {
    // Check if wallet is installed
    const walletInstalled =
      typeof window !== "undefined" &&
      typeof window.ergoConnector !== "undefined" &&
      typeof window.ergoConnector.nautilus !== "undefined";

    setNautilusIsInstalled(walletInstalled);
  }, []);

  console.log("isNautilusInstalled: ", isNautilusInstalled);

  const connectNautilus = async () => {
    // ergoConnector.nautilus.disconnect();
    const connected = await ergoConnector.nautilus.connect(); // [!code focus]

    if (connected) {
      const ergo = await ergoConnector.nautilus.getContext();
      const change_address = await ergo.get_change_address();
      const usedAddresses = await ergo.get_used_addresses();

      const uniqueAddresses = [change_address, ...new Set(usedAddresses)];

      const ergBalance = await ergo.get_balance();
      console.log("ergBalance: ", ergBalance);

      const sigUsdBalance = await ergo.get_balance(
        "03faf2cb329f2e90d6d23b58d91bbb6c046aa143261cc21f52fbe2824bfcbf04"
      );

      dispatch(ergoConnectNautilus(uniqueAddresses, true, "nautilus"));
      dispatch(selectBlockchain("ergo"));
      dispatch(actions.toggleWalletSelector());
      dispatch(updateErgoBalance(ergBalance));
      dispatch(updateSigUsdBalance(sigUsdBalance));

      // const ergBalance = await ergo.get_balance();
    } else {
      console.log("Not connected!");
    }
  };

  return (
    <div className={`${s.walletDrawer} ${props.show ? s.show : s.hidden}`}>
      {/* <div className={s.header}>
        <FaWallet className={s.walletIcon} />
        <span>CARDANO wallet</span>
      </div> */}
      <div className={s.walletList}>{walletsList}</div>
      {/* <div className={s.header}>
        <div className={s.titleWrapper}>
          <FaWallet className={s.walletIcon} />
          <span>ERGO wallet </span>
        </div>

        <div>{t.wallet_on_desktop}</div>
      </div> */}

      {/* {isNautilusInstalled ? (
        <div className={s.nautilusBtn}>
          <div className={s.ergoButton} onClick={() => connectNautilus()}>
            <span className={s.ergoIcon}>
              <Image
                alt="img"
                height="30"
                width="30"
                src={NautilusLogo}
                loading="lazy"
              />
            </span>
            <span className={s.walletName}>Nautilus</span>
          </div>
        </div>
      ) : (
        <>
          <Link
            href="https://chromewebstore.google.com/detail/nautilus-wallet/gjlmehlldlphhljhpnlddaodbjjcchai"
            className={s.loginLink}
          >
            {t.no_wallet_download_here}
          </Link>

          <hr />

          <Link href="https://www.youtube.com/watch?v=jktq2jOiSOQ">
            {t.become_psyworker_todo_0_03}
          </Link>
        </>
      )}

      <div>
        If you don't know how to install Nautilus wallet or how to buy sigUSDs,
        you can check out these tutorials or join our community in &nbsp;
        <a href="https://t.me/mindhealer_mentalhealth" target="_blank">
          Telegram
        </a>
        &nbsp;or&nbsp;
        <a href="https://discord.gg/Y99rbqwuvv" target="_blank">
          Discord
        </a>
      </div>
      <div></div> */}

      <div className={s.closeIcon} onClick={close}>
        <IoClose />
      </div>
    </div>
  );
};

export default WalletDrawer;
