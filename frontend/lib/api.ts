import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Validação em desenvolvimento
if (process.env.NODE_ENV === "development") {
  console.log("🔗 API Base URL:", baseURL);
}

export const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 segundos timeout
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Melhorando o Log de Erro
    if (error.response) {
      // O servidor respondeu com um status fora de 2xx
      console.error("Erro API [Status]:", error.response.status);
      console.error("Erro API [Dados]:", error.response.data);
      console.error("Erro API [URL]:", error.config?.url);
      
      // Mensagens amigáveis por status
      if (error.response.status === 404) {
        console.error("❌ Endpoint não encontrado. Verifique se o FastAPI está rodando.");
      } else if (error.response.status === 500) {
        console.error("❌ Erro interno do servidor FastAPI.");
      }
      
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta (Servidor off ou erro de rede)
      console.error("Erro API [Sem Resposta]:", error.request);
      console.error("❌ Backend não respondeu. Verifique se o FastAPI está rodando em:", baseURL);
      
    } else {
      // Algo aconteceu na configuração da requisição
      console.error("Erro API [Config]:", error.message);
    }
    
    return Promise.reject(error);
  }
);