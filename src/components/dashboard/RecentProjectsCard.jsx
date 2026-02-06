import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import InlineMessage from '../ui/InlineMessage';
import Badge from './Badge';

function getProjectTone(status) {
  if (status === 'ARCHIVED') return 'warning';
  if (status === 'ACTIVE') return 'success';
  return 'neutral';
}

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString();
}

export default function RecentProjectsCard({
  projects = [],
  isLoading = false,
  isError = false,
  errorMessage,
}) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Recent Projects</h2>
        <Link className="text-sm text-gray-700 hover:underline" to="/projects">
          View all
        </Link>
      </div>

      {isError && (
        <InlineMessage className="mt-3 text-sm" tone="error">
          {errorMessage || 'Failed to load projects'}
        </InlineMessage>
      )}

      <div className="mt-4 space-y-3">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="animate-pulse flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gray-200" />
              <div className="flex-1">
                <div className="h-3 w-2/3 bg-gray-200 rounded" />
                <div className="mt-2 h-3 w-1/3 bg-gray-200 rounded" />
              </div>
            </div>
          ))
        ) : projects.length === 0 ? (
          <p className="text-sm text-gray-500">No projects yet.</p>
        ) : (
          projects.map((project) => {
            const dateLabel = formatDate(project.updatedAt || project.createdAt);
            return (
              <div
                key={project._id || project.id || project.name}
                className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 bg-white p-3"
              >
                <div className="min-w-0">
                  <div className="font-medium truncate">{project.name}</div>
                  <div className="mt-0.5 text-xs text-gray-500">
                    {dateLabel ? `Updated ${dateLabel}` : '—'}
                  </div>
                </div>

                <Badge tone={getProjectTone(project.status)}>
                  {project.status || '—'}
                </Badge>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
