import { defineStore } from "pinia";
import {
  createCategoryService,
  getCategoriesService,
  getCategoryByIdService,
  updateCategoryService,
  deleteCategoryService,
  getCategoryStatsService,
} from "@/services/expense-categories";
import { useAppStore } from "@/stores/app";

export const useExpenseCategoriesStore = defineStore("expenseCategories", {
  state: () => ({
    categories: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
    },
    statsById: {},
  }),

  getters: {
    getById: (state) => (id) =>
      state.categories.find((c) => c._id === id || c.id === id) || null,
    getStats: (state) => (id) => state.statsById[id] || null,
  },

  actions: {
    async fetchCategories(params = {}) {
      const app = useAppStore();
      return app.trackRequest("categories:list", async () => {
        const res = await getCategoriesService(params);
        const payload = res?.data ?? res;
        const items = payload?.data ?? payload?.categories ?? [];

        this.categories = Array.isArray(items) ? items : [];

        if (payload?.pagination) {
          this.pagination = { ...this.pagination, ...payload.pagination };
        }

        return { categories: this.categories, pagination: this.pagination };
      });
    },

    async fetchCategory(id) {
      const app = useAppStore();
      return app.trackRequest("categories:detail", async () => {
        const res = await getCategoryByIdService(id);
        const category = res?.data?.category ?? res?.data ?? res;

        if (category) {
          const exists = this.getById(id);
          if (exists) {
            this.categories = this.categories.map((c) =>
              c._id === id || c.id === id ? { ...c, ...category } : c
            );
          } else {
            this.categories = [...this.categories, category];
          }
        }

        return category;
      });
    },

    async createCategory(payload) {
      const app = useAppStore();
      return app.trackRequest("categories:create", async () => {
        const res = await createCategoryService(payload);
        const created = res?.data?.category ?? res?.data ?? res;

        if (created) {
          this.categories = [created, ...this.categories];
        }

        return created;
      });
    },

    async updateCategory(id, payload) {
      const app = useAppStore();
      return app.trackRequest("categories:update", async () => {
        const res = await updateCategoryService(id, payload);
        const updated = res?.data?.category ?? res?.data ?? res;

        this.categories = this.categories.map((c) =>
          c._id === id || c.id === id ? { ...c, ...updated } : c
        );

        return updated;
      });
    },

    async deleteCategory(id) {
      const app = useAppStore();
      return app.trackRequest("categories:delete", async () => {
        const res = await deleteCategoryService(id);
        this.categories = this.categories.filter(
          (c) => c._id !== id && c.id !== id
        );
        delete this.statsById[id];
        return res?.data ?? res;
      });
    },

    async fetchCategoryStats(id) {
      const app = useAppStore();
      return app.trackRequest("categories:stats", async () => {
        const res = await getCategoryStatsService(id);
        const stats = res?.data?.stats ?? res?.data ?? res;
        this.statsById = { ...this.statsById, [id]: stats };
        return stats;
      });
    },
  },
});
