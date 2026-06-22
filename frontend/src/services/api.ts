const API_URL = "http://localhost:3001";

export const api = {
  post: async (endpoint: string, data: any) => {
    const formattedEndpoint = endpoint.startsWith("/")
      ? endpoint
      : `/${endpoint}`;
    const fullUrl = `${API_URL}${formattedEndpoint}`;

    console.log("Tentando conectar em:", fullUrl);

    try {
      const res = await fetch(fullUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        redirect: "follow",
        credentials: "include",
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
