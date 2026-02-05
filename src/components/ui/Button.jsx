import { classNames } from '../../utils/classNames';

const VARIANT_CLASSES = {
  primary: 'bg-gray-900 text-white hover:bg-gray-800',
  secondary: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  ghost: 'text-gray-700 hover:bg-gray-100',
};

const SIZE_CLASSES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingLabel = 'Loading...',
  type = 'button',
  disabled = false,
  className,
  children,
  ...rest
}) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      className={classNames(
        'inline-flex items-center justify-center rounded transition disabled:opacity-60 disabled:cursor-not-allowed',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
      disabled={isDisabled}
      {...rest}
    >
      {isLoading ? loadingLabel : children}
    </button>
  );
}
