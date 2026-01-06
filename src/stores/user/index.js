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
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
    },
  }),
  getters: {
    getById: (state) => (id) =>
      state.users.find((u) => u._id === id || u.id === id) || null,
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

    async fetchUsers(params = {}) {
      const app = useAppStore();
      return app.trackRequest("users:list", async () => {
        const res = await getUsersService(params);
        // API: { data: { data: [...users], pagination: {...} } }
        const payload = res?.data ?? res;
        const users = payload?.data ?? payload?.users ?? [];
        this.users = Array.isArray(users) ? users : [];

        if (payload?.pagination) {
          this.pagination = { ...this.pagination, ...payload.pagination };
        }
        return { users: this.users, pagination: this.pagination };
      });
    },

    async updateUser(id, payload) {
      const app = useAppStore();
      const res = await app.trackRequest("users:update", async () => {
        const data = await updateUserService(id, payload);
        const updated = data?.data?.user ?? data?.data ?? data;

        // Refresca en la lista (usar _id porque la API usa MongoDB)
        this.users = this.users.map((u) =>
          u._id === id || u.id === id ? { ...u, ...updated } : u
        );

        // Si es el mismo usuario logueado (me), actualiza también
        if (this.me?._id === id || this.me?.id === id) {
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
        // Usar _id porque la API usa MongoDB
        this.users = this.users.filter((u) => u._id !== id && u.id !== id);

        // Si borró su propio usuario, limpiar perfil
        if (this.me?._id === id || this.me?.id === id) {
          this.me = null;
        }

        return data?.data ?? data;
      });
      return res;
    },
  },
});
