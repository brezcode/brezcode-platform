export default function BrezCodeLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-blue-900 mb-6">
            Welcome to BrezCode
          </h1>
          <p className="text-xl text-blue-600 mb-8">
            Your comprehensive business platform for success
          </p>
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Platform Features:</h2>
            <ul className="text-left space-y-3">
              <li>• AI-powered business avatars</li>
              <li>• Advanced training systems</li>
              <li>• Knowledge management</li>
              <li>• Multi-platform integration</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}