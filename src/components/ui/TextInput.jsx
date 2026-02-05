import { classNames } from '../../utils/classNames';

export default function TextInput({ className, ...rest }) {
  return (
    <input
      className={classNames('border rounded px-3 py-2', className)}
      {...rest}
    />
  );
}
