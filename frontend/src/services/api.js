import axios from "axios";

// Base URL of our backend API
const API = axios.create({
  baseURL: "/api",
});

// Request interceptor - automatically adds JWT token to every request
// This runs before EVERY API call, so we don't have to add headers manually
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Auth API ---
export const loginAdmin = (data) => API.post("/auth/login", data);
export const getProfile = () => API.get("/auth/profile");
export const updateProfile = (data) => API.put("/auth/profile", data);
export const changePassword = (data) => API.put("/auth/change-password", data);

// --- Dashboard API ---
export const getDashboard = () => API.get("/dashboard");

// --- Users API ---
export const getUsers = (params) => API.get("/users", { params });
export const createUser = (data) => API.post("/users", data);
export const updateUser = (id, data) => API.put(`/users/${id}`, data);
export const deleteUser = (id) => API.delete(`/users/${id}`);

// --- Destinations API ---
export const getDestinations = (params) => API.get("/destinations", { params });
export const createDestination = (data) => API.post("/destinations", data);
export const updateDestination = (id, data) => API.put(`/destinations/${id}`, data);
export const deleteDestination = (id) => API.delete(`/destinations/${id}`);

// --- Bookings API ---
export const getBookings = (params) => API.get("/bookings", { params });
export const updateBookingStatus = (id, status) => API.put(`/bookings/${id}/status`, { status });
export const deleteBooking = (id) => API.delete(`/bookings/${id}`);
