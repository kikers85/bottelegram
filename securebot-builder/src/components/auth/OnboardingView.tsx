import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { User, Users, Shield, Check, Loader2 } from 'lucide-react';
import { alerts } from '../../lib/alerts';
import { cn } from '../../lib/cn';

export function OnboardingView() {
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'admin' | 'agent'>('agent');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateProfile } = useAuthStore();

  const handleCompleteSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) return alerts.error('Error', 'Please enter your full name.');

    setIsSubmitting(true);
    try {
      await updateProfile({ full_name: fullName, role });
      alerts.success('Setup Complete', 'Your professional profile is ready.');
    } catch (err: any) {
      alerts.error('Setup Failed', err.message || 'Could not complete profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-base flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-8 bg-white p-10 rounded-3xl border border-border-light shadow-xl text-center">
        <div>
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-100 shadow-sm">
            <User className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-text-primary">Complete Your Profile</h2>
          <p className="text-text-muted mt-2">Define your identity as a bot workspace member.</p>
        </div>

        <form onSubmit={handleCompleteSetup} className="space-y-8 text-left">
          {/* Role Selection */}
          <div className="space-y-4">
            <label className="block text-xs font-bold text-text-muted uppercase ml-1">Select Your Professional Role</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={cn(
                  "p-6 rounded-2xl border-2 transition-all text-left relative",
                  role === 'admin' 
                    ? "border-brand-500 bg-brand-50 shadow-brand-100 shadow-lg" 
                    : "border-border-light bg-slate-50 hover:border-brand-200"
                )}
              >
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-sm", role === 'admin' ? "bg-brand-500 text-white" : "bg-white text-text-muted")}>
                  <Shield className="w-6 h-6" />
                </div>
                <div className="font-bold text-text-primary mb-1">Administrator</div>
                <p className="text-[10px] text-text-muted leading-tight">Full access to billing, agents, and workspace settings.</p>
                {role === 'admin' && <div className="absolute top-4 right-4 w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
              </button>

              <button
                type="button"
                onClick={() => setRole('agent')}
                className={cn(
                  "p-6 rounded-2xl border-2 transition-all text-left relative",
                  role === 'agent' 
                    ? "border-indigo-600 bg-indigo-50 shadow-indigo-100 shadow-lg" 
                    : "border-border-light bg-slate-50 hover:border-brand-200"
                )}
              >
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-sm", role === 'agent' ? "bg-indigo-600 text-white" : "bg-white text-text-muted")}>
                  <Users className="w-6 h-6" />
                </div>
                <div className="font-bold text-text-primary mb-1">Agent</div>
                <p className="text-[10px] text-text-muted leading-tight">Build and manage bots, flows, and interact with customers.</p>
                {role === 'agent' && <div className="absolute top-4 right-4 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase mb-2 ml-1">What's your full name?</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border border-border-light rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none text-sm transition-all"
                placeholder="Tony Stark"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-brand-100 mt-6 relative overflow-hidden group"
          >
            {isSubmitting ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <span className="font-bold">Finish Professional Setup</span>
                <Check className="w-5 h-5 transition-transform group-hover:scale-110" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
