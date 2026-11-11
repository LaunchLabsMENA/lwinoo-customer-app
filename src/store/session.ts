import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import type { Me, Tokens } from '../api/types';

const STORAGE_KEY = '@lwinoo/session';
const GUEST_KEY = '@lwinoo/guest';

type Persisted = { tokens: Tokens; me: Me | null };

type SessionState = {
  hydrated: boolean;
  tokens: Tokens | null;
  me: Me | null;
  // Browsing without an account. Local only: no guest session exists on the server.
  isGuest: boolean;
  hydrate: () => Promise<void>;
  setSession: (tokens: Tokens, me: Me) => void;
  setTokens: (tokens: Tokens) => void;
  setMe: (me: Me) => void;
  clear: () => void;
  enterGuest: () => void;
  exitGuest: () => void;
};

const persist = (state: Pick<SessionState, 'tokens' | 'me'>) => {
  const job = state.tokens
    ? AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ tokens: state.tokens, me: state.me } satisfies Persisted))
    : AsyncStorage.removeItem(STORAGE_KEY);
  job.catch(() => {});
};

const persistGuest = (isGuest: boolean) => {
  (isGuest ? AsyncStorage.setItem(GUEST_KEY, '1') : AsyncStorage.removeItem(GUEST_KEY)).catch(() => {});
};

export const useSession = create<SessionState>((set, get) => ({
  hydrated: false,
  tokens: null,
  me: null,
  isGuest: false,
  hydrate: async () => {
    if (get().hydrated) return;
    try {
      const [raw, guest] = await Promise.all([AsyncStorage.getItem(STORAGE_KEY), AsyncStorage.getItem(GUEST_KEY)]);
      if (raw) {
        const saved = JSON.parse(raw) as Persisted;
        if (saved.tokens?.accessToken && saved.tokens.refreshToken) {
          set({ tokens: saved.tokens, me: saved.me ?? null, hydrated: true });
          return;
        }
      }
      if (guest) {
        set({ isGuest: true, hydrated: true });
        return;
      }
    } catch {}
    set({ hydrated: true });
  },
  setSession: (tokens, me) => {
    set({ tokens, me, isGuest: false });
    persist({ tokens, me });
    persistGuest(false);
  },
  setTokens: tokens => {
    set({ tokens });
    persist({ tokens, me: get().me });
  },
  setMe: me => {
    set({ me });
    persist({ tokens: get().tokens, me });
  },
  clear: () => {
    set({ tokens: null, me: null });
    persist({ tokens: null, me: null });
  },
  enterGuest: () => {
    set({ tokens: null, me: null, isGuest: true });
    persist({ tokens: null, me: null });
    persistGuest(true);
  },
  exitGuest: () => {
    set({ isGuest: false });
    persistGuest(false);
  },
}));
