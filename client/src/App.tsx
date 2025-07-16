import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import LandingPage from "@/pages/landing";
import ChatPage from "@/pages/chat";
import QuizPage from "@/pages/quiz";
import ReportPage from "@/pages/report";
import TestReportPage from "@/pages/test-report";
import SubscribePage from "@/pages/subscribe";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/quiz" component={QuizPage} />
      <Route path="/report" component={ReportPage} />
      <Route path="/test-report" component={TestReportPage} />
      <Route path="/chat" component={ChatPage} />
      <Route path="/subscribe/:tier" component={SubscribePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
