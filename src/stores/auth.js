import { defineStore } from "pinia";
import {
  loginService,
  registerService,
  logoutService,
  refreshTokenService,
} from "@/services";
import { useAppStore } from "./app";
import { clearToken, setToken, getToken } from "@/api/apiClient";

const USER_KEY = "authUser";
const TOKEN_EXPIRY_KEY = "tokenExpiry";
const TOKEN_DURATION = 15 * 60 * 1000; // 15 minutos en ms
const storage = () => (typeof window !== "undefined" ? sessionStorage : null);

const readUser = () => {
  try {
    return JSON.parse(storage()?.getItem(USER_KEY)) || null;
  } catch {
    return null;
  }
};

const writeUser = (user) => {
  user
    ? storage()?.setItem(USER_KEY, JSON.stringify(user))
    : storage()?.removeItem(USER_KEY);
};

const readTokenExpiry = () => {
  try {
    const expiry = storage()?.getItem(TOKEN_EXPIRY_KEY);
    return expiry ? parseInt(expiry, 10) : null;
  } catch {
    return null;
  }
};

const writeTokenExpiry = (timestamp) => {
  timestamp
    ? storage()?.setItem(TOKEN_EXPIRY_KEY, String(timestamp))
    : storage()?.removeItem(TOKEN_EXPIRY_KEY);
};

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: readUser(),
    tokenExpiry: readTokenExpiry(),
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.user && getToken()),
    timeUntilExpiry: (state) => {
      if (!state.tokenExpiry) return null;
      return Math.max(0, state.tokenExpiry - Date.now());
    },
  },
  actions: {
    async login(email, password) {
      const app = useAppStore();
      return app.trackRequest("login", async () => {
        const res = await loginService(email, password);
        const { accessToken, user } = res?.data ?? res;
        if (accessToken) {
          setToken(accessToken);
          this.tokenExpiry = Date.now() + TOKEN_DURATION;
          writeTokenExpiry(this.tokenExpiry);
        }
        this.user = user;
        writeUser(user);
        return res;
      });
    },
    async refreshToken() {
      const app = useAppStore();
      return app.trackRequest("refresh", async () => {
        const res = await refreshTokenService();
        const accessToken = res?.data?.accessToken ?? res?.accessToken;
        if (accessToken) {
          setToken(accessToken);
          this.tokenExpiry = Date.now() + TOKEN_DURATION;
          writeTokenExpiry(this.tokenExpiry);
        }
        return res;
      });
    },
    async logout() {
      const app = useAppStore();
      try {
        await app.trackRequest("logout", async () => {
          await logoutService();
        });
      } catch {
        // Continuar con logout local aunque falle la API
      } finally {
        this.user = null;
        this.tokenExpiry = null;
        writeUser(null);
        writeTokenExpiry(null);
        clearToken();
        app.clearRequestState("login");
        app.clearRequestState("logout");
        app.clearRequestState("refresh");
      }
    },
  },
});

export const useRegisterStore = defineStore("register", {
  state: () => ({
    registeredUser: null,
  }),
  actions: {
    async register(userData) {
      const app = useAppStore();
      return app.trackRequest("register", async () => {
        const res = await registerService(userData);
        const user = res?.data?.user ?? res?.data ?? res;
        this.registeredUser = user;
        return res;
      });
    },
    clearRegistration() {
      this.registeredUser = null;
      useAppStore().clearRequestState("register");
    },
  },
});
