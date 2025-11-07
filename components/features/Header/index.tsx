import React, { useEffect, useState, useRef, useId } from "react";
import isEqual from "lodash/isEqual";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { logout, loadUserFromLocalStorage, fetchUserData } from '@/store/actions/profile/user';
import { showModal } from '@/store/actions/modal';
import { setEditPost } from "@/store/actions/posts";
import { EModalKind, EUserRole } from '@/components/shared/types';
import { Modal } from "@/components/shared/ui/Modal";
import VideoCall from '@/components/features/chat/features/VideoCall/VideoCall';
import EventRoom from "@/components/features/EventRoom";
import CreatePost from "@/components/features/CreatePost";
import BookSession from "@/components/features/BookSession";
import SpecApplication from '@/components/features/SpecApplication';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import * as actions from "@/store/actions/blockchain";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import WalletsWidget from "@/components/features/Wallets";
import Logo from '@/components/shared/assets/img/PSY_logo.webp';
import Button from "@/components/shared/ui/Button";
import { Icon } from '@/components/shared/ui/Icon/Icon';
// import ExitIcon from '@/components/shared/assets/psy_icons_svg/nav_enter.svg';
// import NotificationIcon from '@/components/shared/assets/psy_icons_svg/sidebar_notifications.svg';

import Menu from './ui/Menu';
import Notifications from './ui/Notifications/index';

import s from "./Header.module.scss";
import MenuItem from "./ui/MenuItem";
import { menuObj } from './ui/Icons';
import FindTherapist from "@/components/features/FindTherapist";
import { setLocale } from "@/store/actions/locale";
import { SUPPORTED_LOCALES } from "@/components/shared/i18n/locales";
import dynamic from "next/dynamic";
import { actionUpdateProfile, } from '@/store/actions/profile/user';
// import { notifications } from "./notifications";
import LangModal from "../LocaleSwitcher/LangModal";
import * as blockChainActions from "@/store/actions/networkCardano";
import { toast, ToastContainer } from 'react-toastify';
import EventPaymentModal from "@/components/pages/role_guest/EventPage/ui/EventPaymentModal";


interface IProps {
  currentHref?: string;
}

const Header = (props: IProps) => {
  const { currentHref } = props;
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const { pathname, asPath } = router;
  const specProfilePage = router.pathname.startsWith('/specialist-profile');
  const ergoWalletConnected = useSelector(({ networkErgo }) => networkErgo.ergoWalletConnected);

  const userUid = useSelector(({ user }) => user.uid);
  const userData = useSelector(({ user }) => user?.userData);
  const userRole = useSelector(({ user }) => user?.userData?.userRole);
  const userAvatar = useSelector(({ user }) => user?.userData?.avatar);
  const userEmail = useSelector(({ user }) => user?.email);

  const [showNav, setShowNav] = useState(false);
  const menuRef = useRef(null);

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


    // {
    //   title: t.book_session,
    //   clickEvent: handleBookSession,
    //   userRole: 'none',
    //   icon: ''
    // },

    // {
    //   title: t.create_post,
    //   clickEvent: writeNewPost,
    //   userRole: EUserRole.Specialist,
    //   icon: ''
    // },

    // {
    //   title: t.news_feed,
    //   clickEvent: goToNewsfeed,
    //   userRole: 'none',
    //   icon: ''
    // },

    {
      title: t.dashboard,
      clickEvent: goToDashboard,
      userRole: 'none',
      icon: ''
    },
    // {
    //   title: t.psy_requests,
    //   clickEvent: goToRequests,
    //   userRole: EUserRole.Specialist,
    //   icon: ''
    // },
    {
      title: t.profile,
      clickEvent: goToProfile,
      userRole: 'none',
      icon: ''
    },
    // {
    //    title: t.study_psychology,
    //    clickEvent: studyPsychology,
    //    userRole: EUserRole.Novice,
    //    icon: ''
    // },
    // {
    //   title: t.become_therapist,
    //   clickEvent: goToBecomeThrapist,
    //   userRole: EUserRole.Novice,
    //   icon: ''
    // },
    // {
    //   title: t.become_partner,
    //   clickEvent: goToBecomePartner,
    //   userRole: 'none',
    //   icon: ''
    // },
    {
      title: t.exit,
      clickEvent: handleLogout,
      userRole: 'none',
      icon: ''
    }
  ];

  useEffect(() => {
    // Check if localStorage is empty
    const uid = localStorage.getItem("userUid");
    const email = localStorage.getItem("userEmail");

    if (uid && !userData) {
      dispatch(loadUserFromLocalStorage());
      dispatch(fetchUserData(userUid));
    }
  }, [userUid, dispatch, userData]);

  const [displayNoToken, setDisplayNoToken] = useState(true);




  return (
    <>
      <header className={s.header}>
        {displayNoToken &&
          <h5 className={s.noToken}>
            <span>{t.no_token} // <span className={s.affiliate} onClick={handleGoToAffiliate}>{t.affiliate_program}</span></span>
            <span onClick={() => setDisplayNoToken(false)} className={s.noToken_cursor}>X</span>
          </h5>}
        <div className={s.wrapper}>
          <span
            className={s.logoBlock}
            onClick={handleRedirect}
          >
            <Image alt="logo" height="30" width="30" className={s.logoPng} src={Logo} loading="lazy" />
            <div className={`${s.logoTitle} ${userUid ? s.displayNone : ''}`}>MindHealer</div>
          </span>



          <div className={s.menuGeneral}>


            {/* <div className={s.authOptions}>
              {!userUid &&
                <Link href="/login" className={s.loginLink}>
                  {t.login}
                </Link>
              }
            </div> */}
            <div className={`${s.menuItem} ${s.supportChat}`}
              onClick={() => goToTelegram()}>
              <MenuItem
                icon={menuObj.supportchat}
                type={'stroke'}
                tooltip={t.support_chat}
              />
              {!userUid && <div className="">{t.support_chat}</div>}
            </div>

            {userUid &&
              <>
                <div className={s.authOptions}>
                  {/* <div
                    className={s.menuItem}
                    onClick={handleBookSessionByNick}>
                    <MenuItem
                      icon={menuObj.search}
                      type={'stroke'}
                      tooltip={'Find Therapist'}
                    />
                  </div> */}
                  {/* Display when notifications are ready */}

                  <div
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
                  </div>
                  <div
                    className={s.menuItem}>
                    <WalletsWidget />
                  </div>
                  <div
                    className={s.menuItem}
                    onClick={() => displayNav()}
                  >
                    {userData?.avatar ?
                      <Image width="50" height="50" src={userData?.avatar} alt="Avatar" className={s.avatarNav} loading="lazy" />
                      :
                      <div className={s.welcomeBlock}>
                        <div className={s.email_name}>
                          {userEmail?.substring(0, 2).charAt(0).toUpperCase()}
                        </div>
                      </div>
                    }
                  </div>
                </div>

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
              </>
            }
            {(!specProfilePage && userUid) && (
              <div className={s.connectWallet}>
                <Button
                  className={s.bookSessionCircle}
                  onClick={handleBookSession}
                  size="s"
                  circle
                >
                  {t.book_session}
                </Button>
              </div>
            )}
            <ToastContainer />
          </div>
        </div>
      </header>
      <Modal
        modalKey={EModalKind.FindSpecialist}>
        <FindTherapist />
      </Modal>

      <Modal
        modalKey={EModalKind.PsyworkerApplication}>
        <SpecApplication />
      </Modal>

      <Modal
        // onClose={clearDraftAppointment}
        modalKey={EModalKind.BookSession}>
        <BookSession />
      </Modal>

      <Modal modalKey={EModalKind.VideoCall}>
        <VideoCall />
      </Modal>

      <Modal modalKey={EModalKind.EventRoom}>
        <EventRoom />
      </Modal>

      <Modal modalKey={EModalKind.CreatePost}>
        <CreatePost />
      </Modal>

      <Modal modalKey={EModalKind.LangModal}>
        <LangModal />
      </Modal>
    </>
  );
};

export default Header;
