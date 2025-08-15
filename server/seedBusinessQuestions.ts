import { db } from "./db";
import { onboardingQuestions } from "@shared/schema";

export async function seedOnboardingQuestions() {
  console.log("🧠 Seeding business onboarding questions...");

  const questions = [
    {
      questionText: "What is your business name?",
      questionType: "text",
      options: [],
      category: "business_basics",
      order: 1,
      required: true,
      active: true,
    },
    {
      questionText: "What industry best describes your business?",
      questionType: "single_choice",
      options: [
        "E-commerce & Retail",
        "Health & Wellness", 
        "Professional Services",
        "Technology & Software",
        "Education & Training",
        "Real Estate",
        "Food & Beverage",
        "Fashion & Beauty",
        "Finance & Insurance",
        "Consulting",
        "Manufacturing",
        "Other"
      ],
      category: "business_basics",
      order: 2,
      required: true,
      active: true,
    },
    {
      questionText: "What type of business model do you operate?",
      questionType: "single_choice",
      options: ["B2B (Business to Business)", "B2C (Business to Consumer)", "B2B2C (Business to Business to Consumer)", "Marketplace/Platform"],
      category: "business_basics",
      order: 3,
      required: true,
      active: true,
    },
    {
      questionText: "Who is your primary target audience?",
      questionType: "text",
      options: [],
      category: "business_basics",
      order: 4,
      required: true,
      active: true,
    },
    {
      questionText: "What is your current monthly revenue range?",
      questionType: "single_choice",
      options: ["$0 - $1,000", "$1,000 - $5,000", "$5,000 - $10,000", "$10,000 - $50,000", "$50,000 - $100,000", "$100,000+"],
      category: "business_basics",
      order: 5,
      required: false,
      active: true,
    },
    {
      questionText: "How many people are in your team (including yourself)?",
      questionType: "single_choice",
      options: ["Just me (solopreneur)", "2-3 people", "4-10 people", "11-25 people", "26-50 people", "50+ people"],
      category: "business_basics",
      order: 6,
      required: false,
      active: true,
    },
    {
      questionText: "Which marketing channels are you currently using?",
      questionType: "multiple_choice",
      options: [
        "Social Media (Facebook, Instagram, LinkedIn)",
        "Google Ads",
        "Email Marketing",
        "Content Marketing/Blogging",
        "SEO",
        "Influencer Marketing",
        "Referral Programs",
        "Direct Sales",
        "Networking Events",
        "Print/Traditional Advertising",
        "None yet"
      ],
      category: "marketing",
      order: 7,
      required: false,
      active: true,
    },
    {
      questionText: "What are your biggest business challenges right now?",
      questionType: "multiple_choice",
      options: [
        "Generating qualified leads",
        "Converting leads to customers",
        "Customer retention",
        "Brand awareness",
        "Scaling operations",
        "Managing customer service",
        "Creating consistent content",
        "Time management",
        "Competition",
        "Pricing strategy",
        "Team management"
      ],
      category: "operations",
      order: 8,
      required: true,
      active: true,
    },
    {
      questionText: "What are your primary business goals for the next 12 months?",
      questionType: "multiple_choice",
      options: [
        "Increase revenue by 25-50%",
        "Increase revenue by 50-100%",
        "Increase revenue by 100%+",
        "Expand to new markets",
        "Launch new products/services",
        "Improve customer satisfaction",
        "Automate business processes",
        "Build brand recognition",
        "Hire team members",
        "Achieve work-life balance"
      ],
      category: "operations",
      order: 9,
      required: true,
      active: true,
    },
    {
      questionText: "What is your timeline for achieving significant growth?",
      questionType: "single_choice",
      options: ["3 months", "6 months", "1 year", "2+ years"],
      category: "operations",
      order: 10,
      required: true,
      active: true,
    },
    {
      questionText: "What is your monthly marketing budget?",
      questionType: "single_choice",
      options: ["$0 - $500", "$500 - $1,000", "$1,000 - $5,000", "$5,000 - $10,000", "$10,000+"],
      category: "marketing",
      order: 11,
      required: false,
      active: true,
    },
    {
      questionText: "Which business tools are you currently using?",
      questionType: "multiple_choice",
      options: [
        "Email marketing platform (Mailchimp, ConvertKit)",
        "CRM system (Salesforce, HubSpot)",
        "Social media management (Hootsuite, Buffer)",
        "Website builder (WordPress, Squarespace)",
        "E-commerce platform (Shopify, WooCommerce)",
        "Accounting software (QuickBooks, Xero)",
        "Project management (Trello, Asana)",
        "Customer service (Zendesk, Intercom)",
        "Analytics (Google Analytics)",
        "None of the above"
      ],
      category: "operations",
      order: 12,
      required: false,
      active: true,
    },
    {
      questionText: "What makes your business unique compared to competitors?",
      questionType: "text",
      options: [],
      category: "marketing",
      order: 13,
      required: false,
      active: true,
    },
    {
      questionText: "How do customers currently find and contact you?",
      questionType: "multiple_choice",
      options: [
        "Website contact form",
        "Phone calls",
        "Email",
        "Social media messages",
        "In-person visits",
        "Referrals",
        "Online marketplace",
        "Google search",
        "Social media discovery"
      ],
      category: "sales",
      order: 14,
      required: false,
      active: true,
    },
    {
      questionText: "What type of customer service automation would help you most?",
      questionType: "multiple_choice",
      options: [
        "24/7 AI chatbot for common questions",
        "Automated booking/scheduling",
        "Email follow-up sequences",
        "SMS notifications and updates",
        "Social media response automation",
        "Lead qualification and routing",
        "Customer onboarding automation",
        "Feedback and review collection"
      ],
      category: "sales",
      order: 15,
      required: false,
      active: true,
    }
  ];

  try {
    for (const question of questions) {
      // Check if question already exists (by order and category)
      const existing = await db
        .select()
        .from(onboardingQuestions)
        .where(sql`${onboardingQuestions.order} = ${question.order} AND ${onboardingQuestions.category} = ${question.category}`)
        .limit(1);

      if (existing.length === 0) {
        await db.insert(onboardingQuestions).values(question);
        console.log(`✅ Added question: ${question.questionText.substring(0, 50)}...`);
      }
    }

    console.log("✅ Business onboarding questions seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding onboarding questions:", error);
  }
}

// Temporary import fix for SQL template
import { sql } from "drizzle-orm";