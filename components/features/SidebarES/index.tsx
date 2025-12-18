import Link from "next/link";

import { AppDispatch } from "@/store";
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles.module.scss';
import { showModal } from "@/store/actions/modal";
import { EModalKind, EUserRole } from "@/components/shared/types/types";
import router from "next/router";

import { FaRegCalendarDays, FaUsersViewfinder } from "react-icons/fa6";
import { MdDashboard } from "react-icons/md";
import { RiProfileLine } from "react-icons/ri";
import { FaChalkboardTeacher, FaHistory } from "react-icons/fa";

export default function Sidebar() {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const userData = useSelector(({ user }) => user?.userData);

  const handleBecomeTeacher = () => {
    dispatch(showModal(EModalKind.PathTeacher));
  }

  const handleGoToMain = () => {
    // router.push('/dashboard');
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarInner}>

        <nav className={styles.nav}>
          <Link href="/dashboard" className={styles.navItem}>
            {/* <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.75 18.75V28.75L20 35M20 35L31.25 28.75V18.75M20 35V25M37.5 28.75V15"
                stroke="#161616"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2.5 15L20 5L37.5 15L20 25L2.5 15Z"
                stroke="#161616"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg> */}
            <MdDashboard size={34} color="#3b82f6" />
            <span className={styles.navText} onClick={handleGoToMain}>Dashboard</span>
          </Link>
          {userData?.userRole !== EUserRole.Specialist && (
            <Link href="#" className={styles.navItem}>
              {/* <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.75 18.75V28.75L20 35M20 35L31.25 28.75V18.75M20 35V25M37.5 28.75V15"
                  stroke="#161616"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.5 15L20 5L37.5 15L20 25L2.5 15Z"
                  stroke="#161616"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg> */}
              <FaChalkboardTeacher size={34} color="#3b82f6" />
              <span className={styles.navText} onClick={handleBecomeTeacher}>Become a teacher</span>
            </Link>
          )}

          <Link href="/view_experts/" className={styles.navItem}>
            {/* <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.75 18.75V28.75L20 35M20 35L31.25 28.75V18.75M20 35V25M37.5 28.75V15"
                stroke="#161616"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2.5 15L20 5L37.5 15L20 25L2.5 15Z"
                stroke="#161616"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg> */}
            <FaUsersViewfinder size={34} color="#3b82f6" />
            <span className={styles.navText}>Find Teacher</span>
          </Link>



          {userData?.userRole === EUserRole.Specialist &&
            <Link href="/office" className={styles.navItem}>
              <FaRegCalendarDays size={30} color="#3b82f6" />
              <span className={styles.navText}>Teacher's Calendar</span>
            </Link>
          }

          <Link href="/user_info" className={styles.navItem}>
            <RiProfileLine size={34} color="#3b82f6" />
            <span className={styles.navText}>Profile</span>
          </Link>

          <Link href="/history" className={styles.navItem}>
            <FaHistory size={34} color="#3b82f6" />
            <span className={styles.navText}>Transaction History</span>
          </Link>


        </nav>

        <div className={styles.socials}>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <svg width="33" height="28" viewBox="0 0 33 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* twitter svg */}
            </svg>
          </a>
          <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
            <svg width="38" height="28" viewBox="0 0 38 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* discord svg */}
            </svg>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* instagram svg */}
            </svg>
          </a>
        </div>
      </div>
    </aside>
  );
}
