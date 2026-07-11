import axios from 'axios';
import { API } from './data';

const api = axios.create({
  baseURL: API,
});

// Cet intercepteur s'exécute AVANT chaque requête sortante
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pink_studio_token');
    if (token) {
      // Injecte le token au format attendu par ton middleware : Bearer <token>
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

// Ensuite, dans tes pages, tu utilises "api.get('/api/appointments')" au lieu de "axios.get(...)"