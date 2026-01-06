// Utilities
import { defineStore } from "pinia";

const createRequestState = () => ({
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  error: null,
  lastUpdated: null,
});

const generateNotificationId = () => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `notice-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const useAppStore = defineStore("app", {
  state: () => ({
    globalLoading: false,
    notifications: [],
    requests: {},
  }),
  getters: {
    requestState: (state) => (key) =>
      state.requests[key] ?? createRequestState(),
  },
  actions: {
    setGlobalLoading(value) {
      this.globalLoading = Boolean(value);
    },
    enqueueNotification(payload) {
      this.notifications.push({ id: generateNotificationId(), ...payload });
    },
    dismissNotification(id) {
      this.notifications = this.notifications.filter((item) => item.id !== id);
    },
    resetNotifications() {
      this.notifications = [];
    },
    ensureRequestEntry(key) {
      if (!key) return;
      if (!this.requests[key]) {
        this.requests[key] = createRequestState();
      }
      return this.requests[key];
    },
    setRequestIdle(key) {
      const entry = this.ensureRequestEntry(key);
      if (!entry) return;
      this.requests[key] = { ...createRequestState(), lastUpdated: Date.now() };
    },
    setRequestLoading(key, message = "") {
      const entry = this.ensureRequestEntry(key);
      if (!entry) return;
      Object.assign(entry, {
        ...createRequestState(),
        isLoading: true,
        message,
        lastUpdated: Date.now(),
      });
    },
    setRequestSuccess(key, message = "") {
      const entry = this.ensureRequestEntry(key);
      if (!entry) return;
      Object.assign(entry, {
        ...createRequestState(),
        isSuccess: true,
        message,
        lastUpdated: Date.now(),
      });
    },
    setRequestError(key, error, message) {
      const entry = this.ensureRequestEntry(key);
      if (!entry) return;
      const resolvedMessage = message ?? error?.message ?? "La operación falló";
      Object.assign(entry, {
        ...createRequestState(),
        isError: true,
        error,
        message: resolvedMessage,
        lastUpdated: Date.now(),
      });
    },
    clearRequestState(key) {
      if (!key || !this.requests[key]) return;
      delete this.requests[key];
    },
    async trackRequest(key, handler, { onSuccess, onError } = {}) {
      if (key) {
        this.setRequestLoading(key);
      } else {
        this.setGlobalLoading(true);
      }

      try {
        const result = await handler();
        if (key) {
          this.setRequestSuccess(key);
        }
        onSuccess?.(result);
        return result;
      } catch (error) {
        if (key) {
          this.setRequestError(key, error);
        }
        onError?.(error);
        throw error;
      } finally {
        if (!key) {
          this.setGlobalLoading(false);
        }
      }
    },
  },
});
