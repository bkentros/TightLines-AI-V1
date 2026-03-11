import { create } from 'zustand';
import type { Session, User } from '../lib/supabase';
import type { UserProfile, OnboardingPrefs } from '../lib/types';
import { supabase } from '../lib/supabase';

interface AuthState {
  // Core auth
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;

  // Derived status
  isLoading: boolean;
  isProfileLoading: boolean;
  isOnboarded: boolean;

  // Onboarding draft (held in memory between step-2 and step-3)
  onboardingPrefs: Partial<OnboardingPrefs>;

  // Actions
  setSession: (session: Session | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setOnboardingPrefs: (prefs: Partial<OnboardingPrefs>) => void;
  clearOnboardingPrefs: () => void;
  fetchProfile: (userId: string) => Promise<void>;
  signOut: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  isProfileLoading: false,
  isOnboarded: false,
  onboardingPrefs: {},

  setSession: (session) => {
    set({
      session,
      user: session?.user ?? null,
    });
  },

  setProfile: (profile) => {
    set({
      profile,
      isOnboarded: profile?.onboarding_complete ?? false,
    });
  },

  setOnboardingPrefs: (prefs) => {
    set((state) => ({
      onboardingPrefs: { ...state.onboardingPrefs, ...prefs },
    }));
  },

  clearOnboardingPrefs: () => {
    set({ onboardingPrefs: {} });
  },

  fetchProfile: async (userId: string) => {
    set({ isProfileLoading: true });
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        set({ profile: null, isOnboarded: false });
        return;
      }

      set({
        profile: data as UserProfile,
        isOnboarded: (data as UserProfile).onboarding_complete,
      });
    } finally {
      set({ isProfileLoading: false });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    const { useEnvStore } = await import('./envStore');
    useEnvStore.getState().clear();
    set({
      session: null,
      user: null,
      profile: null,
      isOnboarded: false,
      isProfileLoading: false,
      onboardingPrefs: {},
    });
  },

  hydrate: async () => {
    set({ isLoading: true });
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        set({ session, user: session.user });
        await get().fetchProfile(session.user.id);
      } else {
        set({ session: null, user: null, profile: null, isOnboarded: false });
      }
    } catch {
      set({ session: null, user: null, profile: null, isOnboarded: false });
    } finally {
      set({ isLoading: false });
    }
  },
}));
