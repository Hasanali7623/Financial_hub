import api from "./api";

export const transactionService = {
  getAll: async (params = {}) => {
    const response = await api.get("/transactions", { params });
    return response.data.data || [];
  },

  getById: async (id) => {
    const response = await api.get(`/transactions/${id}`);
    return response.data.data;
  },

  create: async (data) => {
    const response = await api.post("/transactions", data);
    return response.data.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/transactions/${id}`, data);
    return response.data.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },

  uploadReceipt: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/integrations/ocr/parse", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  },

  getUpcomingRecurring: async () => {
    const response = await api.get("/transactions/recurring/upcoming");
    return response.data.data || [];
  },
};
