import RoleSelect from './RoleSelect';
import RoleBadge from './RoleBadge';
import { getUserId } from '../../utils/ids';

export default function UserRow({
  user,
  onRoleChange,
  onStatusToggle,
  currentUserId,
  isAdmin,
}) {
  const isActive = user.status === 'ACTIVE';
  const userId = getUserId(user);
  // Prevent admins from deactivating their own account.
  const isSelfRestricted =
    isAdmin && currentUserId && userId && currentUserId === userId;
  const statusButtonClasses = isActive
    ? 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 active:bg-emerald-200'
    : 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 active:bg-amber-200';

  return (
    <div className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <div className="font-medium">
          {user.name}{' '}
          <span className="text-xs text-gray-500">({user.email})</span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <RoleBadge role={user.role} />
          <span>Status: {user.status}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <RoleSelect
          value={user.role}
          onChange={(role) => onRoleChange?.(userId, role)}
        />

        <button
          className={`px-3 py-1.5 rounded border transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${statusButtonClasses}`}
          onClick={() =>
            onStatusToggle?.(userId, isActive ? 'INACTIVE' : 'ACTIVE')
          }
          disabled={isSelfRestricted}
        >
          {isActive ? 'Deactivate' : 'Activate'}
        </button>

        {isSelfRestricted && (
          <span className="self-center text-xs text-gray-500">
            You can&apos;t deactivate your own account.
          </span>
        )}
      </div>
    </div>
  );
}
