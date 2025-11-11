import Link from "next/link";

import { AppDispatch } from "@/store";
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles.module.scss';
import { showModal } from "@/store/actions/modal";
import { EModalKind } from "@/components/shared/types";

export default function Sidebar() {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const handleBecomeTeacher = () => {
    dispatch(showModal(EModalKind.PathTeacher));
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarInner}>

        <nav className={styles.nav}>
          <Link href="/" className={styles.navItem}>
            <svg
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
            </svg>
            <span className={styles.navText} onClick={handleBecomeTeacher}>Become a teacher</span>
          </Link>

          <Link href="/" className={styles.navItem}>
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M30.7702 14.8438C30.3003 15.3107 29.6649 15.5727 29.0026 15.5727C28.3403 15.5727 27.7048 15.3107 27.235 14.8438L25.1592 12.7681C24.692 12.2983 24.4297 11.6627 24.4297 11.0001C24.4297 10.3375 24.692 9.70189 25.1592 9.23213L29.8577 4.53135C29.867 4.5224 29.8739 4.5113 29.8779 4.49902C29.8818 4.48674 29.8827 4.47368 29.8803 4.46099C29.878 4.4483 29.8726 4.43639 29.8646 4.42631C29.8565 4.41623 29.8461 4.4083 29.8342 4.40322C26.8014 3.10322 22.8694 3.76572 20.3725 6.24463C17.9834 8.61572 17.8475 12.1821 18.7225 15.2946C18.8468 15.737 18.8465 16.2052 18.7216 16.6475C18.5967 17.0897 18.3521 17.4889 18.0147 17.8009L4.99907 29.6876C4.61506 30.0281 4.30475 30.4435 4.08721 30.9083C3.86968 31.3732 3.74952 31.8776 3.73412 32.3905C3.71872 32.9035 3.80841 33.4142 3.99767 33.8913C4.18693 34.3683 4.47176 34.8016 4.83466 35.1645C5.19756 35.5274 5.63085 35.8122 6.10789 36.0015C6.58493 36.1908 7.09564 36.2805 7.60862 36.2651C8.12161 36.2497 8.62602 36.1295 9.09085 35.912C9.55568 35.6944 9.9711 35.3841 10.3116 35.0001L22.3319 21.9532C22.6399 21.6215 23.0324 21.3799 23.4673 21.2542C23.9022 21.1286 24.3631 21.1236 24.8006 21.2399C27.8897 22.0673 31.4053 21.9118 33.7631 19.5845C36.3014 17.0845 36.8491 12.6657 35.6186 10.1368Z"
                stroke="#161616"
                strokeWidth="2"
                strokeMiterlimit="10"
                strokeLinecap="round"
              />
              <path
                d="M7.5 33.75C8.19036 33.75 8.75 33.1904 8.75 32.5C8.75 31.8096 8.19036 31.25 7.5 31.25C6.80964 31.25 6.25 31.8096 6.25 32.5C6.25 33.1904 6.80964 33.75 7.5 33.75Z"
                fill="#161616"
              />
            </svg>
            <span className={styles.navText}>Support</span>
          </Link>

          <Link href="/" className={styles.navItem}>
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M23.75 26.25V29.375C23.75 30.2038 23.4208 30.9987 22.8347 31.5847C22.2487 32.1708 21.4538 32.5 20.625 32.5H8.125C7.2962 32.5 6.50134 32.1708 5.91529 31.5847C5.32924 30.9987 5 30.2038 5 29.375V10.625C5 9.7962 5.32924 9.00134 5.91529 8.41529C6.50134 7.82924 7.2962 7.5 8.125 7.5H20C21.7258 7.5 23.75 8.89922 23.75 10.625V13.75M28.75 26.25L35 20L28.75 13.75M13.75 20H33.75"
                stroke="#161616"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className={styles.navText}>Log out</span>
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
