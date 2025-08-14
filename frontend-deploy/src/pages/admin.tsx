import React, { useState } from 'react';
import { BrandConfigForm } from '@/components/admin/BrandConfigForm';
import { useBrandContext } from '@/components/BrandProvider';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { BrandConfig } from '@shared/brand-schema';

export default function AdminPage() {
  const { brand, config } = useBrandContext();
  const { toast } = useToast();
  const [previewMode, setPreviewMode] = useState(false);

  const handleSaveConfig = async (updates: Partial<BrandConfig>) => {
    if (!brand?.id) {
      toast({
        title: "Error",
        description: "No brand selected for configuration",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiRequest(`/api/admin/brands/${brand.id}/config`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });

      toast({
        title: "Success",
        description: "Brand configuration saved successfully",
      });
      
      // Refresh the page to show updated configuration
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save brand configuration",
        variant: "destructive",
      });
    }
  };

  const createNewBrand = async () => {
    const brandName = prompt("Enter brand name:");
    const subdomain = prompt("Enter subdomain (e.g., 'acme' for acme.brezcode.com):");
    
    if (!brandName || !subdomain) return;

    try {
      await apiRequest('/api/admin/brands', {
        method: 'POST',
        body: JSON.stringify({
          name: brandName,
          subdomain,
          isActive: true,
        }),
      });

      toast({
        title: "Success",
        description: `Brand "${brandName}" created successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create brand",
        variant: "destructive",
      });
    }
  };

  if (previewMode) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-white p-4 border-b flex justify-between items-center">
          <h1 className="text-xl font-semibold">Preview Mode</h1>
          <Button onClick={() => setPreviewMode(false)}>
            Exit Preview
          </Button>
        </div>
        <iframe
          src="/"
          className="w-full h-full"
          style={{ height: 'calc(100vh - 80px)' }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">SAAS Admin Dashboard</h1>
            <p className="text-gray-600">
              Configure your branded health assessment app
            </p>
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={createNewBrand}>
              Create New Brand
            </Button>
            <Button onClick={() => setPreviewMode(true)}>
              Preview Site
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="configure">Configure</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Brand</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{brand?.name || 'BrezCode'}</p>
                  <p className="text-gray-600">{brand?.subdomain || 'brezcode'}.brezcode.com</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Template Sections</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>✅ Hero Section</li>
                    <li>✅ How It Works</li>
                    <li>✅ Features</li>
                    <li>✅ Customer Reviews</li>
                    <li>✅ Pricing</li>
                    <li>✅ FAQ</li>
                    <li>✅ Final CTA</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Configuration Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Hero Content</span>
                      <span className="text-green-600">✓</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Branding</span>
                      <span className="text-green-600">✓</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Features</span>
                      <span className="text-green-600">✓</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pricing</span>
                      <span className="text-green-600">✓</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>SAAS Platform Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold mb-2">Multi-Tenant</h3>
                    <p className="text-sm text-gray-600">Each brand gets their own subdomain and configuration</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold mb-2">Template System</h3>
                    <p className="text-sm text-gray-600">Customize hero, features, pricing, and more</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <h3 className="font-semibold mb-2">Brand Customization</h3>
                    <p className="text-sm text-gray-600">Colors, fonts, logos, and content</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <h3 className="font-semibold mb-2">Scalable</h3>
                    <p className="text-sm text-gray-600">Support unlimited brands and customers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="configure">
            <BrandConfigForm 
              config={config}
              onSave={handleSaveConfig}
              onPreview={() => setPreviewMode(true)}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Track performance metrics for your branded health assessment app.
                </p>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-2xl font-bold">0</h3>
                    <p className="text-sm text-gray-600">Total Users</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-2xl font-bold">0</h3>
                    <p className="text-sm text-gray-600">Quiz Completions</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-2xl font-bold">0%</h3>
                    <p className="text-sm text-gray-600">Conversion Rate</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h3 className="text-2xl font-bold">$0</h3>
                    <p className="text-sm text-gray-600">Revenue</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}