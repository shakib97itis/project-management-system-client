import Button from '../ui/Button';
import TextInput from '../ui/TextInput';
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
      <TextInput
        placeholder="Invite email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
      />

      <RoleSelect
        className="border rounded px-3 py-2"
        value={role}
        onChange={onRoleChange}
      />

      <Button
        className="px-3 py-2"
        onClick={onSubmit}
        disabled={isSubmitting}
        isLoading={isSubmitting}
        loadingLabel="Inviting..."
      >
        Send Invite
      </Button>
    </div>
  );
}
