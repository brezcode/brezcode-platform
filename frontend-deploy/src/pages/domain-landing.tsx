import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";

export default function DomainLanding() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            LeadGen.to
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Multi-Tenant SAAS Platform for Branded Health Assessment Apps
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Create unlimited branded health assessment applications with custom domains, 
            white-label branding, and comprehensive template systems.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold">
                  1
                </span>
                BrezCode Health Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                AI-powered breast health coaching with personalized risk assessments, 
                multi-language support, and evidence-based recommendations.
              </p>
              <Button 
                onClick={() => setLocation('/brezcode')}
                className="w-full"
              >
                Visit BrezCode →
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-dashed border-2 border-gray-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-500">
                <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 text-sm font-bold">
                  +
                </span>
                Your Brand Here
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 mb-4">
                Create your own branded health assessment app with custom branding, 
                content templates, and subdomain routing.
              </p>
              <Button 
                variant="outline" 
                onClick={() => setLocation('/admin')}
                className="w-full"
              >
                Create New Brand
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Platform Features</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Multi-Tenant</h3>
              <p className="text-sm text-gray-600">Complete brand isolation with custom domains</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"></path>
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Template System</h3>
              <p className="text-sm text-gray-600">Customizable landing page components</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
              </div>
              <h3 className="font-semibold mb-2">White Label</h3>
              <p className="text-sm text-gray-600">Custom branding, colors, and content</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Scalable</h3>
              <p className="text-sm text-gray-600">Unlimited brands and customers</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-6">
          <h3 className="font-semibold mb-4">Domain Structure</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-mono text-blue-600">leadgen.to/brezcode</span>
              <span className="text-gray-600">BrezCode health assessment</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono text-gray-400">leadgen.to/acme</span>
              <span className="text-gray-400">Future brand (example)</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono text-purple-600">leadgen.to/admin</span>
              <span className="text-gray-600">Platform administration</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}