import { Link } from 'react-router-dom';
import { classNames } from '../../utils/classNames';
import Card from '../ui/Card';

const TONE_STYLES = {
  neutral: {
    icon: 'bg-gray-100 text-gray-700',
    border: 'border-gray-100',
  },
  success: {
    icon: 'bg-emerald-50 text-emerald-700',
    border: 'border-emerald-100',
  },
  warning: {
    icon: 'bg-amber-50 text-amber-700',
    border: 'border-amber-100',
  },
  info: {
    icon: 'bg-sky-50 text-sky-700',
    border: 'border-sky-100',
  },
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  tone = 'neutral',
  to,
  isLoading = false,
}) {
  const toneStyles = TONE_STYLES[tone] || TONE_STYLES.neutral;
  const Wrapper = to ? Link : 'div';
  const wrapperProps = to ? { to } : {};

  return (
    <Card
      as={Wrapper}
      {...wrapperProps}
      className={classNames(
        'border transition',
        toneStyles.border,
        to && 'hover:shadow-md hover:-translate-y-0.5 focus:outline-none',
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm text-gray-600">{title}</div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">
            {isLoading ? (
              <span className="inline-block h-7 w-16 rounded bg-gray-200 animate-pulse align-middle" />
            ) : (
              value
            )}
          </div>
          {subtitle && (
            <div className="mt-2 text-xs text-gray-500">
              {isLoading ? (
                <span className="inline-block h-3 w-32 rounded bg-gray-200 animate-pulse align-middle" />
              ) : (
                subtitle
              )}
            </div>
          )}
        </div>

        {Icon && (
          <div
            className={classNames(
              'h-12 w-12 rounded-xl flex items-center justify-center',
              toneStyles.icon,
            )}
          >
            <Icon className="h-6 w-6" aria-hidden="true" />
          </div>
        )}
      </div>
    </Card>
  );
}
