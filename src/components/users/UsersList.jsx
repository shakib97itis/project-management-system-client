import UserRow from './UserRow';

export default function UsersList({
  users,
  isLoading,
  isError,
  onRoleChange,
  onStatusToggle,
  currentUserId,
  isAdmin,
  emptyMessage = null,
}) {
  return (
    <>
      {isLoading && <p>Loading users...</p>}
      {isError && <p className="text-red-600">Failed to load users</p>}

      <div className="space-y-3">
        {users.map((user) => (
          <UserRow
            key={user.id}
            user={user}
            onRoleChange={onRoleChange}
            onStatusToggle={onStatusToggle}
            currentUserId={currentUserId}
            isAdmin={isAdmin}
          />
        ))}

        {!isLoading && users.length === 0 && emptyMessage && (
          <p className="text-sm text-gray-500">{emptyMessage}</p>
        )}
      </div>
    </>
  );
}
