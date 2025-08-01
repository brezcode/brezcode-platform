import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { LanguageSelector, useTranslation } from "@/components/LanguageSelector";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [, setLocation] = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [authForm, setAuthForm] = useState({ email: "", username: "", password: "" });
  const { toast } = useToast();
  const { user, login, register, logout } = useAuth();
  const { t } = useTranslation();

  // Mobile dialog fix - prevent body scroll when dialog is open
  useEffect(() => {
    if (showAuthModal) {
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.overflow = '';
    };
  }, [showAuthModal]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(authForm.email, authForm.password);
      setShowAuthModal(false);
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      // Redirect authenticated users to BrezCode personal dashboard
      setLocation("/brezcode/personal-dashboard");
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
      // Split username into first and last name for registration
      const nameParts = authForm.username.split(' ');
      const firstName = nameParts[0] || authForm.username;
      const lastName = nameParts.slice(1).join(' ') || '';
      
      await register(firstName, lastName, authForm.email, authForm.password);
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
            <div className="hidden lg:flex items-center">
              <div className="flex items-center space-x-6 mr-8">
                <button onClick={() => setLocation("/brezcode/health-preferences")} className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium px-2 py-1">Health Setup</button>
                <button onClick={() => setLocation("/brezcode/health-calendar")} className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium px-2 py-1">Health Calendar</button>
                <button onClick={() => setLocation("/brezcode/avatar-demo")} className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium px-2 py-1">AI Assistant</button>
              </div>
              <div className="flex items-center space-x-6 mr-8">
                <a href="#how-it-works" className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium px-2 py-1">{t('nav.howItWorks', 'How it works')}</a>
                <a href="#features" className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium px-2 py-1">{t('nav.features', 'Features')}</a>
                <a href="#pricing" className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium px-2 py-1">{t('nav.pricing', 'Pricing')}</a>
              </div>
              <div className="bg-white/10 rounded-lg px-3 py-1 backdrop-blur-sm mr-6">
                <LanguageSelector />
              </div>
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-yellow-400">Welcome, {user.username || user.firstName || user.email}!</span>
                  {user.isSubscriptionActive && (
                    <Button 
                      onClick={() => setLocation("/chat")}
                      className="bg-yellow-400 text-black px-4 py-2 rounded-full hover:bg-yellow-300 transition-colors font-semibold"
                    >
                      Open Chat
                    </Button>
                  )}
                  <Button variant="outline" onClick={handleLogout} className="border-white text-white hover:bg-white hover:text-blue-600">
                    {t('nav.logout', 'Sign Out')}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowAuthModal(true)}
                    className="text-yellow-400 hover:text-yellow-300 font-medium px-4 py-2"
                  >
                    {t('nav.signIn', 'Sign In')}
                  </Button>
                  <Button 
                    onClick={() => setShowAuthModal(true)}
                    className="bg-white text-blue-600 px-6 py-2 rounded-full hover:bg-gray-100 transition-colors font-semibold"
                  >
                    {t('nav.signUp', 'Sign Up')}
                  </Button>
                </div>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="lg:hidden">
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
          <div className="lg:hidden bg-blue-600/95 backdrop-blur-sm border-t border-white/10">
            <div className="px-4 py-6 space-y-4">
              <div className="flex justify-center mb-4">
                <LanguageSelector />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <a href="#how-it-works" className="block text-yellow-400 hover:text-yellow-300 transition-colors font-medium text-center py-3 px-4 bg-white/5 rounded-lg" onClick={() => setShowMobileMenu(false)}>{t('nav.howItWorks', 'How it works')}</a>
                <a href="#features" className="block text-yellow-400 hover:text-yellow-300 transition-colors font-medium text-center py-3 px-4 bg-white/5 rounded-lg" onClick={() => setShowMobileMenu(false)}>{t('nav.features', 'Features')}</a>
                <a href="#reviews" className="block text-yellow-400 hover:text-yellow-300 transition-colors font-medium text-center py-3 px-4 bg-white/5 rounded-lg" onClick={() => setShowMobileMenu(false)}>{t('nav.reviews', 'Reviews')}</a>
                <a href="#pricing" className="block text-yellow-400 hover:text-yellow-300 transition-colors font-medium text-center py-3 px-4 bg-white/5 rounded-lg" onClick={() => setShowMobileMenu(false)}>{t('nav.pricing', 'Pricing')}</a>
                <a href="#faq" className="block text-yellow-400 hover:text-yellow-300 transition-colors font-medium text-center py-3 px-4 bg-white/5 rounded-lg" onClick={() => setShowMobileMenu(false)}>{t('nav.faq', 'FAQ')}</a>
                <button onClick={() => { setLocation("/brezcode/health-preferences"); setShowMobileMenu(false); }} className="block text-yellow-400 hover:text-yellow-300 transition-colors font-medium text-center py-3 px-4 bg-white/5 rounded-lg">Health Setup</button>
              </div>
              
              {user ? (
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="text-center text-yellow-400 text-sm">Welcome, {user.username || user.firstName || user.email}!</div>
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
        <DialogContent className="w-full max-w-md">
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
