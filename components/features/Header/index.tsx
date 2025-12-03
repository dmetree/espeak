import React, { useEffect, useState, useRef, useId } from "react";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { logout, loadUserFromLocalStorage, fetchUserData } from '@/store/actions/profile/user';
import { showModal } from '@/store/actions/modal';
import { setEditPost } from "@/store/actions/posts";
import { EModalKind } from '@/components/shared/types/types';
import { Modal } from "@/components/shared/ui/Modal";
import VideoCall from '@/components/features/chat/features/VideoCall/VideoCall';
import EventRoom from "@/components/features/EventRoom";
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import * as actions from "@/store/actions/blockchain";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import Router from "next/router";
import WalletsWidget from "@/components/features/Wallets";
import Button from "@/components/shared/ui/Button";

// import ExitIcon from '@/components/shared/assets/psy_icons_svg/nav_enter.svg';
// import NotificationIcon from '@/components/shared/assets/psy_icons_svg/sidebar_notifications.svg';

import Menu from './ui/Menu';
import Notifications from './ui/Notifications/index';

import s from "./Header.module.scss";
import FindTherapist from "@/components/features/FindTherapist";
import { setLocale } from "@/store/actions/locale";
import { SUPPORTED_LOCALES } from "@/components/shared/i18n/locales";
import { actionUpdateProfile, } from '@/store/actions/profile/user';
// import { notifications } from "./notifications";
import LangModal from "../LocaleSwitcher/LangModal";
import * as blockChainActions from "@/store/actions/networkCardano";
import { toast, ToastContainer } from 'react-toastify';
import Login from "@/components/features/Login";
import SignUp from "@/components/features/SignUp";
import SettingsModal from "@/components/features/Sett";
// import SettingsModal from "@/components/features/Header/SettingsPopup";

import settingsIcon from "@/components/shared/assets/psy_icons_svg/settings.svg"
import BecomeTeacherPath from "@/components/features/PathTeacher";
import BecomeStudentPath from "@/components/features/PathStudent";
import BookSession from "@/components/features/BookSession";


interface IProps {
  currentHref?: string;
}

const Header = (props: IProps) => {
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const specProfilePage = router.pathname.startsWith('/specialist-profile');
  const ergoWalletConnected = useSelector(({ networkErgo }) => networkErgo.ergoWalletConnected);

  const userUid = useSelector(({ user }) => user.uid);
  const userData = useSelector(({ user }) => user?.userData);
  const userRole = useSelector(({ user }) => user?.userData?.userRole);
  const userAvatar = useSelector(({ user }) => user?.userData?.avatar);
  const userEmail = useSelector(({ user }) => user?.email);

  // settings popup
  const [open, setOpen] = useState(false);

  const [showNav, setShowNav] = useState(false);
  const menuRef = useRef(null);

  // New: mobile navigation overlay state
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);

  const [isReturningUser, setIsReturningUser] = useState(true);

  const [showNotifications, setShowNotifications] = useState(false);
  const [displayNotifications, setDisplayNotifications] = useState<any[] | null>(null);
  const notificationsRef = useRef(null);

  useEffect(() => {
    setDisplayNotifications(userData?.notifications)
  }, [userData])


  const handleBookSession = () => {
    if (!ergoWalletConnected) {
      dispatch(blockChainActions.toggleWalletSelector());
      toast.warn(t.connect_your_wallet)
    }
    if (ergoWalletConnected) {
      dispatch(showModal(EModalKind.BookSession));
    }
  };

  const handleRedirect = () => {
    router.push('/');
  };

  const openMobile = () => setMobileOpen(true);
  const closeMobile = () => setMobileOpen(false);

  const openSignUp = () => {
    dispatch(showModal(EModalKind.SignUp));
  }

  const openLogin = () => {
    dispatch(showModal(EModalKind.Login));
  };



  const handleGoToAffiliate = () => {
    router.push('/become_partner');
  }

  const displayNav = () => {
    setShowNav(!showNav)
  }

  const writeNewPost = () => {
    dispatch(setEditPost(false));
    dispatch(showModal(EModalKind.CreatePost));
    setShowNav(!showNav)
  }

  const goToNewsfeed = () => {
    router.replace('/news_feed');
    setShowNav(!showNav)
  }

  const goToDashboard = () => {
    router.replace('/dashboard');
    setShowNav(!showNav)
  };

  const goToRequests = () => {
    router.replace('/psy_requests');
    setShowNav(!showNav)
  };

  const goToProfile = () => {
    router.replace('/edit_profile');
    setShowNav(!showNav)
  }

  const goToBecomeThrapist = () => {
    router.replace('/become_mindhealer');
    setShowNav(!showNav)
  }

  const goToBecomePartner = () => {
    router.replace('/become_partner');
    setShowNav(!showNav)
  }



  const handleLogout = async () => {
    setShowNav(false);

    try {
      await dispatch(logout());
      router.replace('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };


  const handleBookSessionByNick = () => {
    dispatch(showModal(EModalKind.FindSpecialist));
  };

  const displayNotificatonsTab = () => {
    setShowNotifications(!showNotifications)
  }

  const goToTelegram = () => {
    window.open("https://t.me/mindhealer_mentalhealth", "_blank");
  };

  useEffect(() => {
    if (currentLocale !== localStorage.getItem("locale")) {
      dispatch(setLocale(localStorage.getItem("locale") || SUPPORTED_LOCALES[0]));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowNav(false);
      }
    };
    if (showNav) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNav]);

  // Close mobile menu on route change
  useEffect(() => {
    const handleRoute = () => setMobileOpen(false);
    Router.events.on('routeChangeComplete', handleRoute);
    return () => {
      Router.events.off('routeChangeComplete', handleRoute);
    };
  }, []);

  useEffect(() => {

    const handleClickOutsideNotifications = (event: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        if (displayNotifications !== userData?.notifications) {
          dispatch(
            actionUpdateProfile(
              displayNotifications,
              userUid,
              "notifications"
            )
          );
        }
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutsideNotifications);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideNotifications);
    };

  }, [showNotifications]);


  const menuItems = [
    {
      title: t.dashboard,
      clickEvent: goToDashboard,
      userRole: 'none',
      icon: ''
    },
    {
      title: t.profile,
      clickEvent: goToProfile,
      userRole: 'none',
      icon: ''
    },
    {
      title: t.exit,
      clickEvent: handleLogout,
      userRole: 'none',
      icon: ''
    }
  ];

  const openSettings = () => {
    console.log("Open settings")
  }

  useEffect(() => {
    // Check if localStorage is empty
    const uid = localStorage.getItem("userUid");
    const email = localStorage.getItem("userEmail");

    if (uid && !userData) {
      dispatch(loadUserFromLocalStorage());
      dispatch(fetchUserData(userUid));
    }
  }, [userUid, dispatch, userData]);


  return (
    <>
      <header className={s.header}>
        <div className={s.wrapper}>
          <span
            className={s.logoBlock}
            onClick={handleRedirect}
          >
            <div className={`${s.logoTitle}`}>
              <span className={s.brandBlue}>E</span>asy <span className={s.brandCoral}>S</span>peak
            </div>
          </span>

          {!isReturningUser &&
            <nav className={s.navDesktop} aria-label="Primary">
              <Link href="#features" className={s.navLink}>Features</Link>
              <Link href="#how-it-works" className={s.navLink}>How it works</Link>
              <Link href="#contact" className={s.navLink}>Contact us</Link>
              <Link href="#faqs" className={s.navLink}>FAQs</Link>
            </nav>
          }


          <div className={s.rightDesktop}>
            {!userUid && (
              <div className={s.walletArea}>
                <div className={s.walletWidget}>
                  <WalletsWidget />
                </div>
              </div>
            )}

            {!userUid && (
              <div className={s.authButtons}>
                <Button
                  onClick={() => openSignUp()}
                  className={`${s.btn} ${s.btnPrimary}`}
                >
                  Sign up
                </Button>
                <Button
                  onClick={() => openLogin()}
                  className={`${s.btn} ${s.btnOutline}`}
                >
                  Log in
                </Button>



              </div>
            )}

            {userUid && (
              <Link href="/dashboard" className={s.menuItem}>Dashboard</Link>
            )}

            {userUid && (
              <div className={s.authOptions}>
                {/* <div
                    className={s.menuItem}
                    onClick={() => displayNotificatonsTab()}>
                    <MenuItem
                      icon={menuObj.notifications}
                      type={'stroke'}
                      tooltip={t.notifications}
                    />
                    {(userData?.notifications?.length > 0) && (
                      <span className={s.unreadBadge}></span>
                    )}
                  </div> */}
                <div className={s.menuItem}>
                  <WalletsWidget />
                </div>
                {/* <div
                    className={s.menuItem}
                    onClick={() => displayNav()}
                  >
                    {userData?.avatar ? (
                      <Image width="50" height="50" src={userData?.avatar} alt="Avatar" className={s.avatarNav} loading="lazy" />
                    ) : (
                      <div className={s.welcomeBlock}>
                        <div className={s.email_name}>
                          {userEmail?.substring(0, 2).charAt(0).toUpperCase()}
                        </div>
                      </div>
                    )}
                  </div> */}
              </div>
            )}

            <div onClick={() => setOpen(true)} className={s.settings}>
              <Image
                alt="settings"
                src={settingsIcon}
                width="40"
                height="40"
              />
              {t.settings}

            </div>
            {open && <SettingsModal onClose={() => setOpen(false)} />}

            {userUid && (
              <Button className={`${s.btn} ${s.btnOutline}`} onClick={handleLogout}>{t.exit}</Button>
            )}

            {/* Mobile burger */}
            <button className={s.burger} aria-label="Open menu" onClick={openMobile}>
              <span />
              <span />
              <span />
            </button>
          </div>

          {/* Logged-in extras (outside flex so modals can overlay) */}
          {showNotifications && (
            <span ref={notificationsRef} className={s.notificationsModalWarpper}>
              <Notifications
                notifications={displayNotifications}
                setDisplayNotifications={setDisplayNotifications}
              />
            </span>
          )}

          {showNav && (
            <span ref={menuRef} className={s.menuModalWarpper}>
              <Menu
                menuItems={menuItems}
                userRole={userRole}
              />
            </span>
          )}

          <ToastContainer />
        </div>

        {/* Mobile full-screen menu */}
        {mobileOpen && (
          <div className={s.mobileOverlay} role="dialog" aria-modal>
            <div className={s.mobileTopBar}>
              <span className={s.logoBlock} onClick={handleRedirect}>
                <div className={s.logoTitle}>
                  <span className={s.brandBlue}>E</span>asy <span className={s.brandCoral}>S</span>peak
                </div>
              </span>
              <div className={s.mobileIcons}>
                <div className={s.walletWidget}><WalletsWidget /></div>
                <button className={s.close} aria-label="Close menu" onClick={closeMobile}>×</button>
              </div>
            </div>

            <ul className={s.mobileNavList}>
              <li><Link href="#features" onClick={closeMobile}>Features</Link></li>
              <li><Link href="#how-it-works" onClick={closeMobile}>How it works</Link></li>
              <li><Link href="#contact" onClick={closeMobile}>Contact us</Link></li>
              <li><Link href="#faqs" onClick={closeMobile}>FAQs</Link></li>
            </ul>

            <div className={s.mobileButtons}>
              {!userUid ? (
                <>
                  {/* <Link href="/sign_in" className={`${s.btn} ${s.btnPrimary}`}>Sign up</Link>
                  <Link href="/login" className={`${s.btn} ${s.btnOutline}`}>Log in</Link> */}
                  <Button
                    onClick={() => openSignUp()}
                    className={`${s.btn} ${s.btnPrimary}`}
                  >
                    Sign up
                  </Button>
                  <Button
                    onClick={() => openLogin()}
                    className={`${s.btn} ${s.btnOutline}`}
                  >
                    Log in
                  </Button>
                </>
              ) : (
                <Button className={`${s.btn} ${s.btnOutline}`} onClick={handleLogout}>{t.exit}</Button>
              )}
            </div>
          </div>
        )}
      </header>

      <Modal modalKey={EModalKind.SignUp}>
        <SignUp />
      </Modal>

      <Modal modalKey={EModalKind.PathTeacher}>
        <BecomeTeacherPath />
      </Modal>

      <Modal modalKey={EModalKind.PathStudent}>
        <BecomeStudentPath />
      </Modal>

      <Modal modalKey={EModalKind.Login}>
        <Login />
      </Modal>

      <Modal
        // onClose={clearDraftAppointment}
        modalKey={EModalKind.BookSession}>
        <BookSession />
      </Modal>

      <Modal
        modalKey={EModalKind.FindSpecialist}>
        <FindTherapist />
      </Modal>

      <Modal modalKey={EModalKind.VideoCall}>
        <VideoCall />
      </Modal>

      <Modal modalKey={EModalKind.EventRoom}>
        <EventRoom />
      </Modal>

      <Modal modalKey={EModalKind.LangModal}>
        <LangModal />
      </Modal>
    </>
  );
};

export default Header;
