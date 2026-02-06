import { classNames } from '../../utils/classNames';

const TONE_CLASSES = {
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-700 ring-amber-200',
  neutral: 'bg-gray-100 text-gray-700 ring-gray-200',
};

export default function Badge({ children, tone = 'neutral', className }) {
  return (
    <span
      className={classNames(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
        TONE_CLASSES[tone] || TONE_CLASSES.neutral,
        className,
      )}
    >
      {children}
    </span>
  );
}

