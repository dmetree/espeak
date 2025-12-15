import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Button from '@/components/shared/ui/Button';
import s from './landing.module.scss';

import FaqSection from '@/components/pages/Landing/ui/faq';
import HeroSection from '@/components/pages/Landing/ui/hero';
import FeatureCards from '@/components/pages/Landing/ui/feature_cards';
import DiscoverSection from '@/components/pages/Landing/ui/discover';
import StepsSection from '@/components/pages/Landing/ui/steps';
import ContactSection from '@/components/pages/Landing/ui/contact_us';
import BottomCta from '@/components/pages/Landing/ui/bottom';
import Footer from '@/components/pages/Landing/ui/footer';

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
