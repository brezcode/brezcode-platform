'use client'

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import landing pages to avoid SSR issues
const LandingPage = dynamic(() => import('@/components/landing/BrezCodeLanding'), { ssr: false });
const SkinCoachLanding = dynamic(() => import('@/components/landing/SkinCoachLanding'), { ssr: false });
const LeadGenLanding = dynamic(() => import('@/components/landing/LeadGenLanding'), { ssr: false });
const HomePage = dynamic(() => import('@/components/HomePage'), { ssr: false });

export default function Home() {
  const [component, setComponent] = useState<React.JSX.Element | null>(null);

  useEffect(() => {
    const host = window.location.host;
    const path = window.location.pathname;
    const hash = window.location.hash;
    
    console.log('🌐 Next.js: Analyzing request', { host, path, hash });
    
    // Domain-specific routing
    if (host === 'www.brezcode.com' || host === 'brezcode.com') {
      console.log('✅ Next.js: Loading BrezCode Landing Page');
      setComponent(<LandingPage />);
      return;
    }
    
    if (host === 'www.skincoach.ai' || host === 'skincoach.ai') {
      console.log('✅ Next.js: Loading SkinCoach Landing Page'); 
      setComponent(<SkinCoachLanding />);
      return;
    }
    
    if (host === 'www.leadgen.to' || host === 'leadgen.to') {
      console.log('✅ Next.js: Loading LeadGen Landing Page'); 
      setComponent(<LeadGenLanding />);
      return;
    }
    
    // Hash/path overrides
    if (hash === '#/brezcode' || path === '/brezcode') {
      setComponent(<LandingPage />);
      return;
    }
    
    if (hash === '#/skincoach' || path === '/skincoach') {
      setComponent(<SkinCoachLanding />);
      return;
    }
    
    if (hash === '#/leadgen' || path === '/leadgen') {
      setComponent(<LeadGenLanding />);
      return;
    }
    
    // Default
    console.log('✅ Next.js: Loading HomePage (default)');
    setComponent(<HomePage />);
    
  }, []);

  if (!component) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return component;
}