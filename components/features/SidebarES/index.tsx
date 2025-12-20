import React, { useMemo, useState } from 'react';
import Link from 'next/link';

import { AppDispatch } from '@/store';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles.module.scss';
import { showModal } from '@/store/actions/modal';
import { EModalKind, EUserRole } from '@/components/shared/types/types';

import { FaRegCalendarDays, FaUsersViewfinder, FaXTwitter } from 'react-icons/fa6';
import { MdDashboard } from 'react-icons/md';
import { RiProfileLine } from 'react-icons/ri';
import { FaChalkboardTeacher, FaTelegramPlane, FaDiscord, FaHistory } from 'react-icons/fa';

export default function SidebarES() {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const userData = useSelector(({ user }) => user?.userData);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleBecomeTeacher = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(showModal(EModalKind.PathTeacher));
  };

  const navItems = useMemo(
    () => [
      {
        href: '/dashboard',
        label: 'Dashboard',
        icon: <MdDashboard size={34} className={styles.navIcon} />,
        show: true,
      },
      {
        href: '#',
        label: 'Become a teacher',
        icon: <FaChalkboardTeacher size={34} className={styles.navIcon} />,
        show: userData?.userRole !== EUserRole.Specialist,
        onClick: handleBecomeTeacher,
      },
      {
        href: '/view_experts/',
        label: 'Find Teacher',
        icon: <FaUsersViewfinder size={34} className={styles.navIcon} />,
        show: true,
      },
      {
        href: '/office',
        label: "Teacher's Calendar",
        icon: <FaRegCalendarDays size={30} className={styles.navIcon} />,
        show: userData?.userRole === EUserRole.Specialist,
      },
      {
        href: '/user_info',
        label: 'Profile',
        icon: <RiProfileLine size={34} className={styles.navIcon} />,
        show: true,
      },
    ],
    [userData?.userRole]
  );

  const sidebarClass = `${styles.sidebar} ${
    isSidebarOpen ? styles.sidebarOpen : styles.sidebarCollapsed
  }`;

  const spacerClass = `${styles.sidebarSpacer} ${
    isSidebarOpen ? styles.sidebarSpacerOpen : styles.sidebarSpacerCollapsed
  }`;

  return (
    <>
      {/* spacer reserves layout width for the fixed sidebar */}
      <div className={spacerClass} aria-hidden />

      <aside className={sidebarClass} aria-label="Sidebar">
        <div className={styles.sidebarInner}>
          <nav className={styles.nav}>
            {navItems
              .filter((item) => item.show)
              .map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={styles.navItem}
                  title={!isSidebarOpen ? item.label : undefined}
                  onClick={item.onClick as any}
                >
                  {item.icon}
                  {isSidebarOpen && <span className={styles.navText}>{item.label}</span>}
                </Link>
              ))}
               <Link href="/history" className={styles.navItem}>
                <FaHistory size={34} color="#3b82f6" />
                  {isSidebarOpen && <span className={styles.navText}>Transaction History</span>}
                </Link>
          </nav>

          <div className={`${styles.socials} ${!isSidebarOpen ? styles.socialsCollapsed : ''}`}>
            <a href="https://x.com/PsyWorker" target="_blank" rel="noopener noreferrer" aria-label="X">
              <FaXTwitter size={22} />
            </a>
            <a href="https://t.me/mindhealer_mentalhealth" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
              <FaTelegramPlane size={22} />
            </a>
            <a href="https://discord.gg/Y99rbqwuvv" target="_blank" rel="noopener noreferrer" aria-label="Discord">
              <FaDiscord size={22} />
            </a>
          </div>

          <button
            type="button"
            className={styles.toggle}
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <svg
              className={isSidebarOpen ? styles.arrowOpen : styles.arrowCollapsed}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="26"
              height="26"
            >
              <path d="M19,10.5H10.207l2.439-2.439a1.5,1.5,0,0,0-2.121-2.122L6.939,9.525a3.505,3.505,0,0,0,0,4.95l3.586,3.586a1.5,1.5,0,0,0,2.121-2.122L10.207,13.5H19a1.5,1.5,0,0,0,0-3Z" />
            </svg>
          </button>
        </div>
      </aside>
    </>
  );
}
