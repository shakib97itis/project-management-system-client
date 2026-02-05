import { classNames } from '../../utils/classNames';

export default function Tabs({ tabs, activeKey, onChange, className }) {
  return (
    <div
      className={classNames(
        'inline-flex items-center rounded-lg border border-gray-200 bg-white p-1',
        className,
      )}
      role="tablist"
      aria-orientation="horizontal"
    >
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={classNames(
              'rounded-md px-3 py-1.5 text-sm font-medium transition',
              isActive
                ? 'bg-gray-900 text-white'
                : 'text-gray-700 hover:bg-gray-100',
            )}
            onClick={() => onChange?.(tab.key)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
