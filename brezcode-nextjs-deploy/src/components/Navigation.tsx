'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full bg-transparent z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.location.href = "/"}>
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">BC</span>
              </div>
              <span className="font-bold text-xl text-yellow-400">BrezCode</span>
            </div>
            <div className="hidden lg:flex items-center">
              <div className="flex items-center space-x-6 mr-8">
                <button onClick={() => window.location.href = "/health-preferences"} className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium px-2 py-1">Health Setup</button>
                <button onClick={() => window.location.href = "/health-calendar"} className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium px-2 py-1">Health Calendar</button>
                <button onClick={() => window.location.href = "/avatar-demo"} className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium px-2 py-1">AI Assistant</button>
              </div>
              <div className="flex items-center space-x-6 mr-8">
                <a href="#how-it-works" className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium px-2 py-1">How it works</a>
                <a href="#features" className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium px-2 py-1">Features</a>
                <a href="#pricing" className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium px-2 py-1">Pricing</a>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  onClick={() => window.location.href = "/login"}
                  className="text-yellow-400 hover:text-yellow-300 font-medium px-4 py-2"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => window.location.href = "/register"}
                  className="bg-white text-blue-600 px-6 py-2 rounded-full hover:bg-gray-100 transition-colors font-semibold"
                >
                  Sign Up
                </Button>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="text-yellow-400 hover:text-yellow-300"
              >
                {showMobileMenu ? '×' : '☰'}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {showMobileMenu && (
          <div className="lg:hidden bg-blue-600/95 backdrop-blur-sm border-t border-white/10">
            <div className="px-4 py-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <a href="#how-it-works" className="block text-yellow-400 hover:text-yellow-300 transition-colors font-medium text-center py-3 px-4 bg-white/5 rounded-lg" onClick={() => setShowMobileMenu(false)}>How it works</a>
                <a href="#features" className="block text-yellow-400 hover:text-yellow-300 transition-colors font-medium text-center py-3 px-4 bg-white/5 rounded-lg" onClick={() => setShowMobileMenu(false)}>Features</a>
                <a href="#reviews" className="block text-yellow-400 hover:text-yellow-300 transition-colors font-medium text-center py-3 px-4 bg-white/5 rounded-lg" onClick={() => setShowMobileMenu(false)}>Reviews</a>
                <a href="#pricing" className="block text-yellow-400 hover:text-yellow-300 transition-colors font-medium text-center py-3 px-4 bg-white/5 rounded-lg" onClick={() => setShowMobileMenu(false)}>Pricing</a>
              </div>
              
              <div className="pt-4 border-t border-white/10 space-y-3">
                <Button 
                  variant="ghost" 
                  onClick={() => { window.location.href = "/login"; setShowMobileMenu(false); }}
                  className="w-full text-yellow-400 hover:text-yellow-300 font-medium"
                >
                  Log In
                </Button>
                <Button 
                  onClick={() => { window.location.href = "/register"; setShowMobileMenu(false); }}
                  className="w-full bg-white text-blue-600 hover:bg-gray-100 transition-colors font-semibold"
                >
                  SIGN UP
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}