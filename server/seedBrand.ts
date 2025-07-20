import { db } from "./db";
import { brands, brandConfigs } from "@shared/brand-schema";
import { BrandService } from "./brandService";

export async function seedDefaultBrand() {
  try {
    // Check if default brand exists
    const existingBrand = await BrandService.getBrandByDomain('brezcode');
    
    if (!existingBrand) {
      console.log('Creating default BrezCode brand...');
      
      // Create default brand
      const [brand] = await db
        .insert(brands)
        .values({
          name: 'BrezCode',
          subdomain: 'brezcode',
          isActive: true,
        })
        .returning();

      // Create default configuration
      const defaultConfig = BrandService.getDefaultBrandConfig();
      await db
        .insert(brandConfigs)
        .values({
          brandId: brand.id,
          ...defaultConfig,
        });
      
      console.log('✅ Default brand created successfully');
      return brand;
    } else {
      console.log('✅ Default brand already exists');
      return existingBrand;
    }
  } catch (error) {
    console.error('Error seeding default brand:', error);
    return null;
  }
}

// Run seed if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDefaultBrand().then(() => {
    console.log('Seeding complete');
    process.exit(0);
  });
}