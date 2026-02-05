import { classNames } from '../../utils/classNames';

export default function SelectInput({
  options = [],
  className,
  ...rest
}) {
  return (
    <select
      className={classNames('border rounded px-3 py-2', className)}
      {...rest}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
