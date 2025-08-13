import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Users, Building, Mail, Copy, Check } from 'lucide-react';

interface EmailTemplate {
  subject: string;
  content: string;
  cta: string;
  personalization: string;
}

const emailTemplates = {
  universal: {
    subject: "Thank you for your interest in our services",
    content: `Dear {firstName},

Thank you for reaching out! We're excited to help you achieve your goals.

Based on your inquiry, here's what we can do for you:

• Personalized consultation to understand your needs
• Customized solution designed for your situation  
• Ongoing support throughout your journey
• Access to our expert team and resources

We believe everyone deserves exceptional service, and we're here to make that happen for you.`,
    cta: "Schedule Your Free Consultation",
    personalization: "{firstName}, {businessType}, {industry}"
  },
  brezcode: {
    subject: "Your personalized health journey starts here",
    content: `Dear {firstName},

Thank you for taking the first step toward better health! Your breast health assessment results are ready.

Based on your assessment, here's your personalized action plan:

• Your current risk level and what it means
• Evidence-based activities to improve your health
• Monthly self-examination reminders and guidance
• Access to our health coaching team

Remember, taking charge of your health is the best investment you can make. We're here to support you every step of the way.`,
    cta: "View Your Health Plan",
    personalization: "{firstName}, {riskLevel}, {healthGoals}, {age}"
  },
  ecommerce: {
    subject: "Your perfect {productCategory} selection awaits",
    content: `Dear {firstName},

Thanks for browsing our {productCategory} collection! We noticed you were looking at some amazing products.

Here's what we've curated just for you:

• {recommendedProduct1} - Perfect for your {useCase}
• {recommendedProduct2} - Customers like you love this one  
• {recommendedProduct3} - Limited time offer, 20% off
• Free shipping on orders over $50

Don't miss out on these handpicked recommendations based on your preferences.`,
    cta: "Shop Your Personalized Selection",
    personalization: "{firstName}, {productCategory}, {useCase}, {browsedProducts}"
  },
  consulting: {
    subject: "Ready to transform your {businessArea}?",
    content: `Dear {firstName},

Thank you for your interest in our {serviceType} consulting services.

Based on our conversation about your {businessChallenge}, here's how we can help:

• Strategic assessment of your current {businessArea}
• Custom action plan with measurable outcomes
• Implementation support from our expert team
• Ongoing coaching to ensure lasting results

We've helped {clientCount}+ businesses achieve similar transformations. You're next.`,
    cta: "Schedule Strategy Session",
    personalization: "{firstName}, {businessArea}, {serviceType}, {businessChallenge}"
  }
};

export function UniversalEmailTemplate() {
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof emailTemplates>('universal');
  const [copied, setCopied] = useState(false);

  const currentTemplate = emailTemplates[selectedTemplate];

  const copyToClipboard = () => {
    const fullEmail = `Subject: ${currentTemplate.subject}\n\n${currentTemplate.content}\n\n[${currentTemplate.cta}]`;
    navigator.clipboard.writeText(fullEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getIconForTemplate = (template: string) => {
    switch (template) {
      case 'universal': return Building;
      case 'brezcode': return Heart;
      case 'ecommerce': return ShoppingCart;
      case 'consulting': return Users;
      default: return Mail;
    }
  };

  const getColorForTemplate = (template: string) => {
    switch (template) {
      case 'universal': return 'blue';
      case 'brezcode': return 'red';
      case 'ecommerce': return 'green';
      case 'consulting': return 'purple';
      default: return 'gray';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Universal Email Template System
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          One template engine that adapts to any business type. 
          Build once, customize everywhere - from health coaching to e-commerce.
        </p>
      </div>

      <Tabs value={selectedTemplate} onValueChange={(value) => setSelectedTemplate(value as keyof typeof emailTemplates)} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          {Object.entries(emailTemplates).map(([key, template]) => {
            const IconComponent = getIconForTemplate(key);
            return (
              <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                <IconComponent className="w-4 h-4" />
                {key === 'universal' ? 'Universal' : 
                 key === 'brezcode' ? 'BrezCode' :
                 key === 'ecommerce' ? 'E-commerce' : 'Consulting'}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {Object.entries(emailTemplates).map(([key, template]) => (
          <TabsContent key={key} value={key}>
            <div className="space-y-6">
              {/* Template Preview */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const IconComponent = getIconForTemplate(key);
                      return <IconComponent className={`w-6 h-6 text-${getColorForTemplate(key)}-600`} />;
                    })()}
                    <div>
                      <CardTitle>{key === 'universal' ? 'Universal Business Template' : 
                                   key === 'brezcode' ? 'Health Coaching (BrezCode)' :
                                   key === 'ecommerce' ? 'E-commerce Template' : 'Consulting Template'}</CardTitle>
                      <p className="text-sm text-gray-600">Personalized email for {key} businesses</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Ready to Use</Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Subject Line</label>
                      <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
                        <p className="text-sm">{template.subject}</p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email Content</label>
                      <div className="mt-1 p-4 bg-gray-50 rounded-lg border">
                        <pre className="text-sm whitespace-pre-wrap font-sans">{template.content}</pre>
                        <div className="mt-4 text-center">
                          <span className={`inline-block px-6 py-2 bg-${getColorForTemplate(key)}-600 text-white rounded-lg`}>
                            {template.cta}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Personalization Variables</label>
                      <div className="mt-1 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800">{template.personalization}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button onClick={copyToClipboard} className="flex items-center gap-2">
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied!' : 'Copy Template'}
                      </Button>
                      <Button variant="outline">
                        Customize Template
                      </Button>
                      <Button variant="outline">
                        Send Test Email
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Feature Explanation */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How This Demonstrates Universal Architecture</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Single Codebase</h4>
              <p className="text-sm text-gray-600 mb-4">
                One email template component handles all business types with conditional content and styling.
              </p>
              
              <h4 className="font-semibold mb-2">Dynamic Personalization</h4>
              <p className="text-sm text-gray-600">
                Variables adapt based on business type - health data for BrezCode, product data for e-commerce.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Shared Infrastructure</h4>
              <p className="text-sm text-gray-600 mb-4">
                Copy functionality, send logic, and template management work across all variations.
              </p>
              
              <h4 className="font-semibold mb-2">Easy Expansion</h4>
              <p className="text-sm text-gray-600">
                Adding new business types means adding new template variations, not rebuilding the system.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}