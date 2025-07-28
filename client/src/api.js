import axios from "axios";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "";

const api = axios.create({
  baseURL: API_BASE,
});

export default api;
