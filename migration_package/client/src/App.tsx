import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import HomePage from "@/pages/HomePage";
import QuizPage from "@/pages/QuizPage";
import PersonalizedReportPage from "@/pages/PersonalizedReportPage";
import RegistrationPage from "@/pages/RegistrationPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error: any) => {
        if (error?.status === 401) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/quiz" component={QuizPage} />
          <Route path="/personalized-report" component={PersonalizedReportPage} />
          <Route path="/register" component={RegistrationPage} />
          <Route>404 Page Not Found</Route>
        </Switch>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;