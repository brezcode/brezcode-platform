import { Route, Switch } from "wouter";
import LandingPage from "@/pages/landing";
import LoginPage from "@/pages/LoginPage";
import UserProfile from "@/pages/UserProfile";
import BusinessDashboard from "@/pages/BusinessDashboard";
import BusinessConsultant from "@/pages/BusinessConsultant";
import SubscribePage from "@/pages/subscribe";
import EmailVerificationModule from "@/components/EmailVerificationModule";
import BusinessSelector from "@/components/BusinessSelector";
import BrezCodeDashboard from "@/pages/BrezCodeDashboard";
import UserHomepage from "@/pages/user-homepage";
import QuizPage from "@/pages/quiz";
import QuizTransition from "@/components/quiz-transition";
import ReportViewer from "@/pages/report";
import KnowledgeCentre from "@/pages/KnowledgeCentre";
import AITrainer from "@/pages/AITrainer";
import RoleplayTraining from "@/pages/RoleplayTraining";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

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
          <Route path="/" component={LandingPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/user-profile" component={UserProfile} />
          <Route path="/dashboard" component={UserHomepage} />
          <Route path="/business-dashboard" component={BusinessDashboard} />
          <Route path="/business-selector">
            {() => <BusinessSelector userId={1} userEmail="leedennyps@gmail.com" />}
          </Route>
          <Route path="/business/brezcode/dashboard" component={BrezCodeDashboard} />
          <Route path="/business-consultant" component={BusinessConsultant} />
          <Route path="/subscription" component={SubscribePage} />
          <Route path="/email-verification" component={EmailVerificationModule} />
          <Route path="/knowledge-centre" component={KnowledgeCentre} />
          <Route path="/ai-trainer" component={AITrainer} />
          <Route path="/roleplay-training" component={RoleplayTraining} />
          <Route path="/avatar-setup" component={AvatarSetup} />
          
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
          <Route component={LandingPage} />
        </Switch>
        
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;