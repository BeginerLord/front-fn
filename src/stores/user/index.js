import { defineStore } from "pinia";
import {
  getMeService,
  getUsersService,
  updateUserService,
  deleteUserService,
} from "@/services";
import { useAppStore } from "@/stores/app";

export const useUserStore = defineStore("user", {
  state: () => ({
    me: null,
    users: [],
  }),
  getters: {
    getById: (state) => (id) => state.users.find((u) => u.id === id) || null,
  },
  actions: {
    async fetchMe() {
      const app = useAppStore();
      return app.trackRequest("users:me", async () => {
        const data = await getMeService();
        this.me = data?.data?.user ?? data?.user ?? data;
        return this.me;
      });
    },

    async fetchUsers() {
      const app = useAppStore();
      const res = await app.trackRequest("users:list", async () => {
        const data = await getUsersService();
        const users = data?.data ?? data ?? [];
        this.users = Array.isArray(users) ? users : [];
        return this.users;
      });
      return res;
    },

    async updateUser(id, payload) {
      const app = useAppStore();
      const res = await app.trackRequest("users:update", async () => {
        const data = await updateUserService(id, payload);
        const updated = data?.data ?? data;

        // Refresca en la lista
        this.users = this.users.map((u) =>
          u.id === id ? { ...u, ...updated } : u
        );

        // Si es el mismo usuario logueado (me), actualiza también
        if (this.me?.id === id) {
          this.me = { ...this.me, ...updated };
        }

        return updated;
      });
      return res;
    },

    async deleteUser(id) {
      const app = useAppStore();
      const res = await app.trackRequest("users:delete", async () => {
        const data = await deleteUserService(id);
        this.users = this.users.filter((u) => u.id !== id);

        // Si borró su propio usuario, limpiar perfil
        if (this.me?.id === id) {
          this.me = null;
        }

        return data?.data ?? data;
      });
      return res;
    },
  },
});
