import axios from "axios";

const API = "http://localhost:5000/api/auth";

export const loginUser = async (email, password) => {
  const { data } = await axios.post(`${API}/login`, { email, password });
  localStorage.setItem("user", JSON.stringify(data));
  return data;
};

export const logout = () => localStorage.removeItem("user");

export const getUser = () =>
  JSON.parse(localStorage.getItem("user"));
