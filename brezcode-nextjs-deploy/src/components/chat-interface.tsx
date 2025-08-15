interface ChatInterfaceProps {
  isPreview?: boolean;
}

export default function ChatInterface({ isPreview = false }: ChatInterfaceProps) {
  if (isPreview) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-md mx-auto">
        {/* Chat Header */}
        <div className="gradient-bg p-4 rounded-2xl mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="sky-blue font-bold">AI</span>
            </div>
            <div>
              <h3 className="text-white font-semibold">Health Coach AI</h3>
              <p className="text-white/80 text-sm">Online now</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="space-y-4 h-80 overflow-y-auto">
          {/* Bot Message */}
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-sunny-yellow rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-charcoal text-sm font-bold">AI</span>
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-tl-md p-3 max-w-xs">
              <p className="text-sm">Hello! I'm your personal breast health coach. How can I help you today?</p>
            </div>
          </div>

          {/* User Message */}
          <div className="flex items-end justify-end">
            <div className="bg-sky-blue rounded-2xl rounded-tr-md p-3 max-w-xs">
              <p className="text-white text-sm">I'd like to learn about risk factors</p>
            </div>
          </div>

          {/* Bot Message */}
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-sunny-yellow rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-charcoal text-sm font-bold">AI</span>
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-tl-md p-3 max-w-xs">
              <p className="text-sm">I'd be happy to help! There are several key risk factors to consider. Let me share some personalized insights based on your profile...</p>
            </div>
          </div>
        </div>

        {/* Chat Input */}
        <div className="mt-4 flex space-x-2">
          <input 
            type="text" 
            placeholder="Type your message..." 
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-sky-blue"
            disabled
          />
          <button className="bg-sky-blue text-white p-2 rounded-full hover:bg-blue-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // This would be the actual chat interface component
  // For now, just return null as the full chat is in chat.tsx
  return null;
}
