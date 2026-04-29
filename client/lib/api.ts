import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("tks_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email: string, password: string) => api.post("/auth/login", { email, password }),
  me: () => api.get("/auth/me"),
};

export const productAPI = {
  getAll: (params?: Record<string, string>) => api.get("/products", { params }),
  getById: (id: string) => api.get(`/products/${id}`),
};

export const orderAPI = {
  create: (data: unknown) => api.post("/orders", data),
  track: (orderId: string) => api.get(`/orders/track/${orderId}`),
  trackByEmail: (email: string) => api.get("/orders/track", { params: { email } }),
};

export const customOrderAPI = {
  submitInquiry: (data: unknown) => api.post("/custom-orders", data),
  track: (customOrderId: string) => api.get(`/custom-orders/track/${customOrderId}`),
  submitUpi: (data: { customOrderId: string; upiTransactionId: string }) =>
    api.post("/custom-orders/pay", data),
};

export const adminAPI = {
  getStats: () => api.get("/admin/stats"),
  // Products
  updateProduct: (id: string, data: unknown) => api.patch(`/admin/products/${id}`, data),
  // Regular orders
  getOrders: (params?: Record<string, string>) => api.get("/admin/orders", { params }),
  updateOrder: (orderId: string, data: unknown) => api.patch(`/admin/orders/${orderId}`, data),
  verifyUpi: (orderId: string) => api.patch(`/admin/orders/${orderId}/verify-upi`, {}),
  // Custom orders
  getCustomOrders: (params?: Record<string, string>) =>
    api.get("/admin/custom-orders", { params }),
  updateCustomOrder: (customOrderId: string, data: unknown) =>
    api.patch(`/admin/custom-orders/${customOrderId}`, data),
};

export const contactAPI = {
  send: (data: unknown) => api.post("/contact", data),
};

export default api;