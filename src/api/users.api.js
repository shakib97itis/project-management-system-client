import { api } from './axios';

export const getUsersApi = async (page = 1, limit = 10) => {
  const { data } = await api.get('/users', { params: { page, limit } });
  return data; // {items,total,page,limit}
};

export const updateUserRoleApi = async (id, role) => {
  const { data } = await api.patch(`/users/${id}/role`, { role });
  return data;
};

export const updateUserStatusApi = async (id, status) => {
  const { data } = await api.patch(`/users/${id}/status`, { status });
  return data;
};
