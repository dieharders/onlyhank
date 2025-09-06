'use-client';

import React from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import ProfileSection from './components/ProfileSection';
import PremiumBanner from './components/PremiumBanner';
import ContentGrid from './components/ContentGrid';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="container">
      <Header />
      <Navigation />
      <ProfileSection />
      <PremiumBanner />
      <ContentGrid />
      <Footer />
    </div>
  );
}
