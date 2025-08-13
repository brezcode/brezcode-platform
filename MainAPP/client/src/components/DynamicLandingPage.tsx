import React from 'react';
import { useBrandContext } from './BrandProvider';
import { useTranslation } from './LanguageSelector';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { CheckCircle, Star } from 'lucide-react';

interface DynamicHeroSectionProps {
  className?: string;
}

export function DynamicHeroSection({ className = "" }: DynamicHeroSectionProps) {
  const { config } = useBrandContext();
  const { t } = useTranslation();
  const [, setLocation] = useLocation();

  if (!config) return null;

  return (
    <section className={`py-20 bg-gradient-to-br from-sky-50 to-blue-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            {config.heroHeadline}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            {config.heroSubheadline}
          </p>
          
          {/* Trust Badges */}
          {config.trustBadges && (
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {(config.trustBadges as string[]).map((badge, index) => (
                <div key={index} className="flex items-center space-x-2 bg-white/80 px-4 py-2 rounded-full shadow-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">{badge}</span>
                </div>
              ))}
            </div>
          )}
          
          <Button 
            onClick={() => setLocation('/quiz')}
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            style={{ backgroundColor: config.primaryColor }}
          >
            {config.heroCtaText}
          </Button>
        </div>
      </div>
    </section>
  );
}

export function DynamicHowItWorksSection() {
  const { config } = useBrandContext();

  if (!config?.howItWorksSteps) return null;

  const steps = config.howItWorksSteps as Array<{
    title: string;
    description: string;
    icon: string;
    order: number;
  }>;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get started with your personalized health journey in just a few simple steps
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.sort((a, b) => a.order - b.order).map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">{step.order}</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DynamicFeaturesSection() {
  const { config } = useBrandContext();

  if (!config?.features) return null;

  const features = config.features as Array<{
    title: string;
    description: string;
    icon: string;
    benefits?: string[];
  }>;

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">Powerful Features</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to take control of your health journey
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              
              {feature.benefits && (
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DynamicTestimonialsSection() {
  const { config } = useBrandContext();

  if (!config?.testimonials) return null;

  const testimonials = config.testimonials as Array<{
    name: string;
    role?: string;
    company?: string;
    content: string;
    rating?: number;
    imageUrl?: string;
  }>;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">What Our Users Say</h2>
          {config.reviewCount && config.averageRating && (
            <div className="flex items-center justify-center space-x-2 mb-8">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${i < Math.floor(Number(config.averageRating)) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="text-lg font-semibold">{config.averageRating}</span>
              <span className="text-gray-600">({config.reviewCount} reviews)</span>
            </div>
          )}
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                {testimonial.rating && (
                  <div className="flex items-center space-x-1 mr-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                )}
              </div>
              <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
              <div className="flex items-center">
                {testimonial.imageUrl ? (
                  <img 
                    src={testimonial.imageUrl} 
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                ) : (
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold text-sm">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  {testimonial.role && (
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DynamicPricingSection() {
  const { config } = useBrandContext();
  const [, setLocation] = useLocation();

  if (!config?.pricingTiers) return null;

  const tiers = config.pricingTiers as Array<{
    name: string;
    price: string;
    description: string;
    features: string[];
    ctaText: string;
    popular?: boolean;
  }>;

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that best fits your health journey
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier, index) => (
            <div 
              key={index} 
              className={`bg-white p-8 rounded-2xl shadow-lg relative ${
                tier.popular ? 'ring-2 ring-blue-500 scale-105' : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">{tier.price}</div>
                <p className="text-gray-600">{tier.description}</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                onClick={() => setLocation('/quiz')}
                className={`w-full py-3 ${
                  tier.popular 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
                style={tier.popular ? { backgroundColor: config.primaryColor } : {}}
              >
                {tier.ctaText}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}