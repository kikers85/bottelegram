import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { type UserProfile } from '../lib/validations/schemas';

interface AuthState {
  session: any | null;
  user: UserProfile | null;
  isLoading: boolean;
  initialized: boolean;
  
  signIn: (email: string, pass: string) => Promise<{ error: any }>;
  signUp: (email: string, pass: string) => Promise<{ user: any; error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  isLoading: true,
  initialized: false,

  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  },

  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    return { user: data.user, error };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null });
  },

  updateProfile: async (profile) => {
    const { session } = get();
    if (!session?.user) return;

    const { data, error } = await supabase
      .from('users')
      .upsert({ id: session.user.id, email: session.user.email, ...profile })
      .select()
      .single();

    if (!error) set({ user: data });
    else throw error;
  },

  initialize: async () => {
    if (get().initialized) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({ session, isLoading: !!session });

      if (session) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        set({ user: profile });
      }
    } catch (err) {
      console.error('Initialization error:', err);
    } finally {
      set({ isLoading: false, initialized: true });
    }

    supabase.auth.onAuthStateChange(async (_event, session) => {
      // Don't set loading true on auth state change to avoid flickers
      set({ session });
      if (session) {
         try {
           const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          set({ user: profile });
         } catch (e) {
           console.error('Profile fetch error:', e);
         }
      } else {
        set({ user: null });
      }
      set({ isLoading: false });
    });
  }
}));
