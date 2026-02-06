import { api } from './axios';

export const getUsersApi = async (page = 1, limit = 10, status) => {
  const params = { page, limit };
  if (status) {
    params.status = status;
  }
  const { data } = await api.get('/users', { params });
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

export const getAllUsersApi = async ({ pageSize = 100 } = {}) => {
  const firstPage = await getUsersApi(1, pageSize);
  const firstItems = Array.isArray(firstPage?.items) ? firstPage.items : [];
  const total = Number(firstPage?.total);

  if (!Number.isFinite(total) || total <= firstItems.length) {
    return firstItems;
  }

  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return firstItems;

  const pageNumbers = Array.from({ length: totalPages - 1 }, (_, idx) => idx + 2);
  const restPages = await Promise.all(
    pageNumbers.map((page) => getUsersApi(page, pageSize)),
  );

  return [
    ...firstItems,
    ...restPages.flatMap((res) => (Array.isArray(res?.items) ? res.items : [])),
  ];
};
