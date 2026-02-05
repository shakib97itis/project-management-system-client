import { classNames } from '../../utils/classNames';

const TONE_CLASSES = {
  error: 'text-red-600',
  muted: 'text-gray-500',
  info: 'text-gray-700',
};

export default function InlineMessage({
  tone = 'muted',
  className,
  children,
  ...rest
}) {
  return (
    <p
      className={classNames(TONE_CLASSES[tone] || TONE_CLASSES.muted, className)}
      {...rest}
    >
      {children}
    </p>
  );
}
