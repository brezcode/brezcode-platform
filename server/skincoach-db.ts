import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import * as schema from '../shared/skincoach-schema';

// Configure Neon
neonConfig.fetchConnectionCache = true;

// Database connection
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({ connectionString });
export const skincoachDb = drizzle(pool, { schema });

// Export all tables for easy access
export const {
  skincoachUsers,
  skinAnalysisResults,
  skincoachProducts,
  skincoachAvatars,
  skincoachConversations,
  skincoachTrainingData,
  productRecommendations,
  skinProgressTracking,
  skincoachAdmins,
} = schema;

// Helper function to initialize default data
export async function initializeSkincoachDefaults() {
  try {
    console.log('🔬 Initializing SkinCoach defaults...');

    // Create default AI avatar
    await skincoachDb.insert(skincoachAvatars).values({
      avatar_id: 'dr_sophia_skincare',
      name: 'Dr. Sophia',
      role: 'AI Dermatology Coach',
      personality: {
        empathetic: true,
        professional: true,
        encouraging: true,
        scientificApproach: true,
      },
      expertise: [
        'Dermatological analysis',
        'Skincare routine optimization',
        'Product recommendations',
        'Acne treatment guidance',
        'Anti-aging strategies',
        'Sensitive skin management',
        'Ingredient education',
        'Progress tracking'
      ],
      appearance: {
        hairColor: 'Professional auburn with gentle waves',
        eyeColor: 'Intelligent hazel eyes',
        style: 'Modern dermatologist attire with a warm smile',
        demeanor: 'Confident, caring, and scientifically precise'
      },
      communication_style: 'Evidence-based yet approachable, combines scientific accuracy with empathetic guidance',
      knowledge_base: {
        specialties: [
          'Acne and breakout management',
          'Anti-aging and prevention',
          'Hyperpigmentation treatment',
          'Sensitive skin care',
          'Rosacea management',
          'Skin barrier health',
          'Chemical exfoliation',
          'Retinoid therapy'
        ],
        treatment_approaches: [
          'Gentle, gradual product introduction',
          'Evidence-based ingredient selection',
          'Personalized routine building',
          'Progress monitoring and adjustment'
        ]
      },
      is_active: true,
    }).onConflictDoNothing();

    // Insert sample skincare products
    const sampleProducts = [
      {
        name: 'Gentle Foaming Cleanser',
        brand: 'CeraVe',
        category: 'cleanser',
        price: '14.99',
        description: 'Gentle foaming cleanser with ceramides and hyaluronic acid',
        ingredients: ['Ceramides', 'Hyaluronic Acid', 'Niacinamide'],
        skin_types: ['normal', 'dry', 'sensitive'],
        skin_concerns: ['dryness', 'sensitive skin'],
        budget_category: 'budget',
        rating: '4.5',
        is_recommended: true,
      },
      {
        name: 'Hyaluronic Acid 2% + B5',
        brand: 'The Ordinary',
        category: 'serum',
        price: '8.90',
        description: 'Multi-depth hyaluronic acid serum for intense hydration',
        ingredients: ['Hyaluronic Acid', 'Vitamin B5'],
        skin_types: ['all'],
        skin_concerns: ['dehydration', 'fine lines'],
        budget_category: 'budget',
        rating: '4.3',
        is_recommended: true,
      },
      {
        name: 'CE Ferulic Vitamin C Serum',
        brand: 'SkinCeuticals',
        category: 'serum',
        price: '166.00',
        description: 'Gold-standard vitamin C serum with 15% L-ascorbic acid',
        ingredients: ['15% L-Ascorbic Acid', 'Vitamin E', 'Ferulic Acid'],
        skin_types: ['normal', 'oily', 'combination'],
        skin_concerns: ['dark spots', 'aging', 'dullness'],
        budget_category: 'luxury',
        rating: '4.8',
        is_recommended: true,
      },
      {
        name: 'Daily Moisturizing Lotion',
        brand: 'CeraVe',
        category: 'moisturizer',
        price: '16.99',
        description: '24-hour hydration with MVE technology and ceramides',
        ingredients: ['Ceramides', 'MVE Technology', 'Hyaluronic Acid'],
        skin_types: ['normal', 'dry'],
        skin_concerns: ['dryness', 'barrier repair'],
        budget_category: 'budget',
        rating: '4.6',
        is_recommended: true,
      },
      {
        name: 'Retinol 0.25% in Squalane',
        brand: 'The Ordinary',
        category: 'treatment',
        price: '9.90',
        description: 'Gentle retinol treatment in nourishing squalane base',
        ingredients: ['Retinol 0.25%', 'Squalane'],
        skin_types: ['normal', 'dry', 'combination'],
        skin_concerns: ['aging', 'texture', 'fine lines'],
        budget_category: 'budget',
        rating: '4.4',
        is_recommended: true,
      },
      {
        name: 'Mineral Sunscreen SPF 50',
        brand: 'EltaMD',
        category: 'sunscreen',
        price: '37.00',
        description: 'Broad-spectrum zinc oxide sunscreen for sensitive skin',
        ingredients: ['Zinc Oxide 9%', 'Octinoxate 7.5%', 'Niacinamide'],
        skin_types: ['sensitive', 'normal', 'dry'],
        skin_concerns: ['sun protection', 'sensitive skin'],
        budget_category: 'moderate',
        rating: '4.7',
        is_recommended: true,
      }
    ];

    for (const product of sampleProducts) {
      await skincoachDb.insert(skincoachProducts).values(product).onConflictDoNothing();
    }

    // Create default admin user
    await skincoachDb.insert(skincoachAdmins).values({
      email: 'admin@skincoach.ai',
      name: 'SkinCoach Admin',
      role: 'admin',
      permissions: ['all'],
      is_active: true,
    }).onConflictDoNothing();

    console.log('✅ SkinCoach defaults initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing SkinCoach defaults:', error);
    throw error;
  }
}