import axios from "axios";

const API = axios.create({
  baseURL: "/api/destinations",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken") || localStorage.getItem("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getDestinations = () => API.get("/");

export const createDestination = (destination) =>
  API.post("/", destination);

export const updateDestination = (id, destination) =>
  API.put(`/${id}`, destination);

export const deleteDestination = (id) =>
  API.delete(`/${id}`);