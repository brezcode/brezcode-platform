import { Link } from "wouter";

export default function Navigation() {
  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">BQ</span>
                </div>
                <span className="text-xl font-bold text-gray-900">BreastQuiz</span>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                How It Works
              </a>
              <a href="#features" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Features
              </a>
              <a href="#reviews" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Reviews
              </a>
              <Link href="/quiz">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Take Quiz
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}