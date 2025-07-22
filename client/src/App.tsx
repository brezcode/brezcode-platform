import { Route, Switch } from "wouter";
import { LeadGenLanding } from "@/pages/LeadGenLanding";
import LoginPage from "@/pages/LoginPage";
import UserProfile from "@/pages/UserProfile";
import BusinessDashboard from "@/pages/BusinessDashboard";
import BusinessConsultant from "@/pages/BusinessConsultant";
import SubscribePage from "@/pages/subscribe";
import EmailVerificationModule from "@/components/EmailVerificationModule";
import BusinessSelector from "@/components/BusinessSelector";
import BrezCodeDashboard from "@/pages/BrezCodeDashboard";
import UserHomepage from "@/pages/user-homepage";
import LeadGenDashboard from "@/pages/LeadGenDashboard";
import ProfileEditor from "@/pages/ProfileEditor";
import BusinessLandingCreator from "@/pages/BusinessLandingCreator";
import QuizPage from "@/pages/quiz";
import QuizTransition from "@/components/quiz-transition";
import ReportViewer from "@/pages/report";
import KnowledgeCentre from "@/pages/KnowledgeCentre";
import AITrainer from "@/pages/AITrainer";
import AITrainerDashboard from "@/pages/AITrainerDashboard";
import RoleplayTraining from "@/pages/RoleplayTraining";
import { AiTrainingDashboard } from "@/pages/AiTrainingDashboard";
import { AiTrainingSession } from "@/pages/AiTrainingSession";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { BackToTopButton, BackButton } from "@/components/MobileNavigation";

// Health-related pages
import HealthPreferences from "@/pages/health-preferences";
import HealthCalendar from "@/pages/health-calendar";
import AvatarDemo from "@/pages/avatar-demo";
import FoodAnalyzer from "@/components/FoodAnalyzer";
import DietaryRecommendations from "@/components/DietaryRecommendations";
import AppleWatchIntegration from "@/components/AppleWatchIntegration";
import IPhoneWidgetGuide from "@/components/IPhoneWidgetGuide";
import NotificationDemo from "@/components/NotificationDemo";
import AvatarSetup from "@/pages/AvatarSetup";
import { FeatureShowcase } from "@/pages/FeatureShowcase";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <Switch>
          {/* Main platform routes */}
          <Route path="/" component={LeadGenLanding} />
          <Route path="/login" component={LoginPage} />
          <Route path="/user-profile" component={UserProfile} />
          <Route path="/dashboard" component={UserHomepage} />
          <Route path="/leadgen-dashboard" component={LeadGenDashboard} />
          <Route path="/business-dashboard" component={BusinessDashboard} />
          <Route path="/business-selector">
            {() => <BusinessSelector userId={1} userEmail="leedennyps@gmail.com" />}
          </Route>
          <Route path="/business/brezcode/dashboard" component={BrezCodeDashboard} />
          <Route path="/profile" component={ProfileEditor} />
          <Route path="/business-landing-creator" component={BusinessLandingCreator} />
          <Route path="/business-consultant" component={BusinessConsultant} />
          <Route path="/subscription" component={SubscribePage} />
          <Route path="/email-verification" component={EmailVerificationModule} />
          <Route path="/knowledge-centre" component={KnowledgeCentre} />
          <Route path="/ai-trainer" component={AITrainer} />
          <Route path="/ai-trainer-dashboard" component={AITrainerDashboard} />
          <Route path="/roleplay-training" component={RoleplayTraining} />
          <Route path="/ai-training" component={AiTrainingDashboard} />
          <Route path="/ai-training/session/:sessionId" component={AiTrainingSession} />
          <Route path="/avatar-setup" component={AvatarSetup} />
          <Route path="/feature-showcase" component={FeatureShowcase} />
          
          {/* Health platform routes (BrezCode) */}
          <Route path="/brezcode/quiz" component={QuizPage} />
          <Route path="/brezcode/quiz-transition" component={QuizTransition} />
          <Route path="/brezcode/report" component={ReportViewer} />
          <Route path="/brezcode/health-preferences" component={HealthPreferences} />
          <Route path="/brezcode/health-calendar" component={HealthCalendar} />
          <Route path="/brezcode/avatar-demo" component={AvatarDemo} />
          <Route path="/brezcode/food-analyzer" component={FoodAnalyzer} />
          <Route path="/brezcode/dietary-recommendations" component={DietaryRecommendations} />
          <Route path="/brezcode/apple-watch" component={AppleWatchIntegration} />
          <Route path="/brezcode/iphone-widget" component={IPhoneWidgetGuide} />
          <Route path="/brezcode/notifications" component={NotificationDemo} />
          
          {/* Default fallback */}
          <Route component={LeadGenLanding} />
        </Switch>
        
        {/* Mobile navigation components */}
        <BackButton />
        <BackToTopButton />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;