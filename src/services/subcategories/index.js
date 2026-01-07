import { apiClient } from "@/api/apiClient";

export const createSubCategories = async (
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
