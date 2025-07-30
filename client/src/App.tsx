import { Route, Switch } from "wouter";
import { LeadGenLanding } from "@/pages/LeadGenLanding";
import LoginPage from "@/pages/LoginPage";
import UserProfile from "@/pages/UserProfile";
import UserProfileTest from "@/pages/UserProfileTest";
import BusinessDashboard from "@/pages/BusinessDashboard";
import BusinessConsultant from "@/pages/BusinessConsultant";
import BrezCodeBusinessProfile from "@/pages/BrezCodeBusinessProfile";
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
import PersonalizedReportPage from "@/pages/personalized-report";
import KnowledgeCentre from "@/pages/KnowledgeCentre";
import AITrainer from "@/pages/AITrainer";
import AITrainerDashboard from "@/pages/AITrainerDashboard";
import RoleplayTraining from "@/pages/RoleplayTraining";
import { AiTrainingDashboard } from "@/pages/AiTrainingDashboard";
import { AiTrainingSession } from "@/pages/AiTrainingSession";
import { AITrainingSetup } from "@/pages/AITrainingSetup";
import AvatarTrainingSetup from "@/pages/AvatarTrainingSetup";
import BusinessAvatarManager from "@/pages/BusinessAvatarManager";
import PersonalAvatarManager from "@/pages/PersonalAvatarManager";
import BusinessAvatarTraining from "@/pages/BusinessAvatarTraining";
import BrezCodeAvatarTraining from "@/pages/BrezCodeAvatarTraining";
import AIConversationTraining from "@/pages/AIConversationTraining";
import TrainingPerformance from "@/pages/TrainingPerformance";
import TrainingSessionDetails from "@/pages/TrainingSessionDetails";
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
import CodingAssistant from "@/pages/CodingAssistant";
import KnowledgeCenter from "@/pages/KnowledgeCenter";
import LandingPage from "@/pages/landing";
import HomePage from "@/pages/HomePage";
import BrezcodeAvatarChat from "@/pages/BrezcodeAvatarChat";
import AuthenticatedBrezCodeRedirect from "@/components/AuthenticatedBrezCodeRedirect";
// BrezCodeLanding removed - using original landing page
import BrezCodePersonalDashboard from "@/pages/BrezCodePersonalDashboard";

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
          {/* HomePage with dual platform selection */}
          <Route path="/" component={HomePage} />
          {/* BrezCode landing page */}
          <Route path="/brezcode" component={LandingPage} />
          <Route path="/leadgen" component={LeadGenLanding} />
          <Route path="/dashboard" component={UserHomepage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/user-profile" component={UserProfile} />
          <Route path="/profile-test" component={UserProfileTest} />
          <Route path="/leadgen-dashboard" component={LeadGenDashboard} />
          <Route path="/business-dashboard" component={BusinessDashboard} />
          <Route path="/business-selector">
            {() => <BusinessSelector userId={1} userEmail="leedennyps@gmail.com" />}
          </Route>
          <Route path="/business/brezcode/dashboard" component={BrezCodeDashboard} />
          <Route path="/business/brezcode/profile" component={BrezCodeBusinessProfile} />
          <Route path="/profile" component={ProfileEditor} />
          <Route path="/business-landing-creator" component={BusinessLandingCreator} />
          <Route path="/business-consultant" component={BusinessConsultant} />
          <Route path="/subscription" component={SubscribePage} />
          <Route path="/email-verification">
            {() => <EmailVerificationModule 
              email="leedennyps@gmail.com" 
              onVerificationComplete={() => {}} 
              onBack={() => {}} 
              config={{}} 
            />}
          </Route>
          <Route path="/knowledge-centre" component={KnowledgeCentre} />
          <Route path="/ai-trainer" component={AITrainer} />
          <Route path="/ai-trainer-dashboard" component={AITrainerDashboard} />
          <Route path="/roleplay-training" component={RoleplayTraining} />
          <Route path="/ai-training" component={AiTrainingDashboard} />
          <Route path="/ai-training/setup" component={AITrainingSetup} />
          <Route path="/ai-training/session/:sessionId" component={AiTrainingSession} />
          <Route path="/avatar-setup" component={AvatarSetup} />
          <Route path="/avatar-training-setup" component={AvatarTrainingSetup} />
          <Route path="/business-avatar-manager" component={BusinessAvatarManager} />
          <Route path="/personal-avatars" component={PersonalAvatarManager} />
          <Route path="/business-avatar-training" component={BusinessAvatarTraining} />
          <Route path="/business/brezcode/avatar-training" component={BrezCodeAvatarTraining} />
          <Route path="/ai-conversation-training" component={AIConversationTraining} />
          <Route path="/performance" component={TrainingPerformance} />
          <Route path="/training-session/:sessionId" component={TrainingSessionDetails} />
          <Route path="/feature-showcase" component={FeatureShowcase} />
          <Route path="/coding-assistant" component={CodingAssistant} />
          <Route path="/knowledge-center" component={KnowledgeCenter} />
          
          {/* Health platform routes (BrezCode) */}
          <Route path="/brezcode/quiz" component={QuizPage} />
          <Route path="/brezcode/quiz-transition">
            {() => <QuizTransition onContinue={() => {}} />}
          </Route>
          <Route path="/brezcode/report" component={PersonalizedReportPage} />
          <Route path="/brezcode/personalized-report" component={PersonalizedReportPage} />
          <Route path="/brezcode/health-preferences" component={HealthPreferences} />
          <Route path="/brezcode/health-calendar" component={HealthCalendar} />
          <Route path="/brezcode/avatar-demo" component={AvatarDemo} />
          <Route path="/brezcode/food-analyzer" component={FoodAnalyzer} />
          <Route path="/brezcode/dietary-recommendations" component={DietaryRecommendations} />
          <Route path="/brezcode/apple-watch">
            {() => <AppleWatchIntegration onHealthDataUpdate={() => {}} />}
          </Route>
          <Route path="/brezcode/iphone-widget" component={IPhoneWidgetGuide} />
          <Route path="/brezcode/notifications" component={NotificationDemo} />
          <Route path="/brezcode/avatar-chat" component={BrezcodeAvatarChat} />
          
          {/* BrezCode Platform Routes */}
          <Route path="/brezcode" component={LandingPage} />
          <Route path="/brezcode/personal-dashboard" component={BrezCodePersonalDashboard} />
          
          {/* LeadGen platform page */}
          <Route path="/leadgen" component={LeadGenLanding} />
          
          {/* Original Landing Page for legacy routes */}
          <Route path="/landing-page" component={LandingPage} />
          
          {/* Default fallback - home page with platform choices */}
          <Route component={HomePage} />
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