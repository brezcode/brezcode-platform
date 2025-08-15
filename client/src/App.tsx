import { Route, Switch } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import LoginPage from "@/pages/LoginPage";
import BrezCodeLogin from "@/pages/BrezCodeLogin";
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
import MediaResearchPage from "@/pages/MediaResearchPage";
import MediaResearchModulePage from "@/pages/MediaResearchModulePage";
import PersonalAvatarManager from "@/pages/PersonalAvatarManager";
import BusinessAvatarTraining from "@/pages/BusinessAvatarTraining";
import BrezCodeAvatarTraining from "@/pages/BrezCodeAvatarTraining";
import AIConversationTraining from "@/pages/AIConversationTraining";
import TrainingPerformance from "@/pages/TrainingPerformance";
import TrainingSessionDetails from "@/pages/TrainingSessionDetails";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { BackToTopButton, BackButton } from "@/components/MobileNavigation";

// Health-related pages (Core BrezCode Features)
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
import BrezCodePersonalDashboard from "@/pages/BrezCodePersonalDashboard";
import BrezCodeAdminDemo from "@/pages/BrezCodeAdminDemo";

// Enhanced BrezCode with additional capabilities from other platforms
import LeadGenDashboard from "@/pages/LeadGenDashboard";
import { LeadGenLanding } from "@/pages/LeadGenLanding";

// Additional health analysis tools (from SkinCoach integration)
import SkinCoachCamera from "@/pages/SkinCoachCamera";
import SkinCoachCameraAdvanced from "@/pages/SkinCoachCameraAdvanced";
import SkinLesionTest from "@/pages/SkinLesionTest";

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
        <Switch location={useHashLocation}>
          {/* Main BrezCode Landing Page */}
          <Route path="/" component={LandingPage} />
          
          {/* Core BrezCode Platform Routes */}
          <Route path="/dashboard" component={UserHomepage} />
          <Route path="/personal-dashboard" component={BrezCodePersonalDashboard} />
          <Route path="/login" component={BrezCodeLogin} />
          <Route path="/brezcode-login" component={BrezCodeLogin} />
          <Route path="/user-profile" component={UserProfile} />
          <Route path="/profile-test" component={UserProfileTest} />
          
          {/* Health Assessment & Coaching */}
          <Route path="/quiz" component={QuizPage} />
          <Route path="/quiz-transition">
            {() => <QuizTransition onContinue={() => {}} />}
          </Route>
          <Route path="/report" component={PersonalizedReportPage} />
          <Route path="/personalized-report" component={PersonalizedReportPage} />
          <Route path="/health-preferences" component={HealthPreferences} />
          <Route path="/health-calendar" component={HealthCalendar} />
          <Route path="/avatar-demo" component={AvatarDemo} />
          <Route path="/avatar-chat" component={BrezcodeAvatarChat} />
          
          {/* Nutrition & Wellness Features */}
          <Route path="/food-analyzer" component={FoodAnalyzer} />
          <Route path="/dietary-recommendations" component={DietaryRecommendations} />
          
          {/* Technology Integration */}
          <Route path="/apple-watch">
            {() => <AppleWatchIntegration onHealthDataUpdate={() => {}} />}
          </Route>
          <Route path="/iphone-widget" component={IPhoneWidgetGuide} />
          <Route path="/notifications" component={NotificationDemo} />
          
          {/* Enhanced Skin Health Features (integrated from SkinCoach) */}
          <Route path="/skin-analysis" component={SkinCoachCameraAdvanced} />
          <Route path="/skin-lesion-test" component={SkinLesionTest} />
          <Route path="/skin-camera" component={SkinCoachCamera} />
          
          {/* Business & Professional Features (from LeadGen) */}
          <Route path="/business-dashboard" component={BusinessDashboard} />
          <Route path="/business-tools" component={LeadGenDashboard} />
          <Route path="/business-selector">
            {() => <BusinessSelector userId={1} userEmail="support@brezcode.com" />}
          </Route>
          <Route path="/business-profile" component={BrezCodeBusinessProfile} />
          <Route path="/profile" component={ProfileEditor} />
          <Route path="/business-landing-creator" component={BusinessLandingCreator} />
          <Route path="/business-consultant" component={BusinessConsultant} />
          
          {/* AI Training & Avatar Management */}
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
          <Route path="/avatar-training" component={BrezCodeAvatarTraining} />
          <Route path="/ai-conversation-training" component={AIConversationTraining} />
          <Route path="/performance" component={TrainingPerformance} />
          <Route path="/training-session/:sessionId" component={TrainingSessionDetails} />
          
          {/* Media Research & Content Tools */}
          <Route path="/media-research" component={MediaResearchPage} />
          <Route path="/media-research-module" component={MediaResearchModulePage} />
          
          {/* Developer & Advanced Features */}
          <Route path="/feature-showcase" component={FeatureShowcase} />
          <Route path="/coding-assistant" component={CodingAssistant} />
          <Route path="/knowledge-center" component={KnowledgeCenter} />
          
          {/* Admin & Management */}
          <Route path="/admin" component={BrezCodeAdminDemo} />
          <Route path="/subscription" component={SubscribePage} />
          <Route path="/email-verification">
            {() => <EmailVerificationModule 
              email="support@brezcode.com" 
              onVerificationComplete={() => {}} 
              onBack={() => {}} 
              config={{}} 
            />}
          </Route>
          
          {/* Legacy/Compatibility Routes */}
          <Route path="/landing-page" component={LandingPage} />
          <Route path="/home" component={HomePage} />
          
          {/* Default fallback */}
          <Route component={LandingPage} />
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