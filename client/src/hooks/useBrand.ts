import { useQuery } from "@tanstack/react-query";
import { Brand, BrandConfig } from "@shared/brand-schema";

interface BrandResponse {
  brand: Pick<Brand, 'id' | 'name' | 'subdomain' | 'customDomain'>;
  config: BrandConfig;
}

export function useBrand() {
  const { data, isLoading, error } = useQuery<BrandResponse>({
    queryKey: ['/api/brand/config'],
    retry: false,
  });

  return {
    brand: data?.brand,
    config: data?.config,
    isLoading,
    error,
  };
}

// Hook for brand-specific translations
export function useBrandTranslations(language: string) {
  const { data: translations, isLoading } = useQuery({
    queryKey: ['/api/brand/translations', language],
    retry: false,
  });

  return {
    translations,
    isLoading,
  };
}