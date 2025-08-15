import React, { createContext, useContext, ReactNode } from 'react';
import { useBrand } from '@/hooks/useBrand';
import { Brand, BrandConfig } from '@shared/brand-schema';

interface BrandContextType {
  brand?: Pick<Brand, 'id' | 'name' | 'subdomain' | 'customDomain'>;
  config?: BrandConfig;
  isLoading: boolean;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export function BrandProvider({ children }: { children: ReactNode }) {
  const { brand, config, isLoading } = useBrand();

  return (
    <BrandContext.Provider value={{ brand, config, isLoading }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrandContext() {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error('useBrandContext must be used within a BrandProvider');
  }
  return context;
}