import axios from 'axios';
// We would use axiosLogger here if we run this via Node or bundle it properly, 
// but in Vite frontend browser env, winston (from logging-middleware) might cause issues since it's Node-only.
// Assuming we only use the logger in the backend for now, or use a browser-safe logger.

const api = axios.create({
  baseURL: '/api' // Proxied via Vite to localhost:5000
});

export const notificationApi = {
  getNotifications: async (type, page = 1, limit = 10) => {
    const params = { page, limit };
    if (type && type !== 'all') {
      params.type = type;
    }
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  getPriorityNotifications: async (page = 1, limit = 10) => {
    const response = await api.get('/notifications/priority', { params: { page, limit } });
    return response.data;
  },

  getCounts: async () => {
    const response = await api.get('/notifications/count');
    return response.data;
  }
};
