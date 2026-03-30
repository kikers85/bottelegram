import { FlowBuilder } from './components/FlowBuilder';
import { DialogManager } from './components/dialogs/DialogManager';

/**
 * Main App Component
 * Entry point for the SecureBot Builder application.
 */
function App() {
  return (
    <div className="w-full h-screen overflow-hidden">
      <FlowBuilder />
      <DialogManager />
    </div>
  );
}

export default App;
