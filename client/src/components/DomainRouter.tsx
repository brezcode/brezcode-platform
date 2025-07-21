import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';

// Handle domain routing for leadgen.to structure
export function DomainRouter() {
  const [, setLocation] = useLocation();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const host = window.location.host;
    const path = window.location.pathname;
    
    // Handle leadgen.to domain routing
    if (host === 'leadgen.to' || host === 'www.leadgen.to') {
      // If visiting root domain, stay on LeadGen landing page
      if (path === '/' || path === '') {
        return; // Don't redirect, show LeadGen landing
      }
      
      // Check if path starts with brand name
      const pathSegments = path.split('/').filter(Boolean);
      if (pathSegments.length === 0) {
        setLocation('/brezcode');
        return;
      }
      
      // Valid brand paths and core platform routes
      const validBrands = ['brezcode', 'admin']; // Add more brands as needed
      const coreRoutes = ['login', 'business-consultant', 'dashboard', 'user-profile']; // Core platform routes
      
      if (!validBrands.includes(pathSegments[0]) && 
          !coreRoutes.includes(pathSegments[0]) && 
          !pathSegments[0].startsWith('api')) {
        setLocation('/brezcode');
        return;
      }
    }
  }, [setLocation]);

  return null; // This component doesn't render anything
}

// Hook to get current brand from URL
export function useBrandFromPath() {
  const [currentLocation] = useLocation();
  
  const getBrandFromPath = () => {
    const pathSegments = currentLocation.split('/').filter(Boolean);
    
    // If path starts with a brand name, return it
    if (pathSegments.length > 0 && pathSegments[0] !== 'api' && pathSegments[0] !== 'admin') {
      return pathSegments[0];
    }
    
    return 'brezcode'; // Default brand
  };
  
  return getBrandFromPath();
}

// Get the base path for a brand (for navigation)
export function getBrandBasePath(brandName: string = 'brezcode') {
  const host = window.location.host;
  
  // For leadgen.to, use path-based routing
  if (host === 'leadgen.to' || host === 'www.leadgen.to' || host.includes('localhost')) {
    return `/${brandName}`;
  }
  
  // For subdomains, use root path
  return '/';
}