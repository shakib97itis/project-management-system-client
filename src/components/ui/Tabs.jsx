import { classNames } from '../../utils/classNames';

export default function Tabs({ tabs, activeKey, onChange, className }) {
  return (
    <div
      className={classNames(
        'inline-flex items-center rounded-control border border-border bg-surface p-1',
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
              'rounded-control px-3 py-1.5 text-sm font-medium transition',
              isActive
                ? 'bg-brand text-brand-foreground shadow-card'
                : 'text-foreground/80 hover:bg-surface-muted',
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
