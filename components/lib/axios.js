import axios from "axios";

// Use localhost for API calls in development, and env-configured URL otherwise
const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/"
    : process.env.NEXT_PUBLIC_FLUID_API;

const instance = axios.create({
  baseURL,
});

instance.interceptors.request.use(
  async (config) => {
    config.headers.Authorization = localStorage.fluidToken;
    return config;
  },
  (err) => {
    debugger;
    return Promise.reject(err);
  }
);

export default instance;
