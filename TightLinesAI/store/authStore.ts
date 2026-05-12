import { create } from 'zustand';
import type { Session, User } from '../lib/supabase';
import type { UserProfile, OnboardingPrefs } from '../lib/types';
import { isRefreshTokenRevokedError } from '../lib/authSessionErrors';
import { supabase } from '../lib/supabase';
import { useEnvStore } from './envStore';

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
    const currentProfile = get().profile;
    const profileMatchesSession =
      !!session?.user && currentProfile?.id === session.user.id;
    const userChanged =
      !!session?.user && !profileMatchesSession;
    set({
      session,
      user: session?.user ?? null,
      isProfileLoading: userChanged ? true : false,
      profile: profileMatchesSession ? currentProfile : null,
      isOnboarded: profileMatchesSession ? currentProfile.onboarding_complete : false,
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
        const current = get().profile;
        // Don’t clobber a completed profile on transient failures (slow network,
        // token-refresh racing the onboarding upsert, RLS blips). Only a successful
        // select above replaces state; PGRST116 with no local row still clears below.
        if (current?.id === userId && current.onboarding_complete) {
          return;
        }
        if (
          error?.code === 'PGRST116' ||
          (typeof error?.message === 'string' &&
            /0 rows|single.*not found/i.test(error.message))
        ) {
          set({ profile: null, isOnboarded: false });
        }
        return;
      }

      if (get().user?.id !== userId) return;
      set({
        profile: data as UserProfile,
        isOnboarded: (data as UserProfile).onboarding_complete,
      });
    } finally {
      set({ isProfileLoading: false });
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        await supabase.auth.signOut({ scope: 'local' });
      }
    } catch {
      await supabase.auth.signOut({ scope: 'local' });
    }
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
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError && isRefreshTokenRevokedError(sessionError)) {
        await supabase.auth.signOut({ scope: 'local' });
        supabase.functions.setAuth('');
        set({ session: null, user: null, profile: null, isOnboarded: false });
        return;
      }

      if (session?.user) {
        supabase.functions.setAuth(session.access_token);
        set({ session, user: session.user });
        await get().fetchProfile(session.user.id);
      } else {
        supabase.functions.setAuth('');
        set({ session: null, user: null, profile: null, isOnboarded: false });
      }
    } catch (e) {
      supabase.functions.setAuth('');
      if (isRefreshTokenRevokedError(e)) {
        await supabase.auth.signOut({ scope: 'local' });
      }
      set({ session: null, user: null, profile: null, isOnboarded: false });
    } finally {
      set({ isLoading: false });
    }
  },
}));
