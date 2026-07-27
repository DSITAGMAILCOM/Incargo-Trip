import axios from "axios";

const API = axios.create({
  baseURL: "/api/bookings",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken") || localStorage.getItem("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Get all bookings
export const getBookings = () => API.get("/");

// Create booking
export const createBooking = (bookingData) =>
  API.post("/", bookingData);

// Update booking
export const updateBooking = (id, bookingData) =>
  API.put(`/${id}`, bookingData);

// Delete booking
export const deleteBooking = (id) =>
  API.delete(`/${id}`);