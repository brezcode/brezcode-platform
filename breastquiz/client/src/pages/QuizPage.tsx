import { Link } from "wouter";

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Breast Health Assessment
          </h1>
          <p className="text-xl text-gray-600">
            Answer the following questions to receive your personalized breast health report
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '10%' }}></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Question 1 of 10</p>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              What is your current age?
            </h2>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="radio" name="age" value="under-30" className="text-blue-600" />
                <span className="text-lg">Under 30</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="radio" name="age" value="30-39" className="text-blue-600" />
                <span className="text-lg">30-39</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="radio" name="age" value="40-49" className="text-blue-600" />
                <span className="text-lg">40-49</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="radio" name="age" value="50-59" className="text-blue-600" />
                <span className="text-lg">50-59</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="radio" name="age" value="60-plus" className="text-blue-600" />
                <span className="text-lg">60 or older</span>
              </label>
            </div>
          </div>
          
          <div className="flex justify-between mt-12">
            <Link href="/">
              <button className="btn-secondary">
                Back to Home
              </button>
            </Link>
            <button className="btn-primary">
              Next Question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}