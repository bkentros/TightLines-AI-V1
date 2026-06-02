import { create } from 'zustand';
import type { Session, User } from '../lib/supabase';
import type { UserProfile, OnboardingPrefs } from '../lib/types';
import { isRefreshTokenRevokedError } from '../lib/authSessionErrors';
import { supabase } from '../lib/supabase';
import { useEnvStore } from './envStore';

const PROFILE_FETCH_TIMEOUT_MS = 12_000;

function getErrorMessage(err: unknown): string {
  if (err instanceof Error && err.message) return err.message;
  if (err && typeof err === 'object') {
    const maybeMessage = (err as { message?: unknown }).message;
    if (typeof maybeMessage === 'string' && maybeMessage) return maybeMessage;
  }
  return String(err);
}

function isAbortLikeError(err: unknown): boolean {
  if (err instanceof Error) {
    return err.name === 'AbortError' || /abort|timed out|timeout/i.test(err.message);
  }
  return /abort|timed out|timeout/i.test(String(err));
}

async function fetchProfileRow(userId: string) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error('Profile request timed out. Check your connection and try again.'));
    }, PROFILE_FETCH_TIMEOUT_MS);
  });
  const query = supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  try {
    return await Promise.race([query, timeout]);
  } catch (err) {
    const timedOut = isAbortLikeError(err);
    return {
      data: null,
      error: {
        code: timedOut ? 'PROFILE_FETCH_TIMEOUT' : 'PROFILE_FETCH_ERROR',
        message: timedOut
          ? 'Profile request timed out. Check your connection and try again.'
          : getErrorMessage(err),
      },
    };
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

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
    if (!session) {
      set({
        session: null,
        user: null,
        isProfileLoading: false,
        profile: null,
        isOnboarded: false,
      });
      return;
    }

    const currentProfile = get().profile;
    const currentUser = get().user;
    const profileMatchesSession =
      currentProfile?.id === session.user.id;
    const userChanged =
      currentUser?.id !== session.user.id;
    set({
      session,
      user: session.user,
      isProfileLoading: !profileMatchesSession,
      profile: profileMatchesSession ? currentProfile : null,
      isOnboarded: profileMatchesSession
        ? currentProfile.onboarding_complete
        : userChanged
          ? false
          : get().isOnboarded,
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
      const { data, error } = await fetchProfileRow(userId);

      if (error || !data) {
        const current = get().profile;
        // Don’t clobber a completed profile on transient failures (slow network,
        // token-refresh racing the onboarding upsert, RLS blips). Only a successful
        // select above replaces state; PGRST116 with no local row still clears below.
        if (__DEV__ && error) {
          console.warn('[auth] fetchProfile failed:', error.message);
        }
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
