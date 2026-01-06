import { defineStore } from "pinia";
import { loginService } from "@/services";
import { useAppStore } from "./app";
import { clearToken, setToken, getToken } from "@/api/apiClient";

const USER_KEY = "authUser";
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

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: readUser(),
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.user && getToken()),
  },
  actions: {
    async login(email, password) {
      const app = useAppStore();
      return app.trackRequest("login", async () => {
        const res = await loginService(email, password);
        const { accessToken, user } = res?.data ?? res;
        if (accessToken) setToken(accessToken);
        this.user = user;
        writeUser(user);
        return res;
      });
    },
    logout() {
      this.user = null;
      writeUser(null);
      clearToken();
      useAppStore().clearRequestState("login");
    },
  },
});
