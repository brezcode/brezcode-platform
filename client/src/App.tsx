import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { BrandProvider } from "@/components/BrandProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/components/LanguageSelector";
import LandingPage from "@/pages/landing";
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
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/quiz" component={QuizPage} />
      <Route path="/report" component={ReportPage} />
      <Route path="/test-report" component={TestReportPage} />
      <Route path="/demo-report" component={DemoReportPage} />
      <Route path="/personalized-report" component={PersonalizedReportPage} />
      <Route path="/chat" component={ChatPage} />
      <Route path="/subscribe/:tier" component={SubscribePage} />
      <Route path="/admin" component={AdminPage} />
      <Route component={NotFound} />
    </Switch>
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
