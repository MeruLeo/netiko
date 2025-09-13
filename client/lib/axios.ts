import axios from "axios";
import { useLoadingStore } from "@/stores/loading";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const { setLoading } = useLoadingStore.getState();
    setLoading(true);
    return config;
  },
  (error) => {
    const { setLoading } = useLoadingStore.getState();
    setLoading(false);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    const { setLoading } = useLoadingStore.getState();
    setLoading(false);
    return response;
  },
  (error) => {
    const { setLoading } = useLoadingStore.getState();
    setLoading(false);
    return Promise.reject(error);
  }
);

export default api;
