import axios from 'axios';

const api = axios.create({
  baseURL: 'https://graph.facebook.com/v10.0',
  withCredentials: false,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
});

api.interceptors.request.use(async (config) => {
  const headers = { ...config.headers };

  return { ...config, headers };
});

export default api;
