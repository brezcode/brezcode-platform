export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="card">
          <h1 className="text-2xl font-bold text-center mb-8">
            Sign In to BreastQuiz
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Authentication will be implemented based on your requirements.
          </p>
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
            <input
              type="password"
              placeholder="Password"  
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
            <button className="btn-primary w-full">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}