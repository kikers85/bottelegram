import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppShell } from './examples/AppShell';
import { Dashboard } from './examples/Dashboard';

/* ═══════════════════════════════════════════════════
   Main App — SecureBot Lab Template
   Handles routing and layout orchestration
   ═══════════════════════════════════════════════════ */

export function App() {
  return (
    <AppShell activeNav="dashboard">
      <AnimatePresence mode="wait">
        <Routes>
          {/* Main Dashboard */}
          <Route path="/" element={<Dashboard />} />
          
          {/* 
            Add more routes here:
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/moderation/manual" element={<ManualMod />} />
          */}
        </Routes>
      </AnimatePresence>
    </AppShell>
  );
}

export default App;
