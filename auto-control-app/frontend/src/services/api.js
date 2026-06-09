import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// On 401, clear session and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/password', data),
}

// Cars
export const carsApi = {
  getAll: () => api.get('/cars'),
  getById: (id) => api.get(`/cars/${id}`),
  create: (formData) => api.post('/cars', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => api.put(`/cars/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/cars/${id}`),
  exportPDF: (id) => api.get(`/cars/${id}/export`, { responseType: 'blob' }),
}

// Maintenances
export const maintenancesApi = {
  getByCar: (carId) => api.get(`/maintenances/car/${carId}`),
  getById: (id) => api.get(`/maintenances/${id}`),
  create: (carId, formData) =>
    api.post(`/maintenances/car/${carId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) =>
    api.put(`/maintenances/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/maintenances/${id}`),
  deletePhoto: (id, photoId) => api.delete(`/maintenances/${id}/photos/${photoId}`),
  getUpcoming: (days = 30) => api.get(`/maintenances/upcoming?days=${days}`),
}

// Maintenance intervals
export const intervalsApi = {
  getAll: () => api.get('/intervals'),
  getByType: (type) => api.get(`/intervals/by-type/${type}`),
  create: (data) => api.post('/intervals', data),
  update: (id, data) => api.put(`/intervals/${id}`, data),
  delete: (id) => api.delete(`/intervals/${id}`),
}

export default api
