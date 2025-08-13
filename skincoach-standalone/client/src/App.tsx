import React from 'react';
import { Router, Route, Switch } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SkinCoachLanding from './pages/SkinCoachLanding';
import SkinCoachCamera from './pages/SkinCoachCamera';
import SkinCoachResults from './pages/SkinCoachResults';
import SkinCoachChat from './pages/SkinCoachChat';
import SkinLesionTest from './pages/SkinLesionTest';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Switch>
          <Route path="/" component={SkinCoachLanding} />
          <Route path="/camera" component={SkinCoachCamera} />
          <Route path="/results" component={SkinCoachResults} />
          <Route path="/chat" component={SkinCoachChat} />
          <Route path="/skin-lesion-test" component={SkinLesionTest} />
          <Route>404 - Page Not Found</Route>
        </Switch>
      </Router>
    </QueryClientProvider>
  );
}

export default App;