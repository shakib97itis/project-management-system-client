import { api } from './axios';

export const loginApi = async (payload) => {
  const { data } = await api.post('/auth/login', payload, {
    skipAuthRefresh: true,
  }); // { accessToken, user }
  return data;
};

export const registerViaInviteApi = async (payload) => {
  const { data } = await api.post('/auth/register-via-invite', payload, {
    skipAuthRefresh: true,
  }); // { accessToken, user }
  return data;
};

export const inviteUserApi = async (payload) => {
  const { data } = await api.post('/auth/invite', payload); // { token } or { inviteLink }
  return data;
};

export const meApi = async () => {
  const { data } = await api.get('/auth/me');
  return data; // { user }
};

export const logoutApi = async () => {
  const { data } = await api.post('/auth/logout', null, {
    skipAuthRefresh: true,
  });
  return data;
};
