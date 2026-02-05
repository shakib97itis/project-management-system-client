export const getUserId = (user) => user?._id ?? user?.id ?? null;
