import axios from "axios";

const { VITE_API_BASE_URL: API_BASE_URL, VITE_API_TOKEN: API_SECRET } =
  import.meta.env;

const TOKEN_STORAGE_KEY = "accessToken";
const REQUEST_TIMEOUT = 10000; // 10 segundos

function getStorage() {
  if (typeof window === "undefined") {
    return null;
  }
  return window.sessionStorage;
}

function getStoredToken() {
  return getStorage()?.getItem(TOKEN_STORAGE_KEY) ?? null;
}

function setStoredToken(token) {
  const storage = getStorage();
  if (!storage) {
    return;
  }
  if (token) {
    storage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    storage.removeItem(TOKEN_STORAGE_KEY);
  }
}

function extractAccessToken(response) {
  return (
    response?.data?.data?.accessToken ?? response?.data?.accessToken ?? null
  );
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(API_SECRET ? { "api-key": API_SECRET } : {}),
  },
  timeout: REQUEST_TIMEOUT,
});

apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (import.meta.env.DEV) {
    if (config.data) {
      console.log("data", config.data);
    }
    console.groupEnd();
  }

  return config;
});

apiClient.interceptors.response.use((response) => {
  const responseToken = extractAccessToken(response);
  if (responseToken) {
    setStoredToken(responseToken);
  }
  return response;
});

async function request(method, endpoint, data, options = {}) {
  const config = { ...options, method, url: endpoint };
  if (data !== undefined) {
    config.data = data;
  }

  const response = await apiClient.request(config);
  return response.data;
}

export const api = {
  get: (endpoint, options) => request("get", endpoint, undefined, options),
  post: (endpoint, data, options) => request("post", endpoint, data, options),
  put: (endpoint, data, options) => request("put", endpoint, data, options),
  patch: (endpoint, data, options) => request("patch", endpoint, data, options),
  delete: (endpoint, options) =>
    request("delete", endpoint, undefined, options),
};

export function setToken(token) {
  setStoredToken(token);
}

export function clearToken() {
  setStoredToken(null);
}

export function getToken() {
  return getStoredToken();
}
