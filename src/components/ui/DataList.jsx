import { classNames } from '../../utils/classNames';

export default function DataList({
  items = [],
  isLoading = false,
  isError = false,
  renderItem,
  loadingMessage = 'Loading...',
  errorMessage = 'Failed to load',
  emptyMessage,
  className,
}) {
  return (
    <>
      {isLoading && <p>{loadingMessage}</p>}
      {isError && <p className="text-red-600">{errorMessage}</p>}

      <div className={classNames('space-y-3', className)}>
        {items.map(renderItem)}

        {!isLoading && items.length === 0 && emptyMessage && (
          <p className="text-sm text-gray-500">{emptyMessage}</p>
        )}
      </div>
    </>
  );
}
