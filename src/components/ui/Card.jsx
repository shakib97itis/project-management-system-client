import {classNames} from '../../utils/classNames';

export default function Card({
  as: Component = 'div',
  className,
  children,
  ...rest
}) {
  return (
    <Component
      className={classNames('bg-white rounded-xl shadow p-6', className)}
      {...rest}
    >
      {children}
    </Component>
  );
}
