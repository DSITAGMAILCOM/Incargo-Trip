import axios from "axios";

const API = axios.create({
  baseURL: "/api/trips",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken") || localStorage.getItem("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// GET all trips
export const getTrips = () => API.get("/");

// GET one trip
export const getTrip = (tripId) =>
  API.get(`/${tripId}`);

// CREATE trip
export const createTrip = (trip) =>
  API.post("/", trip);

// UPDATE trip
export const updateTrip = (tripId, trip) =>
  API.put(`/${tripId}`, trip);

// DELETE trip
export const deleteTrip = (tripId) =>
  API.delete(`/${tripId}`);