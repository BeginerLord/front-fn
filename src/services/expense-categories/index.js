import { apiClient } from "@/api/apiClient";

export const createCategoryService = async (payload) => {
  const { data } = await apiClient.post("/categorias", payload);
  return data;
};

export const getCategoriesService = async (params = {}) => {
  const { data } = await apiClient.get("/categorias", { params });
  return data;
};

export const getCategoryByIdService = async (id) => {
  const { data } = await apiClient.get(`/categorias/${id}`);
  return data;
};

export const updateCategoryService = async (id, payload) => {
  const { data } = await apiClient.put(`/categorias/${id}`, payload);
  return data;
};

export const deleteCategoryService = async (id) => {
  const { data } = await apiClient.delete(`/categorias/${id}`);
  return data;
};

export const getCategoryStatsService = async (id) => {
  const { data } = await apiClient.get(`/categorias/${id}/stats`);
  return data;
};
