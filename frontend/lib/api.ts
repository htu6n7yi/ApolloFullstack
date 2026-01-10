import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL

// Cria uma instância do Axios
export const api = axios.create({
  baseURL: baseURL, // URL do seu Backend Python
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para logs de erro (opcional, mas ajuda no debug)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erro na API:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);
