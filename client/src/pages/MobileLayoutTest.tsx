import { MobileLayoutTester } from '@/components/MobileLayoutTester';

export function MobileLayoutTest() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mobile Layout Testing</h1>
          <p className="text-gray-600">
            Comprehensive testing suite to ensure all UI components work perfectly on mobile devices.
          </p>
        </div>
        
        <MobileLayoutTester />
        
        <div className="mt-8 p-6 bg-white rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Test Components</h2>
          <div className="space-y-4">
            {/* Test various button layouts */}
            <div className="flex flex-col sm:flex-row gap-2">
              <button className="btn bg-blue-500 text-white px-4 py-2 rounded min-h-[44px]">
                Primary Button
              </button>
              <button className="btn bg-gray-500 text-white px-4 py-2 rounded min-h-[44px]">
                Secondary Button
              </button>
              <button className="btn bg-green-500 text-white px-4 py-2 rounded min-h-[44px]">
                Success Button
              </button>
            </div>
            
            {/* Test grid layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-100 rounded">Grid Item 1</div>
              <div className="p-4 bg-green-100 rounded">Grid Item 2</div>
              <div className="p-4 bg-yellow-100 rounded">Grid Item 3</div>
            </div>
            
            {/* Test text sizes */}
            <div className="space-y-2">
              <p className="text-sm">Small text (14px)</p>
              <p className="text-base">Base text (16px)</p>
              <p className="text-lg">Large text (18px)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}