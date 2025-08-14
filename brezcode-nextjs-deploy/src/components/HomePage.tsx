export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Multi-Platform Hub
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Choose your platform to get started
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-blue-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">BrezCode</h3>
              <p>Business platform</p>
            </div>
            <div className="bg-green-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">SkinCoach</h3>
              <p>Health analysis</p>
            </div>
            <div className="bg-purple-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">LeadGen</h3>
              <p>Lead generation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}