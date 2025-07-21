import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { BrandProvider } from "@/components/BrandProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/components/LanguageSelector";
import { DomainRouter } from "@/components/DomainRouter";
import LandingPage from "@/pages/landing";
import DomainLanding from "@/pages/domain-landing";
import ChatPage from "@/pages/chat";
import QuizPage from "@/pages/quiz";
import ReportPage from "@/pages/report";
import TestReportPage from "@/pages/test-report";
import DemoReportPage from "@/pages/demo-report";
import PersonalizedReportPage from "@/pages/personalized-report";
import SubscribePage from "@/pages/subscribe";
import AdminPage from "@/pages/admin";
import NotFound from "@/pages/not-found";
import AvatarQuizPage from "@/pages/avatar-quiz";
import AvatarDemoPage from "@/pages/avatar-demo";
import HealthSetupPage from "@/pages/health-setup";
import HealthCalendarPage from "@/pages/health-calendar";
import HealthPreferencesPage from "@/pages/health-preferences";
import BrandAiAdmin from "@/pages/brand-ai-admin";
import UserHomepage from "@/pages/user-homepage";
import NotificationsPage from "@/pages/notifications";
import FoodAnalysisPage from "@/pages/food-analysis";
import DietaryRecommendationsPage from "@/pages/dietary-recommendations";
import { LeadGenLanding } from "@/pages/LeadGenLanding";
import BusinessConsultant from "@/pages/BusinessConsultant";
import BusinessDashboard from "@/pages/BusinessDashboard";
import UserProfile from "@/pages/UserProfile";
import LoginPage from "@/pages/LoginPage";
import KnowledgeCentre from "@/pages/KnowledgeCentre";
import AvatarSetup from "@/pages/AvatarSetup";

function Router() {
  return (
    <>
      <DomainRouter />
      <Switch>
        {/* Root paths */}
        <Route path="/" component={LeadGenLanding} />
        <Route path="/login" component={LoginPage} />
        <Route path="/business-consultant" component={BusinessConsultant} />
        <Route path="/dashboard" component={BusinessDashboard} />
        <Route path="/user-profile" component={UserProfile} />
        <Route path="/knowledge-centre" component={KnowledgeCentre} />
        <Route path="/avatar-setup" component={AvatarSetup} />
        <Route path="/admin" component={AdminPage} />
        <Route path="/health" component={LeadGenLanding} />
        
        {/* Brand-specific paths */}
        <Route path="/:brand" component={LandingPage} />
        <Route path="/:brand/quiz" component={QuizPage} />
        <Route path="/:brand/avatar-quiz" component={AvatarQuizPage} />
        <Route path="/:brand/avatar-demo" component={AvatarDemoPage} />
        <Route path="/:brand/health-setup" component={HealthSetupPage} />
        <Route path="/:brand/health-calendar" component={HealthCalendarPage} />
        <Route path="/:brand/health-preferences" component={HealthPreferencesPage} />
        <Route path="/:brand/ai-admin" component={BrandAiAdmin} />
        <Route path="/:brand/dashboard" component={UserHomepage} />
        <Route path="/:brand/notifications" component={NotificationsPage} />
        <Route path="/:brand/food-analysis" component={FoodAnalysisPage} />
        <Route path="/:brand/dietary-recommendations" component={DietaryRecommendationsPage} />
        <Route path="/:brand/report" component={ReportPage} />
        <Route path="/:brand/test-report" component={TestReportPage} />
        <Route path="/:brand/demo-report" component={DemoReportPage} />
        <Route path="/:brand/personalized-report" component={PersonalizedReportPage} />
        <Route path="/:brand/chat" component={ChatPage} />
        <Route path="/:brand/subscribe/:tier" component={SubscribePage} />
        
        {/* Legacy paths (redirect to brand-specific) */}
        <Route path="/quiz" component={QuizPage} />
        <Route path="/report" component={ReportPage} />
        <Route path="/test-report" component={TestReportPage} />
        <Route path="/demo-report" component={DemoReportPage} />
        <Route path="/personalized-report" component={PersonalizedReportPage} />
        <Route path="/chat" component={ChatPage} />
        <Route path="/subscribe/:tier" component={SubscribePage} />
        
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrandProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Router />
            <Toaster />
          </TooltipProvider>
        </LanguageProvider>
      </BrandProvider>
    </QueryClientProvider>
  );
}

export default App;
