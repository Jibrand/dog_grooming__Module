import axios from 'axios';

const BASE_URL = 'https://dog-grooming-module-apms.vercel.app';

const API = axios.create({ baseURL: `${BASE_URL}/api/clinic` });

export const getClinics = () => API.get('/');
export const addClinic = (data) => API.post('/', data);
export const updateClinic = (id, data) => API.put(`/${id}`, data);
export const deleteClinic = (id) => API.delete(`/${id}`);
export const uploadImage = (formData) => axios.post(`${BASE_URL}/api/upload`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
