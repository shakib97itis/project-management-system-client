import SelectInput from '../ui/SelectInput';

const ROLE_OPTIONS = [
  { value: 'ADMIN', label: 'ADMIN' },
  { value: 'MANAGER', label: 'MANAGER' },
  { value: 'STAFF', label: 'STAFF' },
];

export default function RoleSelect({
  value,
  onChange,
  className = 'px-2 py-1',
  disabled = false,
  id,
}) {
  return (
    <SelectInput
      id={id}
      className={className}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={disabled}
      options={ROLE_OPTIONS}
    />
  );
}
