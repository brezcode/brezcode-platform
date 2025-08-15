import { Request, Response, NextFunction } from "express";
import { BrandService } from "./brandService";
import { Brand, BrandConfig } from "@shared/brand-schema";

// Extend Request interface to include brand context
declare global {
  namespace Express {
    interface Request {
      brand?: Brand;
      brandConfig?: BrandConfig;
    }
  }
}

// Middleware to resolve brand context from domain/subdomain
export async function brandMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const domain = BrandService.getBrandContext(req);
    
    if (!domain) {
      return next();
    }

    // Get brand and configuration
    const brand = await BrandService.getBrandByDomain(domain);
    if (brand) {
      const brandConfig = await BrandService.getBrandConfig(brand.id);
      
      req.brand = brand;
      req.brandConfig = brandConfig || undefined;
    }

    next();
  } catch (error) {
    console.error('Brand middleware error:', error);
    next(); // Continue without brand context
  }
}

// Middleware to ensure brand context exists (for brand-specific routes)
export function requireBrand(req: Request, res: Response, next: NextFunction) {
  if (!req.brand) {
    return res.status(404).json({ 
      error: 'Brand not found',
      message: 'This domain is not configured for any brand'
    });
  }
  next();
}

// Middleware to provide default brand context if none exists
export async function defaultBrandMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!req.brand) {
    try {
      // Use BrezCode as default brand
      const defaultBrand = await BrandService.getBrandByDomain('brezcode');
      if (defaultBrand) {
        const brandConfig = await BrandService.getBrandConfig(defaultBrand.id);
        req.brand = defaultBrand;
        req.brandConfig = brandConfig || undefined;
      }
    } catch (error) {
      console.error('Default brand middleware error:', error);
    }
  }
  next();
}