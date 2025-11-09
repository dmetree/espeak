import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Button from '@/components/shared/ui/Button';
import s from './landing.module.scss';

import FaqSection from '@/components/pages/role_guest/Landing/ui/faq';
import HeroSection from '@/components/pages/role_guest/Landing/ui/hero';
import FeatureCards from '@/components/pages/role_guest/Landing/ui/feature_cards';
import DiscoverSection from '@/components/pages/role_guest/Landing/ui/discover';
import StepsSection from '@/components/pages/role_guest/Landing/ui/steps';
import ContactSection from '@/components/pages/role_guest/Landing/ui/contact_us';
import BottomCta from '@/components/pages/role_guest/Landing/ui/bottom';

const Landing = () => {

  return (
    <div className={s.landing}>
      <section className={s.hero}>
        <HeroSection />
        <FeatureCards />
      </section>

      <DiscoverSection />

      <StepsSection />

      <ContactSection />

      <FaqSection />

      <BottomCta />
    </div>
  );
}

export default Landing;
