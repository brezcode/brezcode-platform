import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Save } from 'lucide-react';
import { BrandConfig } from '@shared/brand-schema';

interface BrandConfigFormProps {
  config?: BrandConfig;
  onSave: (config: Partial<BrandConfig>) => void;
  onPreview?: () => void;
}

export function BrandConfigForm({ config, onSave, onPreview }: BrandConfigFormProps) {
  const [formData, setFormData] = useState<Partial<BrandConfig>>(config || {});

  const updateField = (field: keyof BrandConfig, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addArrayItem = (field: keyof BrandConfig, item: any) => {
    const currentArray = (formData[field] as any[]) || [];
    updateField(field, [...currentArray, item]);
  };

  const removeArrayItem = (field: keyof BrandConfig, index: number) => {
    const currentArray = (formData[field] as any[]) || [];
    updateField(field, currentArray.filter((_, i) => i !== index));
  };

  const updateArrayItem = (field: keyof BrandConfig, index: number, item: any) => {
    const currentArray = (formData[field] as any[]) || [];
    const updated = [...currentArray];
    updated[index] = item;
    updateField(field, updated);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Brand Configuration</h1>
        <div className="space-x-2">
          {onPreview && (
            <Button variant="outline" onClick={onPreview}>
              Preview
            </Button>
          )}
          <Button onClick={() => onSave(formData)}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="testimonials">Reviews</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>

        {/* Hero Section */}
        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="heroHeadline">Headline</Label>
                <Input
                  id="heroHeadline"
                  value={formData.heroHeadline || ''}
                  onChange={(e) => updateField('heroHeadline', e.target.value)}
                  placeholder="Transform Your Health Journey with AI"
                />
              </div>
              
              <div>
                <Label htmlFor="heroSubheadline">Subheadline</Label>
                <Textarea
                  id="heroSubheadline"
                  value={formData.heroSubheadline || ''}
                  onChange={(e) => updateField('heroSubheadline', e.target.value)}
                  placeholder="Get personalized health insights and coaching..."
                />
              </div>
              
              <div>
                <Label htmlFor="heroCtaText">CTA Button Text</Label>
                <Input
                  id="heroCtaText"
                  value={formData.heroCtaText || ''}
                  onChange={(e) => updateField('heroCtaText', e.target.value)}
                  placeholder="Start Your Assessment"
                />
              </div>

              <div>
                <Label>Trust Badges</Label>
                {((formData.trustBadges as string[]) || []).map((badge, index) => (
                  <div key={index} className="flex items-center space-x-2 mt-2">
                    <Input
                      value={badge}
                      onChange={(e) => {
                        const badges = [...((formData.trustBadges as string[]) || [])];
                        badges[index] = e.target.value;
                        updateField('trustBadges', badges);
                      }}
                      placeholder="FDA Compliant"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => removeArrayItem('trustBadges', index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => addArrayItem('trustBadges', '')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Trust Badge
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Section */}
        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Features Section</CardTitle>
            </CardHeader>
            <CardContent>
              {((formData.features as any[]) || []).map((feature, index) => (
                <Card key={index} className="mb-4">
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">Feature {index + 1}</h4>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeArrayItem('features', index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <Input
                        value={feature.title || ''}
                        onChange={(e) => updateArrayItem('features', index, { ...feature, title: e.target.value })}
                        placeholder="Feature Title"
                      />
                      <Textarea
                        value={feature.description || ''}
                        onChange={(e) => updateArrayItem('features', index, { ...feature, description: e.target.value })}
                        placeholder="Feature Description"
                      />
                      <Input
                        value={feature.icon || ''}
                        onChange={(e) => updateArrayItem('features', index, { ...feature, icon: e.target.value })}
                        placeholder="Icon name (lucide-react)"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button 
                variant="outline"
                onClick={() => addArrayItem('features', { title: '', description: '', icon: 'check-circle' })}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Feature
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Section */}
        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Tiers</CardTitle>
            </CardHeader>
            <CardContent>
              {((formData.pricingTiers as any[]) || []).map((tier, index) => (
                <Card key={index} className="mb-4">
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">Tier {index + 1}</h4>
                        <div className="space-x-2">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={tier.popular || false}
                              onChange={(e) => updateArrayItem('pricingTiers', index, { ...tier, popular: e.target.checked })}
                            />
                            <span className="text-sm">Popular</span>
                          </label>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeArrayItem('pricingTiers', index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          value={tier.name || ''}
                          onChange={(e) => updateArrayItem('pricingTiers', index, { ...tier, name: e.target.value })}
                          placeholder="Plan Name"
                        />
                        <Input
                          value={tier.price || ''}
                          onChange={(e) => updateArrayItem('pricingTiers', index, { ...tier, price: e.target.value })}
                          placeholder="$19.99"
                        />
                      </div>
                      <Textarea
                        value={tier.description || ''}
                        onChange={(e) => updateArrayItem('pricingTiers', index, { ...tier, description: e.target.value })}
                        placeholder="Plan Description"
                      />
                      <Input
                        value={tier.ctaText || ''}
                        onChange={(e) => updateArrayItem('pricingTiers', index, { ...tier, ctaText: e.target.value })}
                        placeholder="Get Started"
                      />
                      
                      <div>
                        <Label>Features</Label>
                        {(tier.features || []).map((feature: string, featureIndex: number) => (
                          <div key={featureIndex} className="flex items-center space-x-2 mt-2">
                            <Input
                              value={feature}
                              onChange={(e) => {
                                const features = [...(tier.features || [])];
                                features[featureIndex] = e.target.value;
                                updateArrayItem('pricingTiers', index, { ...tier, features });
                              }}
                              placeholder="Feature description"
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                const features = (tier.features || []).filter((_: any, i: number) => i !== featureIndex);
                                updateArrayItem('pricingTiers', index, { ...tier, features });
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => {
                            const features = [...(tier.features || []), ''];
                            updateArrayItem('pricingTiers', index, { ...tier, features });
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Feature
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button 
                variant="outline"
                onClick={() => addArrayItem('pricingTiers', { 
                  name: '', 
                  price: '', 
                  description: '', 
                  features: [], 
                  ctaText: '',
                  popular: false 
                })}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Pricing Tier
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Testimonials Section */}
        <TabsContent value="testimonials">
          <Card>
            <CardHeader>
              <CardTitle>Customer Testimonials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="reviewCount">Review Count</Label>
                  <Input
                    id="reviewCount"
                    value={formData.reviewCount || ''}
                    onChange={(e) => updateField('reviewCount', e.target.value)}
                    placeholder="10,000+"
                  />
                </div>
                <div>
                  <Label htmlFor="averageRating">Average Rating</Label>
                  <Input
                    id="averageRating"
                    value={formData.averageRating || ''}
                    onChange={(e) => updateField('averageRating', e.target.value)}
                    placeholder="4.8"
                  />
                </div>
              </div>

              {((formData.testimonials as any[]) || []).map((testimonial, index) => (
                <Card key={index} className="mb-4">
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">Testimonial {index + 1}</h4>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeArrayItem('testimonials', index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          value={testimonial.name || ''}
                          onChange={(e) => updateArrayItem('testimonials', index, { ...testimonial, name: e.target.value })}
                          placeholder="Customer Name"
                        />
                        <Input
                          value={testimonial.role || ''}
                          onChange={(e) => updateArrayItem('testimonials', index, { ...testimonial, role: e.target.value })}
                          placeholder="Job Title"
                        />
                      </div>
                      <Textarea
                        value={testimonial.content || ''}
                        onChange={(e) => updateArrayItem('testimonials', index, { ...testimonial, content: e.target.value })}
                        placeholder="Customer feedback..."
                      />
                      <Input
                        type="number"
                        min="1"
                        max="5"
                        value={testimonial.rating || ''}
                        onChange={(e) => updateArrayItem('testimonials', index, { ...testimonial, rating: Number(e.target.value) })}
                        placeholder="5"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button 
                variant="outline"
                onClick={() => addArrayItem('testimonials', { name: '', role: '', content: '', rating: 5 })}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Testimonial
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branding Section */}
        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>Brand Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="logoUrl">Logo URL</Label>
                <Input
                  id="logoUrl"
                  value={formData.logoUrl || ''}
                  onChange={(e) => updateField('logoUrl', e.target.value)}
                  placeholder="https://example.com/logo.png"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="primaryColor"
                      value={formData.primaryColor || ''}
                      onChange={(e) => updateField('primaryColor', e.target.value)}
                      placeholder="#0ea5e9"
                    />
                    <input
                      type="color"
                      value={formData.primaryColor || '#0ea5e9'}
                      onChange={(e) => updateField('primaryColor', e.target.value)}
                      className="w-12 h-10 border rounded"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="secondaryColor"
                      value={formData.secondaryColor || ''}
                      onChange={(e) => updateField('secondaryColor', e.target.value)}
                      placeholder="#f59e0b"
                    />
                    <input
                      type="color"
                      value={formData.secondaryColor || '#f59e0b'}
                      onChange={(e) => updateField('secondaryColor', e.target.value)}
                      className="w-12 h-10 border rounded"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="fontFamily">Font Family</Label>
                <select
                  id="fontFamily"
                  value={formData.fontFamily || 'Inter'}
                  onChange={(e) => updateField('fontFamily', e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="Inter">Inter</option>
                  <option value="Poppins">Poppins</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Lato">Lato</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Section */}
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Additional Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="finalCtaHeadline">Final CTA Headline</Label>
                <Input
                  id="finalCtaHeadline"
                  value={formData.finalCtaHeadline || ''}
                  onChange={(e) => updateField('finalCtaHeadline', e.target.value)}
                  placeholder="Ready to Transform Your Health?"
                />
              </div>
              
              <div>
                <Label htmlFor="finalCtaText">Final CTA Button Text</Label>
                <Input
                  id="finalCtaText"
                  value={formData.finalCtaText || ''}
                  onChange={(e) => updateField('finalCtaText', e.target.value)}
                  placeholder="Start Your Journey Today"
                />
              </div>
              
              <div>
                <Label htmlFor="companyDescription">Company Description</Label>
                <Textarea
                  id="companyDescription"
                  value={formData.companyDescription || ''}
                  onChange={(e) => updateField('companyDescription', e.target.value)}
                  placeholder="Empowering individuals with AI-driven health insights..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}