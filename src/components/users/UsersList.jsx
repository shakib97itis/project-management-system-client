import DataList from '../ui/DataList';
import UserRow from './UserRow';
import { getUserId } from '../../utils/ids';

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
    <DataList
      items={users}
      isLoading={isLoading}
      isError={isError}
      emptyMessage={emptyMessage}
      loadingMessage="Loading users..."
      errorMessage="Failed to load users"
      renderItem={(user) => (
        <UserRow
          key={getUserId(user) || user.email}
          user={user}
          onRoleChange={onRoleChange}
          onStatusToggle={onStatusToggle}
          currentUserId={currentUserId}
          isAdmin={isAdmin}
        />
      )}
    />
  );
}
