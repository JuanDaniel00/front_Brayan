import axios from 'axios';

// Recuperar el token de localStorage
const token = JSON.parse(localStorage.getItem('auth')) || {};

// Crear una instancia de axios
const apiClient = axios.create({
   // baseURL: 'http://localhost:4500/api',
  baseURL: 'https://etapas-practicas-ep.onrender.com/api',
  headers: {
    "token": token.token || ''
  }
});

// Interceptor para agregar el token a cada solicitud
apiClient.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem('auth')) || {};
  if (token.token) {
    config.headers['token'] = token.token;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;