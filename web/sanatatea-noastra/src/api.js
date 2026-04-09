import axios from 'axios';

// Aici punem linkul catre serverul tau Node.js de pe Render
const API_URL = 'https://beckend-medical.onrender.com/api'; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;