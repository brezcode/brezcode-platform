import { Link } from "wouter";

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Breast Health Report
          </h1>
          <p className="text-xl text-gray-600">
            Based on your responses, here are your personalized recommendations
          </p>
        </div>
        
        <div className="grid gap-8">
          {/* Risk Level Card */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Low Risk</h2>
                <p className="text-gray-600">Your current risk level is below average</p>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">
                Based on your age, family history, and lifestyle factors, your breast cancer risk 
                is currently lower than the general population average.
              </p>
            </div>
          </div>
          
          {/* Recommendations Card */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommendations</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                  <span className="text-blue-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Annual Screening</h3>
                  <p className="text-gray-600">
                    Continue with annual mammography screening as recommended for your age group.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                  <span className="text-blue-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Healthy Lifestyle</h3>
                  <p className="text-gray-600">
                    Maintain a healthy weight, exercise regularly, and limit alcohol consumption.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                  <span className="text-blue-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Self-Examination</h3>
                  <p className="text-gray-600">
                    Perform monthly breast self-examinations and report any changes to your doctor.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Items Card */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Next Steps</h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input type="checkbox" className="text-blue-600" />
                <span className="text-gray-700">Schedule your next mammogram appointment</span>
              </div>
              <div className="flex items-center space-x-3">
                <input type="checkbox" className="text-blue-600" />
                <span className="text-gray-700">Download our breast self-exam guide</span>
              </div>
              <div className="flex items-center space-x-3">
                <input type="checkbox" className="text-blue-600" />
                <span className="text-gray-700">Share this report with your healthcare provider</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Link href="/">
            <button className="btn-primary mr-4">
              Take Assessment Again
            </button>
          </Link>
          <button className="btn-secondary">
            Download PDF Report
          </button>
        </div>
      </div>
    </div>
  );
}