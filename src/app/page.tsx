'use client';

import React, { useState } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import ProfileSection from './components/ProfileSection';
import PremiumBanner from './components/PremiumBanner';
import ContentGrid from './components/ContentGrid';
import Footer from './components/Footer';

export type ContentType = 'photos' | 'videos';

export default function Home() {
  const [activeContent, setActiveContent] = useState<ContentType>('photos');

  return (
    <div className="container">
      <Header />
      <Navigation activeContent={activeContent} onContentChange={setActiveContent} />
      <ProfileSection />
      <PremiumBanner />
      <ContentGrid contentType={activeContent} />
      <Footer />
    </div>
  );
}
