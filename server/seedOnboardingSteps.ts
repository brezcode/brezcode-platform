import { db } from "./db";
import { tourSteps } from "@shared/schema";
import { eq } from "drizzle-orm";

// Default onboarding tour steps for AI Training platform
const defaultTourSteps = [
  {
    stepId: 'welcome',
    title: 'Welcome to AI Training!',
    description: 'This quick tour will show you how to train your AI assistant with role-playing scenarios and real-time feedback.',
    targetElement: '.dashboard-header',
    position: 'bottom',
    deviceTypes: ['mobile', 'tablet', 'desktop'],
    order: 1,
    isRequired: true,
    actionType: 'highlight'
  },
  {
    stepId: 'generate-scenario',
    title: 'Generate Training Scenarios',
    description: 'Click these buttons to create realistic customer scenarios. Choose Lead Generation for sales training or Support for customer service training.',
    targetElement: '.mobile-button-grid',
    position: 'bottom',
    deviceTypes: ['mobile', 'tablet', 'desktop'],
    order: 2,
    isRequired: true,
    actionType: 'highlight',
    actionData: { highlight: 'buttons' }
  },
  {
    stepId: 'view-scenarios',
    title: 'View Your Scenarios',
    description: 'Generated scenarios appear here with customer personas, objectives, and difficulty levels. Each scenario is like a mini business case study.',
    targetElement: '.scenario-cards',
    position: 'top',
    deviceTypes: ['mobile', 'tablet', 'desktop'],
    order: 3,
    isRequired: true,
    actionType: 'scroll'
  },
  {
    stepId: 'start-training',
    title: 'Start Training Session',
    description: 'Click "Start Training" to begin role-playing. You\'ll chat with AI customers who challenge you with real business situations.',
    targetElement: '[data-testid="start-training-button"]',
    position: 'top',
    deviceTypes: ['mobile', 'tablet', 'desktop'],
    order: 4,
    isRequired: true,
    actionType: 'click'
  },
  {
    stepId: 'mobile-chat-tips',
    title: 'Mobile Chat Tips',
    description: 'On mobile, use the keyboard to type responses. The AI customer will challenge you with objections, questions, and real scenarios.',
    targetElement: '.chat-interface',
    position: 'top',
    deviceTypes: ['mobile'],
    order: 5,
    isRequired: false,
    actionType: 'highlight'
  },
  {
    stepId: 'performance-tracking',
    title: 'Track Your Performance',
    description: 'After each session, get detailed analytics on empathy, accuracy, and sales effectiveness. Use this feedback to improve.',
    targetElement: '.analytics-tab',
    position: 'bottom',
    deviceTypes: ['mobile', 'tablet', 'desktop'],
    order: 6,
    isRequired: true,
    actionType: 'highlight'
  },
  {
    stepId: 'session-history',
    title: 'Review Past Sessions',
    description: 'All your training conversations are saved here. Review them to see your progress and identify improvement areas.',
    targetElement: '.sessions-tab',
    position: 'bottom',
    deviceTypes: ['mobile', 'tablet', 'desktop'],
    order: 7,
    isRequired: false,
    actionType: 'highlight'
  },
  {
    stepId: 'mobile-optimization',
    title: 'Optimized for Mobile',
    description: 'This platform works great on your phone! You can train anywhere - during commutes, breaks, or whenever you have a few minutes.',
    targetElement: 'body',
    position: 'bottom',
    deviceTypes: ['mobile'],
    order: 8,
    isRequired: false,
    actionType: 'modal'
  },
  {
    stepId: 'ready-to-start',
    title: 'Ready to Get Started!',
    description: 'You\'re all set! Generate your first scenario and start training. Remember: practice makes perfect in customer interactions.',
    targetElement: '.mobile-button-grid',
    position: 'bottom',
    deviceTypes: ['mobile', 'tablet', 'desktop'],
    order: 9,
    isRequired: true,
    actionType: 'highlight'
  }
];

export async function seedOnboardingSteps() {
  try {
    console.log('🌱 Seeding onboarding tour steps...');
    
    // Clear existing steps
    await db.delete(tourSteps);
    
    // Insert new steps
    for (const step of defaultTourSteps) {
      await db.insert(tourSteps).values(step).onConflictDoNothing();
    }
    
    console.log('✅ Onboarding tour steps seeded successfully');
  } catch (error) {
    console.error('❌ Failed to seed onboarding steps:', error);
    throw error;
  }
}

// Export for manual execution
if (require.main === module) {
  seedOnboardingSteps()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}