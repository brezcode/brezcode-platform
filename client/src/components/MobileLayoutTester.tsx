import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Tablet, Monitor, CheckCircle, AlertTriangle } from 'lucide-react';

interface LayoutTest {
  id: string;
  name: string;
  description: string;
  testFunction: () => boolean;
  status: 'pass' | 'fail' | 'untested';
}

export function MobileLayoutTester() {
  const [activeViewport, setActiveViewport] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [tests, setTests] = useState<LayoutTest[]>([
    {
      id: 'buttons-viewport',
      name: 'Buttons Within Viewport',
      description: 'All buttons stay within screen boundaries',
      testFunction: () => checkButtonsInViewport(),
      status: 'untested'
    },
    {
      id: 'horizontal-scroll',
      name: 'No Horizontal Scroll',
      description: 'Content does not cause horizontal scrolling',
      testFunction: () => checkHorizontalScroll(),
      status: 'untested'
    },
    {
      id: 'touch-targets',
      name: 'Touch Target Size',
      description: 'Interactive elements are at least 44px tall',
      testFunction: () => checkTouchTargetSize(),
      status: 'untested'
    },
    {
      id: 'text-readable',
      name: 'Text Readability',
      description: 'Text is large enough to read on mobile',
      testFunction: () => checkTextSize(),
      status: 'untested'
    },
    {
      id: 'responsive-grid',
      name: 'Responsive Grid Layout',
      description: 'Grid layouts adapt properly to screen size',
      testFunction: () => checkGridResponsiveness(),
      status: 'untested'
    }
  ]);

  const checkButtonsInViewport = (): boolean => {
    const buttons = document.querySelectorAll('button');
    const viewportWidth = window.innerWidth;
    
    for (const button of Array.from(buttons)) {
      const rect = button.getBoundingClientRect();
      if (rect.right > viewportWidth || rect.left < 0) {
        console.log('Button overflow detected:', button, rect);
        return false;
      }
    }
    return true;
  };

  const checkHorizontalScroll = (): boolean => {
    return document.documentElement.scrollWidth <= document.documentElement.clientWidth;
  };

  const checkTouchTargetSize = (): boolean => {
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
    
    for (const element of Array.from(interactiveElements)) {
      const rect = element.getBoundingClientRect();
      if (rect.height < 44) {
        console.log('Touch target too small:', element, rect.height);
        return false;
      }
    }
    return true;
  };

  const checkTextSize = (): boolean => {
    const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6');
    
    for (const element of Array.from(textElements)) {
      const styles = window.getComputedStyle(element);
      const fontSize = parseFloat(styles.fontSize);
      if (fontSize < 14 && element.textContent?.trim()) {
        console.log('Text too small:', element, fontSize);
        return false;
      }
    }
    return true;
  };

  const checkGridResponsiveness = (): boolean => {
    const gridElements = document.querySelectorAll('[class*="grid"]');
    
    for (const grid of Array.from(gridElements)) {
      const rect = grid.getBoundingClientRect();
      if (rect.width > window.innerWidth) {
        console.log('Grid overflow detected:', grid, rect.width);
        return false;
      }
    }
    return true;
  };

  const runAllTests = () => {
    const updatedTests = tests.map(test => ({
      ...test,
      status: test.testFunction() ? 'pass' : 'fail' as 'pass' | 'fail'
    }));
    setTests(updatedTests);
  };

  const simulateViewport = (viewport: 'mobile' | 'tablet' | 'desktop') => {
    setActiveViewport(viewport);
    const root = document.documentElement;
    
    switch (viewport) {
      case 'mobile':
        root.style.maxWidth = '375px';
        root.style.margin = '0 auto';
        break;
      case 'tablet':
        root.style.maxWidth = '768px';
        root.style.margin = '0 auto';
        break;
      case 'desktop':
        root.style.maxWidth = 'none';
        root.style.margin = '0';
        break;
    }
  };

  const resetViewport = () => {
    const root = document.documentElement;
    root.style.maxWidth = 'none';
    root.style.margin = '0';
    setActiveViewport('desktop');
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="w-5 h-5" />
          Mobile Layout Testing Suite
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Viewport Simulation */}
        <div>
          <h3 className="font-medium mb-3">Viewport Simulation</h3>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={activeViewport === 'mobile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => simulateViewport('mobile')}
              className="flex items-center gap-2"
            >
              <Smartphone className="w-4 h-4" />
              Mobile (375px)
            </Button>
            <Button
              variant={activeViewport === 'tablet' ? 'default' : 'outline'}
              size="sm"
              onClick={() => simulateViewport('tablet')}
              className="flex items-center gap-2"
            >
              <Tablet className="w-4 h-4" />
              Tablet (768px)
            </Button>
            <Button
              variant={activeViewport === 'desktop' ? 'default' : 'outline'}
              size="sm"
              onClick={() => simulateViewport('desktop')}
              className="flex items-center gap-2"
            >
              <Monitor className="w-4 h-4" />
              Desktop
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetViewport}
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Test Suite */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Layout Tests</h3>
            <Button onClick={runAllTests} size="sm">
              Run All Tests
            </Button>
          </div>
          
          <div className="space-y-3">
            {tests.map(test => (
              <div key={test.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{test.name}</span>
                    {test.status === 'pass' && <CheckCircle className="w-4 h-4 text-green-500" />}
                    {test.status === 'fail' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                  </div>
                  <p className="text-sm text-gray-600">{test.description}</p>
                </div>
                <Badge 
                  variant={
                    test.status === 'pass' ? 'default' : 
                    test.status === 'fail' ? 'destructive' : 'secondary'
                  }
                >
                  {test.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Results Summary */}
        <div className="border-t pt-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {tests.filter(t => t.status === 'pass').length}
              </div>
              <div className="text-sm text-gray-600">Passed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {tests.filter(t => t.status === 'fail').length}
              </div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-600">
                {tests.filter(t => t.status === 'untested').length}
              </div>
              <div className="text-sm text-gray-600">Untested</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}