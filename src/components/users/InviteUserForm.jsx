import RoleSelect from './RoleSelect';

export default function InviteUserForm({
  email,
  role,
  onEmailChange,
  onRoleChange,
  onSubmit,
  isSubmitting,
}) {
  return (
    <div className="mt-4 grid gap-2 md:grid-cols-3">
      <input
        className="border rounded px-3 py-2"
        placeholder="Invite email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
      />

      <RoleSelect
        className="border rounded px-3 py-2"
        value={role}
        onChange={onRoleChange}
      />

      <button
        className="rounded bg-gray-900 text-white px-3 py-2"
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Inviting...' : 'Send Invite'}
      </button>
    </div>
  );
}
