const ROLE_OPTIONS = [
  { value: 'ADMIN', label: 'ADMIN' },
  { value: 'MANAGER', label: 'MANAGER' },
  { value: 'STAFF', label: 'STAFF' },
];

export default function RoleSelect({
  value,
  onChange,
  className = 'border rounded px-2 py-1',
  disabled = false,
  id,
}) {
  return (
    <select
      id={id}
      className={className}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={disabled}
    >
      {ROLE_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
