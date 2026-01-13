import axios from 'axios';

const API_BASE_URL = 'http://localhost:8082/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const createUser = (data) => api.post('/users', data);
export const getAllUsers = () => api.get('/users');
export const getUserById = (id) => api.get(`/users/${id}`);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);

export const createUserActivity = (data) => api.post('/user-activities', data);
export const getAllUserActivities = () => api.get('/user-activities');
export const getUserActivitiesByUserId = (userId) => api.get(`/user-activities/user/${userId}`);
export const deleteUserActivity = (id) => api.delete(`/user-activities/${id}`);

export const createActivityDetails = (data) => api.post('/activity-details', data);
export const getAllActivityDetails = () => api.get('/activity-details');
export const getActivityDetailsById = (id) => api.get(`/activity-details/${id}`);
export const deleteActivityDetails = (id) => api.delete(`/activity-details/${id}`);

export const getUserDashboard = (userId) => api.get(`/user-dashboard/${userId}`);