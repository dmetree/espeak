import Script from "next/script";
import * as actions from "@/store/actions/networkCardano";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { FaWallet } from "react-icons/fa";
import { MdLogout, MdMenuOpen } from "react-icons/md";
import { VscDebugDisconnect } from "react-icons/vsc";
import Image from "next/image";
import Link from "next/link";

import ErgoIcon from "@/components/shared/ErgoIconModal";
import WalletDrawer from "@/components/features/Wallets/WalletDrawer/walletDrawer";
import BackDrop from "@/components/shared/ui/Backdrop";
import SpinnerXs from "@/components/shared/ui/SpinnerXs";

import { AppDispatch } from "@/store";
import { disconnectBlockchain } from "@/store/actions/blockchain";
import { ergoDisconnect } from "@/store/actions/networkErgo";
import { reduceAddress } from "@/blockchain/ergo/wallet/utils";
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import { getActiveConnector } from "@dcspark/adalib";
import { minifyAddress } from "@/components/shared/utils/helper";

import NautilusLogo from "@/public/NautilusLogo.png";
import walletIcon from "@/components/shared/assets/psy_icons_svg/cardano-logo-svgrepo-com.svg"

import s from "./.module.scss";

const HeaderCardano = () => {
    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const t = loadMessages(currentLocale);
    const router = useRouter();
    const dispatch: AppDispatch = useDispatch<AppDispatch>();

    const selectedBlockchain = useSelector(
        ({ blockchain }) => blockchain.blockchain
    );

    const showWalletSelector = useSelector(
        ({ networkCardano }) => networkCardano.showWalletSelector
    );
    const user = useSelector(({ networkCardano }) => networkCardano.user);
    const wallet = useSelector(({ networkCardano }) => networkCardano.wallet);

    const ergoWalletAddress = useSelector(({ networkErgo }) => networkErgo.ergoWalletAddress);
    const ergoWalletConnected = useSelector(({ networkErgo }) => networkErgo.ergoWalletConnected);
    const ergoWalletName = useSelector(({ networkErgo }) => networkErgo.ergoWalletName);

    const [localStorageWallet, setLocalStorageWallet] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [eternlDapp, setEternlDapp] = useState(false);

    const cardano = typeof window !== "undefined" ? window?.cardano : "";

    useEffect(() => {
        try {
            let wallet = JSON.parse(localStorage.wallet);
        } catch (err) {
            localStorage.removeItem("wallet");
        }
        if (typeof window !== "undefined") {
            setLocalStorageWallet(localStorage.wallet);
        }
    }, [wallet]);

    const enableWalletConnect = useCallback(async () => {
        try {
            await getActiveConnector().disconnect();
            setLocalStorageWallet(null);
            dispatch(actions.disconnectWallet());
        } catch (err) {
            console.log(err);
        }
    }, []);

    useEffect(() => {
        try {
            let wallet = JSON.parse(localStorage.wallet);
        } catch (err) {
            localStorage.removeItem("wallet");
        }
        if (window.cardano && !wallet && localStorage.wallet && !user.address) {
            if (JSON.parse(localStorage.wallet)?.name == "walletconnect") {
                enableWalletConnect();
            } else {
                dispatch(actions.connectWallet(JSON.parse(localStorage.wallet)));
            }
        }
        if (!window.dappWallet && window.initCardanoDAppConnectorBridge) {
            //eternl dapp connector
            // @ts-ignore
            initCardanoDAppConnectorBridge(async (walletApi) => {
                console.log("bridge established");
                if (walletApi.name === "eternl") {
                    window.dappWallet = walletApi;
                    // @ts-ignore
                    window.cardano["eternl"] = walletApi;
                    // @ts-ignore
                    if (!connectedWallet && localStorage.wallet && !user.address) {
                        dispatch(actions.connectWallet(JSON.parse(localStorage.wallet)));
                    }
                }
            });
        }
    }, [cardano, eternlDapp]);

    const toggleWalletPop = () => {
        dispatch(actions.toggleWalletSelector());
    };

    const disconnectCardano = async () => {
        if (JSON.parse(localStorage.wallet)?.name == "walletconnect") {
            await getActiveConnector().disconnect();
        }
        dispatch(actions.disconnectWallet());
        dispatch(disconnectBlockchain());
    };

    const disconectErgo = () => {
        ergoConnector.nautilus.disconnect()
        dispatch(ergoDisconnect(ergoWalletName));
        dispatch(disconnectBlockchain());
    }

    return (
        <>
            <Script
                src="/cardano-dapp-connector-bridge.min.js"
                onLoad={() => setEternlDapp(true)}
            />
            <Script src="https://code.iconify.design/1/1.0.4/iconify.min.js" />

            <div>
                <div className={s.headerContainer}>
                    {/* {selectedBlockchain === "ergo" && <span className={s.blockchainIcon}> <ErgoIcon /> </span>}
                    {selectedBlockchain === "cardano" && <span className={s.blockchainIcon}> </span>} */}
                    <div className={s.leftContainer}>
                        {!wallet && !localStorageWallet && !ergoWalletConnected &&
                            <div className={s.tooltipWrapper}>
                                <div className={s.connectButton} onClick={toggleWalletPop}>
                                    <Image
                                        alt="wallet"
                                        src={walletIcon}
                                        width="40"
                                        height="40"
                                    />
                                    {/* <FaWallet className={s.hWalletIcon} /> */}
                                    <div className={s.connectWalletText}>{t.connect_wallet}</div>
                                </div>
                                {/* <span className={s.tooltip}>{t.wallet_on_desktop}</span> */}
                            </div>
                        }
                        {wallet && localStorageWallet &&
                            <div className={s.blockchainWalletBox}>
                                {localStorageWallet && !user.address ? (
                                    <SpinnerXs />
                                ) : (
                                    <div className={s.blockchainWalletBox}>
                                        <span className={s.walletIcon}>
                                            <img src={wallet.icon} width="26" />
                                        </span>
                                        <span className={s.address}>
                                            {minifyAddress(user.address, 5)}
                                        </span>
                                    </div>
                                )}
                                <div onClick={disconnectCardano} className={s.disconnectButton}>
                                    <VscDebugDisconnect className={s.iconDisconnect} />
                                </div>
                            </div>
                        }
                        {ergoWalletConnected &&
                            <div className={s.blockchainWalletBox}>
                                <span className={s.walletIcon}>
                                    <Image alt="img" height="30" width="30" src={NautilusLogo} loading="lazy" />
                                </span>
                                <span className="">
                                    {ergoWalletAddress && reduceAddress(ergoWalletAddress![0])}
                                </span>
                                <span onClick={disconectErgo} className={s.disconnectButton}>
                                    <VscDebugDisconnect className={s.iconDisconnect} />
                                </span>
                            </div>
                        }
                    </div>
                </div>
                {showWalletSelector ? <BackDrop /> : null}
                <WalletDrawer show={showWalletSelector} />
            </div>
        </>
    );
};

export default HeaderCardano;
