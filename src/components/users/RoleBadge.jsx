import { classNames } from '../../utils/classNames';

const ROLE_CLASSES = {
  ADMIN: 'bg-purple-50 text-purple-700 ring-purple-200',
  MANAGER: 'bg-sky-50 text-sky-700 ring-sky-200',
  STAFF: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
};

export default function RoleBadge({ role, className }) {
  const label = role || '—';
  return (
    <span
      className={classNames(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
        ROLE_CLASSES[role] || 'bg-gray-100 text-gray-700 ring-gray-200',
        className,
      )}
    >
      {label}
    </span>
  );
}

