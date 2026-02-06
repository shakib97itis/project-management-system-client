import { classNames } from '../../utils/classNames';

const VARIANT_CLASSES = {
  primary: 'ds-btn-primary',
  secondary: 'ds-btn-secondary',
  danger: 'ds-btn-danger',
  ghost: 'ds-btn-ghost',
};

const SIZE_CLASSES = {
  sm: 'ds-btn-sm',
  md: 'ds-btn-md',
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
        'ds-btn',
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
