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

function Router() {
  return (
    <>
      <DomainRouter />
      <Switch>
        {/* Root paths */}
        <Route path="/" component={DomainLanding} />
        <Route path="/admin" component={AdminPage} />
        
        {/* Brand-specific paths */}
        <Route path="/:brand" component={LandingPage} />
        <Route path="/:brand/quiz" component={QuizPage} />
        <Route path="/:brand/avatar-quiz" component={() => import("@/pages/avatar-quiz")} />
        <Route path="/:brand/avatar-demo" component={() => import("@/pages/avatar-demo")} />
        <Route path="/:brand/health-calendar" component={() => import("@/pages/health-calendar")} />
        <Route path="/:brand/health-preferences" component={() => import("@/pages/health-preferences")} />
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
