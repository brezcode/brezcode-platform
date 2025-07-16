import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import LandingPage from "@/pages/landing";
import ChatPage from "@/pages/chat";
import QuizPage from "@/pages/quiz";
import SubscribePage from "@/pages/subscribe";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, loading } = useFirebaseAuth();

  return (
    <Switch>
      {loading || !isAuthenticated ? (
        <>
          <Route path="/" component={LandingPage} />
          <Route path="/quiz" component={QuizPage} />
          <Route path="/subscribe/:tier" component={SubscribePage} />
        </>
      ) : (
        <>
          <Route path="/" component={ChatPage} />
          <Route path="/chat" component={ChatPage} />
          <Route path="/quiz" component={QuizPage} />
          <Route path="/subscribe/:tier" component={SubscribePage} />
        </>
      )}
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
