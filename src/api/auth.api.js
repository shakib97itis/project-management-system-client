import {api} from './axios';

export const loginApi = async (payload) => {
  const {data} = await api.post('/auth/login', payload); // { token, user }
  return data;
};

export const registerViaInviteApi = async (payload) => {
  const {data} = await api.post('/auth/register-via-invite', payload); // { token, user }
  return data;
};

export const inviteUserApi = async (payload) => {
  const {data} = await api.post('/auth/invite', payload); // { token } or { inviteLink }
  return data;
};
