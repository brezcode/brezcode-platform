import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowLeft, Menu, X } from "lucide-react";
import { useLocation } from "wouter";

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <Button
      onClick={scrollToTop}
      className="fixed bottom-4 right-4 z-50 rounded-full w-12 h-12 shadow-lg bg-blue-600 hover:bg-blue-700 text-white"
      size="icon"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
}

export function BackButton() {
  const [location, setLocation] = useLocation();

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      setLocation("/");
    }
  };

  // Don't show back button on home/landing pages
  if (location === "/" || location === "/landing") {
    return null;
  }

  return (
    <Button
      onClick={handleBack}
      variant="ghost"
      size="sm"
      className="fixed top-4 left-4 z-50 bg-white/90 backdrop-blur-sm shadow-md hover:bg-white/95"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back
    </Button>
  );
}

export function MobileMenuToggle() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="md:hidden">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        size="sm"
        className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm shadow-md"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
      
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-white/95 backdrop-blur-sm p-4 pt-16">
          <div className="space-y-4">
            <a href="/dashboard" className="block text-lg font-medium hover:text-blue-600" onClick={() => setIsOpen(false)}>
              Dashboard
            </a>
            <a href="/user-profile" className="block text-lg font-medium hover:text-blue-600" onClick={() => setIsOpen(false)}>
              Profile
            </a>
            <a href="/login" className="block text-lg font-medium hover:text-blue-600" onClick={() => setIsOpen(false)}>
              Login
            </a>
          </div>
        </div>
      )}
    </div>
  );
}