import {createElement} from 'react';
import {classNames} from '../../utils/classNames';

export default function Card({
  as: Component = 'div',
  className,
  children,
  ...rest
}) {
  return createElement(
    Component,
    {
      className: classNames('ds-card', className),
      ...rest,
    },
    children,
  );
}
