// lib/api-services.ts
import { api } from "./api";

// ========== CATEGORIAS ==========
export const getCategories = async () => {
  // ✅ Rota correta
  const response = await api.get("/categories/");
  return response.data;
};

export const createCategory = async (data: {
  name: string;
  discount_percentage?: number;
}) => {
  // ✅ Rota correta
  const response = await api.post("/categories/", data);
  return response.data;
};

// ========== PRODUTOS ==========
export const getProducts = async () => {
  // ✅ Rota correta
  const response = await api.get("/products/");
  return response.data;
};

export const createProduct = async (data: {
  name: string;
  price: number;
  category_id: number;
}) => {
  // ✅ Rota correta
  const response = await api.post("/products/", data);
  return response.data;
};