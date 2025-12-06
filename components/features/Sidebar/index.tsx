import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ThemeSwitcher from '@/components/features/ThemeSwitcher';
import LocalSwitcher from '@/components/features/LocaleSwitcher';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import { EReqStatus, EUserRole } from '@/components/shared/types/types';
import { useRouter } from 'next/router';
import { throttle } from '@/components/shared/utils/throttleDebounce';

import { iconObj } from './ui/Icons';
import SidebarItem from './ui/SidebarItem/SidebarItem';

import s from "./.module.scss";

const Sidebar = () => {
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = useMemo(() => loadMessages(currentLocale), [currentLocale]);
  const router = useRouter();

  const fbUser = useSelector(({ user }) => user.uid);
  const userRole = useSelector(({ user }) => user?.userData?.userRole);
  const requests = useSelector(({ appointments }) => appointments.myAppointments);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showGuest, setShowGuest] = useState(true);

  const hasUnacceptedDirectRequest = useMemo(() => {
    return requests?.some(
      (req) => req.status === EReqStatus.Open
    );
  }, [requests]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setIsMobile(true);
        setIsSidebarOpen(false);
      } else {
        setIsMobile(false);
        setIsSidebarOpen(false);
      }
    };

    const throttledHandleResize = throttle(handleResize, 200);
    handleResize();
    window.addEventListener('resize', throttledHandleResize);
    return () => window.removeEventListener('resize', throttledHandleResize);
  }, []);

  useEffect(() => {
    if (fbUser) setShowGuest(false);
  }, [fbUser]);

  const handleToggle = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const renderSidebarItem = (icon, title, link, tooltip, showBell = false) => {

    return (
      <div
        onClick={isMobile ? handleToggle : undefined}
        className={`${s.sidebarItemWrap} ${router.pathname === link ? s.sidebarItemWrap_active : ''}`}
      >
        <SidebarItem
          icon={icon}
          title={title}
          linkto={link}
          isActive={router.pathname === link}
          isSidebarOpen={isSidebarOpen}
          sidebarWidth={isMobile ? undefined : isSidebarOpen ? '250px' : '60px'}
          tooltip={tooltip}
          showBell={showBell}
        />
      </div>
    )
  };

  const renderRoleBasedItems = () => {
    if (!fbUser) return null;
    if (userRole === EUserRole.Novice) {
      return (
        <>
          {renderSidebarItem(iconObj.dashboard, t.dashboard, '/dashboard', t.dashboard)}
          {renderSidebarItem(iconObj.requests, t.my_appointments, '/novice_appointments', t.appointments)}
        </>
      );
    }
    if (userRole === EUserRole.Specialist) {
      return (
        <>
          {renderSidebarItem(iconObj.dashboard, t.dashboard, '/dashboard', t.dashboard)}
          {renderSidebarItem(iconObj.partnership, t.office, '/office', t.office, hasUnacceptedDirectRequest)}
          {renderSidebarItem(iconObj.requests, t.psy_requests, '/psy_requests', t.psy_requests)}
          {renderSidebarItem(iconObj.claim_rewards, t.collect_rewards, '/claim_rewards', t.collect_rewards)}
        </>
      );
    }
    return null;
  };

  const renderAdminItems = () => {
    if (fbUser && userRole === EUserRole.Admin) {
      return (
        <>
          {renderSidebarItem(iconObj.requests, t.psy_articles, '/admin/posts_check', t.psy_articles)}
          {renderSidebarItem(iconObj.requests, t.psy_applications, '/admin/job_applications', t.psy_applications)}
          {renderSidebarItem(iconObj.requests, t.session_complaints, '/admin/complaints_check', t.session_complaints)}
          {renderSidebarItem(iconObj.requests, t.create_spec, '/admin/create_spec', t.create_spec)}
        </>
      );
    }
    return null;
  };

  const sidebarClass = isMobile
    ? `${s.sidebar} ${isSidebarOpen ? s.open : s.closed}`
    : `${s.sidebar} ${isSidebarOpen ? s.sidebarOpen : s.sidebarClosed}`;

  return (
    <div className={sidebarClass} style={isMobile ? {
      transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)'
    } : { width: isSidebarOpen ? '250px' : '60px' }}>
      <div className={s.sidenav}>
        <div className={s.guest}>
          <span className={s.basicMenuIcon} onClick={() => setShowGuest(prev => !prev)}>
            &#9776;
          </span>

          {showGuest && (
            <>
              {renderSidebarItem(iconObj.home, t.home, '/', t.home)}
              {renderSidebarItem(iconObj.contract, t.psy_contract, '/contract', t.psy_contract)}
              {renderSidebarItem(iconObj.psychoterapist, t.psychologist, '/psychologist', t.psychologist)}
              {renderSidebarItem(iconObj.rank, t.psy_rank, '/ranks', t.psy_rank)}
              {renderSidebarItem(iconObj.whitepaper, t.whitepaper, '/whitepaper', t.whitepaper)}
              <span className={s.separator}>&#9552;</span>
            </>
          )}

          {renderRoleBasedItems()}
        </div>

        {fbUser && <div className={s.auth}>{renderAdminItems()}</div>}

        <div className={s.settingAndMedia}>
          <div className={`${s.switchersWrap} ${!isSidebarOpen ? s.column : ''}`}>
            <ThemeSwitcher />
            <LocalSwitcher />
          </div>
          <span className={s.separator}><br /></span>
          <div className={s.footer}>
            <div className={`${s.socialmedia} ${!isSidebarOpen ? s.vertical : ''}`}>
              {/* <a href="https://discord.gg/Y99rbqwuvv" target='_blank'>
                    <div className={s.iconContainer}>
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 51 52"
                            xmlns="http://www.w3.org/2000/svg"
                            className={s.discord}
                        >
                            <path d="M40.9488 11.5483C38.1225 10.2049 35.0625 9.22994 31.875 8.6666C31.8471 8.66569 31.8193 8.67104 31.7936 8.68227C31.7679 8.6935 31.7449 8.71034 31.7263 8.7316C31.3438 9.4466 30.8975 10.3783 30.6 11.0933C27.2191 10.5733 23.7809 10.5733 20.4 11.0933C20.1025 10.3566 19.6563 9.4466 19.2525 8.7316C19.2313 8.68827 19.1675 8.6666 19.1038 8.6666C15.9163 9.22994 12.8775 10.2049 10.03 11.5483C10.0088 11.5483 9.98751 11.5699 9.96626 11.5916C4.18626 20.4099 2.5925 28.9899 3.37875 37.4833C3.37875 37.5266 3.4 37.5699 3.4425 37.5916C7.2675 40.4516 10.9438 42.1849 14.5775 43.3333C14.6413 43.3549 14.705 43.3333 14.7263 43.2899C15.5763 42.0983 16.3413 40.8416 17 39.5199C17.0425 39.4333 17 39.3466 16.915 39.3249C15.7038 38.8483 14.5563 38.2849 13.43 37.6349C13.345 37.5916 13.345 37.4616 13.4088 37.3966C13.6425 37.2233 13.8763 37.0283 14.11 36.8549C14.1525 36.8116 14.2163 36.8116 14.2588 36.8333C21.5688 40.2349 29.4525 40.2349 36.6775 36.8333C36.72 36.8116 36.7838 36.8116 36.8263 36.8549C37.06 37.0499 37.2938 37.2233 37.5275 37.4183C37.6125 37.4833 37.6125 37.6133 37.5063 37.6566C36.4013 38.3283 35.2325 38.8699 34.0213 39.3466C33.9363 39.3683 33.915 39.4766 33.9363 39.5416C34.6163 40.8633 35.3813 42.1199 36.21 43.3116C36.2738 43.3333 36.3375 43.3549 36.4013 43.3333C40.0563 42.1849 43.7325 40.4516 47.5575 37.5916C47.6 37.5699 47.6213 37.5266 47.6213 37.4833C48.5563 27.6683 46.07 19.1533 41.0338 11.5916C41.0125 11.5699 40.9913 11.5483 40.9488 11.5483ZM18.105 32.3049C15.9163 32.3049 14.0888 30.2466 14.0888 27.7116C14.0888 25.1766 15.8738 23.1183 18.105 23.1183C20.3575 23.1183 22.1425 25.1983 22.1213 27.7116C22.1213 30.2466 20.3363 32.3049 18.105 32.3049ZM32.9163 32.3049C30.7275 32.3049 28.9 30.2466 28.9 27.7116C28.9 25.1766 30.685 23.1183 32.9163 23.1183C35.1688 23.1183 36.9538 25.1983 36.9325 27.7116C36.9325 30.2466 35.1688 32.3049 32.9163 32.3049Z" />
                        </svg>
                    </div>
                </a> */}
              <a href="https://x.com/PsyWorker" target='_blank'>
                <div className={s.iconContainer}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 45 37"
                    xmlns="http://www.w3.org/2000/svg"
                    className={s.twitter}
                  >
                    <path d="M44.455 4.33333C42.8187 5.09167 41.055 5.59 39.2275 5.82833C41.0975 4.68 42.5425 2.86 43.2225 0.671667C41.4588 1.755 39.5037 2.51333 37.4425 2.94667C35.7637 1.08333 33.405 0 30.7275 0C25.7337 0 21.6537 4.16 21.6537 9.295C21.6537 10.0317 21.7388 10.7467 21.8875 11.4183C14.3225 11.0283 7.58625 7.32333 3.1025 1.71167C2.31625 3.07667 1.87 4.68 1.87 6.37C1.87 9.59833 3.46375 12.4583 5.92875 14.0833C4.42 14.0833 3.0175 13.65 1.785 13V13.065C1.785 17.5717 4.93 21.3417 9.095 22.1867C7.75779 22.5598 6.35395 22.6117 4.99375 22.3383C5.57091 24.1854 6.70127 25.8015 8.22591 26.9597C9.75055 28.1178 11.5928 28.7597 13.4937 28.795C10.2715 31.3959 6.27724 32.8018 2.1675 32.7817C1.445 32.7817 0.7225 32.7383 0 32.6517C4.0375 35.295 8.84 36.8333 13.9825 36.8333C30.7275 36.8333 39.9288 22.6633 39.9288 10.3783C39.9288 9.96667 39.9287 9.57666 39.9075 9.165C41.6925 7.865 43.2225 6.21833 44.455 4.33333Z" />
                  </svg>
                </div>
              </a>
              <a href="https://t.me/mindhealer_mentalhealth" target='_blank'>
                <div className={s.iconContainer}>
                  <svg
                    width="20px"
                    height="20px"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                    className={s.telegram}
                  >
                    <path d="M29.919 6.163l-4.225 19.925c-0.319 1.406-1.15 1.756-2.331 1.094l-6.438-4.744-3.106 2.988c-0.344 0.344-0.631 0.631-1.294 0.631l0.463-6.556 11.931-10.781c0.519-0.462-0.113-0.719-0.806-0.256l-14.75 9.288-6.35-1.988c-1.381-0.431-1.406-1.381 0.288-2.044l24.837-9.569c1.15-0.431 2.156 0.256 1.781 2.013z" />
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div onClick={handleToggle} className={s.toggle}>
          <svg
            className={isSidebarOpen ? s.reverseArrowIcon : s.arrowIcon}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="30"
            height="30"
          >
            <path d="M19,10.5H10.207l2.439-2.439a1.5,1.5,0,0,0-2.121-2.122L6.939,9.525a3.505,3.505,0,0,0,0,4.95l3.586,3.586a1.5,1.5,0,0,0,2.121-2.122L10.207,13.5H19a1.5,1.5,0,0,0,0-3Z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
