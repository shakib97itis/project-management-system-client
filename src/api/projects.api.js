import { api } from './axios';

export const createProjectApi = async (payload) => {
  const { data } = await api.post('/projects', payload);
  return data;
};

export const getProjectsApi = async () => {
  const { data } = await api.get('/projects');
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.projects)) return data.projects;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

export const updateProjectApi = async (id, payload) => {
  const { data } = await api.patch(`/projects/${id}`, payload);
  return data;
};

export const deleteProjectApi = async (id) => {
  const { data } = await api.delete(`/projects/${id}`);
  return data;
};
