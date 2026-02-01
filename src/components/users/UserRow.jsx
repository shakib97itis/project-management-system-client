import RoleSelect from './RoleSelect';

export default function UserRow({
  user,
  onRoleChange,
  onStatusToggle,
  onDelete,
}) {
  const isActive = user.status === 'ACTIVE';
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
        <div className="text-xs text-gray-500">
          Role: {user.role} - Status: {user.status}
        </div>
      </div>

      <div className="flex gap-2">
        <RoleSelect
          value={user.role}
          onChange={(role) => onRoleChange?.(user._id, role)}
        />

        <button
          className={`px-3 py-1.5 rounded border transition-colors ${statusButtonClasses}`}
          onClick={() =>
            onStatusToggle?.(user._id, isActive ? 'INACTIVE' : 'ACTIVE')
          }
        >
          {isActive ? 'Deactivate' : 'Activate'}
        </button>

        <button
          className="px-3 py-1.5 rounded border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 active:bg-red-200 transition-colors"
          onClick={() => onDelete?.(user.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
