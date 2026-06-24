import { create } from 'zustand';

type ModalMode = 'success' | 'notice';

type CelebrationOptions = {
  detail?: string | null;
  onDismiss?: (() => void) | null;
};

type NoticeOptions = {
  title: string;
  message: string;
  tone?: 'info' | 'error';
  onDismiss?: (() => void) | null;
};

type SubscriptionExperienceState = {
  visible: boolean;
  mode: ModalMode;
  detail: string | null;
  title: string | null;
  message: string | null;
  tone: 'info' | 'error';
  onDismiss: (() => void) | null;
  showSuccess: (options?: CelebrationOptions) => void;
  showNotice: (options: NoticeOptions) => void;
  hide: () => void;
};

export const useSubscriptionCelebrationStore = create<SubscriptionExperienceState>(
  (set, get) => ({
    visible: false,
    mode: 'success',
    detail: null,
    title: null,
    message: null,
    tone: 'info',
    onDismiss: null,
    showSuccess: (options) => {
      set({
        visible: true,
        mode: 'success',
        detail: options?.detail?.trim() || null,
        title: null,
        message: null,
        tone: 'info',
        onDismiss: options?.onDismiss ?? null,
      });
    },
    showNotice: (options) => {
      set({
        visible: true,
        mode: 'notice',
        detail: null,
        title: options.title.trim(),
        message: options.message.trim(),
        tone: options.tone ?? 'info',
        onDismiss: options.onDismiss ?? null,
      });
    },
    hide: () => {
      const callback = get().onDismiss;
      set({
        visible: false,
        mode: 'success',
        detail: null,
        title: null,
        message: null,
        tone: 'info',
        onDismiss: null,
      });
      callback?.();
    },
  }),
);

export function showAnglerUnlockedCelebration(options?: CelebrationOptions): void {
  useSubscriptionCelebrationStore.getState().showSuccess(options);
}

export function showSubscriptionNotice(options: NoticeOptions): void {
  useSubscriptionCelebrationStore.getState().showNotice(options);
}
