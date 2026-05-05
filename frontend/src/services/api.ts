const API_URL = "http://localhost:3001";

export const api = {
  post: async (endpoint: string, data: any) => {
    console.log("Tentando conectar em:", `${API_URL}${endpoint}`);

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        redirect: "follow",
      });

      if (res.ok) {
        return await res.json();
      }

      const errorData = await res.json().catch(() => ({}));

      const error = new Error(errorData.message || "Erro na autenticação");
      (error as any).status = res.status;

      throw error;
    } catch (err: any) {
      if (!err.status) {
        err.status = "network_error";
      }
      console.error("Detalhes do erro de conexão:", err);
      throw err;
    }
  },
};
