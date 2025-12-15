import React, { useState } from 'react';
import s from './../landing.module.scss';

const MobileNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={s.mobileNav}>
      <div className={s.mobileNavBar}>
        <div className={s.mobileLogo}>
          <span className={s.brandBlue}>Easy</span>
          <span className={s.brandBlack}>Speak</span>
        </div>
        <div className={s.mobileNavIcons}>
          <button className={s.mobileNavIcon} aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19 19L14.65 14.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            className={s.mobileNavIcon}
            aria-label="Menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className={s.mobileMenu}>
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#contact">Contact us</a>
          <a href="#faqs">FAQs</a>
        </div>
      )}
    </nav>
  );
};

export default MobileNav;

