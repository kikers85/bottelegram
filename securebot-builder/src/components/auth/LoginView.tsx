import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Zap, Mail, Lock, Loader2 } from 'lucide-react';
import { alerts } from '../../lib/alerts';

interface LoginViewProps {
  onSwitchToRegister: () => void;
}

export function LoginView({ onSwitchToRegister }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return alerts.error('Error', 'Por favor, completa todos los campos.');

    setIsSubmitting(true);
    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      alerts.success('¡Bienvenido de nuevo!', 'Inicio de sesión exitoso.');
    } catch (err: any) {
      alerts.error('Error al Iniciar Sesión', err.message || 'Credenciales inválidas.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-base flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-3xl border border-border-light shadow-xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-200">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-text-primary">Bienvenido de nuevo</h2>
          <p className="text-text-muted mt-2">Inicia sesión para gestionar tu imperio de bots.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase mb-1.5 ml-1">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-border-light rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none transition-all text-sm"
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
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-border-light rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none transition-all text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary py-3.5 rounded-2xl flex items-center justify-center gap-2 group relative overflow-hidden"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
             ) : (
              <>
                <span>Iniciar Sesión</span>
                <Zap className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-sm text-text-muted">
            ¿No tienes una cuenta?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-brand-600 font-bold hover:underline"
            >
              Regístrate
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
