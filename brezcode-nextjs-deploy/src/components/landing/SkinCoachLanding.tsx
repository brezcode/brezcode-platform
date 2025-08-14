export default function SkinCoachLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-green-900 mb-6">
            Welcome to SkinCoach
          </h1>
          <p className="text-xl text-green-600 mb-8">
            Your personal AI-powered skin health advisor
          </p>
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Skin Analysis Features:</h2>
            <ul className="text-left space-y-3">
              <li>• Advanced skin condition analysis</li>
              <li>• Personalized care recommendations</li>
              <li>• Health risk assessments</li>
              <li>• Expert dermatology insights</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}