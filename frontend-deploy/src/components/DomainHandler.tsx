import { useEffect, useState } from 'react';
import LandingPage from '@/pages/landing';
import SkinCoachLanding from '@/pages/SkinCoachLanding';
import { LeadGenLanding } from '@/pages/LeadGenLanding';
import HomePage from '@/pages/HomePage';

export function DomainHandler() {
  const [component, setComponent] = useState<JSX.Element | null>(null);

  useEffect(() => {
    const host = window.location.host;
    const path = window.location.pathname;
    const hash = window.location.hash;
    
    console.log('🌐 DomainHandler: Analyzing request', { host, path, hash });
    
    // Force domain-specific content based on current domain
    if (host === 'www.brezcode.com' || host === 'brezcode.com') {
      console.log('✅ DomainHandler: Loading BrezCode Landing Page');
      setComponent(<LandingPage />);
      return;
    }
    
    if (host === 'www.skincoach.ai' || host === 'skincoach.ai') {
      console.log('✅ DomainHandler: Loading SkinCoach Landing Page'); 
      setComponent(<SkinCoachLanding />);
      return;
    }
    
    if (host === 'www.leadgen.to' || host === 'leadgen.to') {
      console.log('✅ DomainHandler: Loading LeadGen Landing Page'); 
      setComponent(<LeadGenLanding />);
      return;
    }
    
    // Check if we're being forced to a specific page via hash
    if (hash === '#/brezcode' || path === '/brezcode') {
      console.log('✅ DomainHandler: Hash/path override to BrezCode');
      setComponent(<LandingPage />);
      return;
    }
    
    if (hash === '#/skincoach' || path === '/skincoach') {
      console.log('✅ DomainHandler: Hash/path override to SkinCoach');
      setComponent(<SkinCoachLanding />);
      return;
    }
    
    if (hash === '#/leadgen' || path === '/leadgen') {
      console.log('✅ DomainHandler: Hash/path override to LeadGen');
      setComponent(<LeadGenLanding />);
      return;
    }
    
    // Default to HomePage for other domains (like Replit domain)
    console.log('✅ DomainHandler: Loading HomePage (default)');
    setComponent(<HomePage />);
    
  }, []);

  // Show loading state while determining component
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