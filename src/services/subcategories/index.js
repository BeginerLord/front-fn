import { apiClient } from "@/api/apiClient";
import { R } from "vue-router/dist/router-CWoNjPRp.mjs";

export const createSubCategoryService = async (
  categoria_id,
  nombre,
  descripcion
) => {
  const { data } = await apiClient.post("/subcategorias", {
    categoria_id,
    nombre,
    descripcion,
  });
  return data;
};

export const getCategoriesService = async (params = {}) => {
  const { data } = apiClient.get("/subcategorias", params);
  return data;
};

export const getSubcategoriesByCategoryService = async (id, params = {}) => {
  const { data } = apiClient.get(`/subcategorias/categoria/${id}`, params);
  return data;
};

export const getSubCategoryByIdService = async (id) => {
  const { data } = apiClient.get(`/subcategorias/${id}`);
  return data;
};

export const updateSubCategoryService = async (payload, id) => {
  const { data } = apiClient.put(`/subcategorias/${id}`, payload);
  return data;
};

export const deleteSubCategoryById = async (id) => {
  const { data } = apiClient.delete(`/subcategorias/${id}`, id);
  return data;
};
