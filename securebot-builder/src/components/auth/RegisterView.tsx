import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Zap, Mail, Lock, Loader2, UserPlus } from 'lucide-react';
import { alerts } from '../../lib/alerts';

interface RegisterViewProps {
  onSwitchToLogin: () => void;
}

export function RegisterView({ onSwitchToLogin }: RegisterViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp } = useAuthStore();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) return alerts.error('Error', 'Por favor, completa todos los campos.');
    if (password !== confirmPassword) return alerts.error('Error', 'Las contraseñas no coinciden.');

    setIsSubmitting(true);
    try {
      const { user, error } = await signUp(email, password);
      if (error) throw error;
      if (user) {
        alerts.success('Cuenta Creada', 'Revisa tu correo para confirmación o procede a la configuración.');
      }
    } catch (err: any) {
      alerts.error('Error al Registrarse', err.message || 'No se pudo crear la cuenta.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-base flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-3xl border border-border-light shadow-xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-100">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-text-primary">Crear Cuenta</h2>
          <p className="text-text-muted mt-2">Comienza tu viaje como arquitecto de bots.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-1.5 ml-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-border-light rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                placeholder="name@company.com"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-1.5 ml-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-border-light rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-1.5 ml-1">Confirmar Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-border-light rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 relative mt-4 overflow-hidden"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Registrarse</span>
                <Zap className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-sm text-text-muted">
            ¿Ya tienes una cuenta?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-indigo-600 font-bold hover:underline"
            >
              Iniciar Sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
