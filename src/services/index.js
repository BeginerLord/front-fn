import { apiClient } from "@/api/apiClient";

export const loginService = async (email, password) => {
  const { data } = await apiClient.post("/auth/login", {
    email,
    password,
  });
  return data;
};

export const registerService = async (userData) => {
  const { data } = await apiClient.post("/auth/register", userData);
  return data;
};

export const getMeService = async () => {
  const { data } = await apiClient.get("/usuarios/me");
  return data;
};

export const getUsersService = async (params = {}) => {
  const { page = 1, limit = 10 } = params;
  const { data } = await apiClient.get("/usuarios", {
    params: { page, limit },
  });
  return data;
};

export const updateUserService = async (id, payload) => {
  const { data } = await apiClient.put(`/usuarios/${id}`, payload);
  return data;
};

export const deleteUserService = async (id) => {
  const { data } = await apiClient.delete(`/usuarios/${id}`);
  return data;
};

export const logoutService = async () => {
  const { data } = await apiClient.post("/auth/logout");
  return data;
};

export const refreshTokenService = async () => {
  const { data } = await apiClient.post("/auth/refresh");
  return data;
};

