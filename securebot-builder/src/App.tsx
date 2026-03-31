import React from 'react';
import { useAuthStore } from './store/useAuthStore';
import { FlowBuilder } from './components/FlowBuilder';
import { DialogManager } from './components/dialogs/DialogManager';
import { LoginView } from './components/auth/LoginView';
import { RegisterView } from './components/auth/RegisterView';
import { OnboardingView } from './components/auth/OnboardingView';
import { Loader2 } from 'lucide-react';

/**
 * Main App Component
 * Entry point for the SecureBot Builder application.
 */
function App() {
  const { session, user, isLoading, initialize } = useAuthStore();
  const [authMode, setAuthMode] = React.useState<'login' | 'register'>('login');

  React.useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-base flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
      </div>
    );
  }

  // Auth Guard
  if (!session) {
    if (authMode === 'register') {
      return <RegisterView onSwitchToLogin={() => setAuthMode('login')} />;
    }
    return <LoginView onSwitchToRegister={() => setAuthMode('register')} />;
  }

  // Onboarding Guard (Profile Setup)
  if (!user) {
    return <OnboardingView />;
  }

  return (
    <div className="flex h-screen bg-surface-base overflow-hidden font-sans">
      <FlowBuilder />
      <DialogManager />
    </div>
  );
}

export default App;
