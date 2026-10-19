import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// Pull a readable message out of an API error
export const errorMessage = (err) => err.response?.data?.message || err.message;

export default api;
