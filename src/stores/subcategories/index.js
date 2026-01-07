export const useSubCategoriesStore = defineStore("subcategories", {
  state: () => ({
    subcategories: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
    },
  }),

  getters:{

  },

  actions:{
    
  }
});
