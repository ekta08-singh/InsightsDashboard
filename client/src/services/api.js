import axios from "axios";

const API_BASE = "http://localhost:5000/api";

export const fetchMeta = async () => {
  const res = await axios.get(`${API_BASE}/insights/meta`);
  return res.data;
};

export const fetchInsights = async (filters) => {
  const params = {};
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params[key] = value;
  });
  const res = await axios.get(`${API_BASE}/insights`, { params });
  return res.data;
};
