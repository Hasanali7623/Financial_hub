import api from "./api";

export const savingsGoalService = {
  getAll: async () => {
    const response = await api.get("/goals");
    return response.data.data || [];
  },

  getById: async (id) => {
    const response = await api.get(`/goals/${id}`);
    return response.data.data;
  },

  create: async (data) => {
    const response = await api.post("/goals", data);
    return response.data.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/goals/${id}`, data);
    return response.data.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/goals/${id}`);
    return response.data;
  },

  addContribution: async (id, amount) => {
    const response = await api.post(`/goals/${id}/contribute?amount=${amount}`);
    return response.data.data;
  },
};
