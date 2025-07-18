import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [, setLocation] = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [authForm, setAuthForm] = useState({ email: "", username: "", password: "" });
  const { toast } = useToast();
  const { user, login, register, logout } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(authForm.email, authForm.password);
      setShowAuthModal(false);
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    } catch (error: any) {
      toast({
        title: "Sign In Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(authForm.username, authForm.email, authForm.password);
      setShowAuthModal(false);
      toast({
        title: "Account Created!",
        description: "Welcome to Breast Health Coach AI.",
      });
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });
  };

  return (
    <>
      <nav className="fixed top-0 w-full bg-transparent z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setLocation("/")}>
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">BC</span>
              </div>
              <span className="font-bold text-xl text-yellow-400">BrezCode</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium">About</a>
              <a href="#app-features" className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium">Features</a>
              <a href="#reviews" className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium">Reviews</a>
              <a href="#pricing" className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium">Pricing</a>
              <div className="bg-white/10 rounded-lg px-3 py-1 backdrop-blur-sm">
                <LanguageSelector />
              </div>
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-yellow-400">Welcome, {user.username}!</span>
                  {user.isSubscriptionActive && (
                    <Button 
                      onClick={() => setLocation("/chat")}
                      className="bg-yellow-400 text-black px-4 py-2 rounded-full hover:bg-yellow-300 transition-colors font-semibold"
                    >
                      Open Chat
                    </Button>
                  )}
                  <Button variant="outline" onClick={handleLogout} className="border-white text-white hover:bg-white hover:text-blue-600">
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-6">
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowAuthModal(true)}
                    className="text-yellow-400 hover:text-yellow-300 font-medium"
                  >
                    Log In
                  </Button>
                  <Button 
                    onClick={() => setShowAuthModal(true)}
                    className="bg-white text-blue-600 px-6 py-2 rounded-full hover:bg-gray-100 transition-colors font-semibold"
                  >
                    SIGN UP
                  </Button>
                </div>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="text-yellow-400 hover:text-yellow-300"
              >
                {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {showMobileMenu && (
          <div className="md:hidden bg-blue-600/95 backdrop-blur-sm border-t border-white/10">
            <div className="px-4 py-6 space-y-4">
              <div className="flex justify-center mb-4">
                <LanguageSelector />
              </div>
              <div className="space-y-3">
                <a href="#features" className="block text-yellow-400 hover:text-yellow-300 transition-colors font-medium text-center" onClick={() => setShowMobileMenu(false)}>About</a>
                <a href="#app-features" className="block text-yellow-400 hover:text-yellow-300 transition-colors font-medium text-center" onClick={() => setShowMobileMenu(false)}>Features</a>
                <a href="#reviews" className="block text-yellow-400 hover:text-yellow-300 transition-colors font-medium text-center" onClick={() => setShowMobileMenu(false)}>Reviews</a>
                <a href="#pricing" className="block text-yellow-400 hover:text-yellow-300 transition-colors font-medium text-center" onClick={() => setShowMobileMenu(false)}>Pricing</a>
              </div>
              
              {user ? (
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="text-center text-yellow-400 text-sm">Welcome, {user.username}!</div>
                  {user.isSubscriptionActive && (
                    <Button 
                      onClick={() => { setLocation("/chat"); setShowMobileMenu(false); }}
                      className="w-full bg-yellow-400 text-black hover:bg-yellow-300 transition-colors font-semibold"
                    >
                      Open Chat
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    onClick={() => { handleLogout(); setShowMobileMenu(false); }}
                    className="w-full border-white text-white hover:bg-white hover:text-blue-600"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <Button 
                    variant="ghost" 
                    onClick={() => { setShowAuthModal(true); setShowMobileMenu(false); }}
                    className="w-full text-yellow-400 hover:text-yellow-300 font-medium"
                  >
                    Log In
                  </Button>
                  <Button 
                    onClick={() => { setShowAuthModal(true); setShowMobileMenu(false); }}
                    className="w-full bg-white text-blue-600 hover:bg-gray-100 transition-colors font-semibold"
                  >
                    SIGN UP
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Welcome to Breast Health Coach AI</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Create Account</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={authForm.email}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={authForm.password}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-sky-blue hover:bg-blue-600">
                  Sign In
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={authForm.username}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, username: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email-register">Email</Label>
                  <Input
                    id="email-register"
                    type="email"
                    value={authForm.email}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password-register">Password</Label>
                  <Input
                    id="password-register"
                    type="password"
                    value={authForm.password}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
                <Button type="submit" className="w-full gradient-bg hover:opacity-90">
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
