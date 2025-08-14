export default function LeadGenLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-purple-900 mb-6">
            Welcome to LeadGen
          </h1>
          <p className="text-xl text-purple-600 mb-8">
            Your powerful lead generation and business growth platform
          </p>
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">LeadGen Features:</h2>
            <ul className="text-left space-y-3">
              <li>• Advanced lead capture systems</li>
              <li>• Customer relationship management</li>
              <li>• Automated marketing workflows</li>
              <li>• Business growth analytics</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}