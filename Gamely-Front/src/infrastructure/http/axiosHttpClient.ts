import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "https://localhost:7194";

export const httpClient = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: false,
});