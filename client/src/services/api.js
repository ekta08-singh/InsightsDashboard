import axios from "axios";
import { getUser } from "./auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const user = getUser();
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const fetchInsights = (params) =>
  api.get("/insights", { params }).then(res => res.data);

export const fetchMeta = () =>
  api.get("/insights/meta").then(res => res.data);
