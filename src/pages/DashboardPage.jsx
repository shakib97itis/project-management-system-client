import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BriefcaseIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../auth/authContext';
import { getProjectsApi } from '../api/projects.api';
import { getAllUsersApi } from '../api/users.api';
import RecentProjectsCard from '../components/dashboard/RecentProjectsCard';
import StatCard from '../components/dashboard/StatCard';
import { statIcons } from '../components/dashboard/statIcons';
import Card from '../components/ui/Card';
import InlineMessage from '../components/ui/InlineMessage';
import RoleBadge from '../components/users/RoleBadge';
import { getApiErrorMessage } from '../utils/errors';
import { classNames } from '../utils/classNames';

function getInitials(user) {
  const name = (user?.name || '').trim();
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] || '';
    const second = parts.length > 1 ? parts[parts.length - 1]?.[0] : '';
    return `${first}${second}`.toUpperCase();
  }

  const email = (user?.email || '').trim();
  return email ? email[0].toUpperCase() : '?';
}

function compareDescDate(a, b) {
  const aTime = a ? new Date(a).getTime() : 0;
  const bTime = b ? new Date(b).getTime() : 0;
  return (Number.isFinite(bTime) ? bTime : 0) - (Number.isFinite(aTime) ? aTime : 0);
}

function buildRoleCounts(users) {
  const counts = { ADMIN: 0, MANAGER: 0, STAFF: 0 };
  for (const user of users) {
    if (user?.role && Object.prototype.hasOwnProperty.call(counts, user.role)) {
      counts[user.role] += 1;
    }
  }
  return counts;
}

function buildStatusCounts(users) {
  const counts = { ACTIVE: 0, INACTIVE: 0 };
  for (const user of users) {
    if (user?.status === 'ACTIVE') counts.ACTIVE += 1;
    else if (user?.status === 'INACTIVE') counts.INACTIVE += 1;
  }
  return counts;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const projectsQuery = useQuery({
    queryKey: ['projects'],
    queryFn: getProjectsApi,
    staleTime: 30_000,
  });

  const usersStatsQuery = useQuery({
    queryKey: ['users', 'stats'],
    queryFn: () => getAllUsersApi({ pageSize: 100 }),
    enabled: isAdmin,
    staleTime: 60_000,
  });

  const projects = useMemo(() => {
    const raw = Array.isArray(projectsQuery.data) ? projectsQuery.data : [];
    return raw.filter((p) => !p?.isDeleted);
  }, [projectsQuery.data]);

  const { activeCount, archivedCount, totalCount, recentProjects } = useMemo(() => {
    const archived = projects.filter((p) => p?.status === 'ARCHIVED').length;
    const active = projects.length - archived;

    const hasDates = projects.some((p) => p?.updatedAt || p?.createdAt);
    const sorted = hasDates
      ? [...projects].sort((a, b) =>
          compareDescDate(a?.updatedAt || a?.createdAt, b?.updatedAt || b?.createdAt),
        )
      : projects;

    return {
      activeCount: active,
      archivedCount: archived,
      totalCount: projects.length,
      recentProjects: sorted.slice(0, 5),
    };
  }, [projects]);

  const { roleCounts, statusCounts, totalUsers } = useMemo(() => {
    const users = Array.isArray(usersStatsQuery.data) ? usersStatsQuery.data : [];
    return {
      roleCounts: buildRoleCounts(users),
      statusCounts: buildStatusCounts(users),
      totalUsers: users.length,
    };
  }, [usersStatsQuery.data]);

  const projectsErrorMessage = projectsQuery.isError
    ? getApiErrorMessage(projectsQuery.error, 'Failed to load projects')
    : null;

  const usersErrorMessage = usersStatsQuery.isError
    ? getApiErrorMessage(usersStatsQuery.error, 'Failed to load users')
    : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Welcome back, <span className="font-medium">{user?.name || '—'}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/projects"
            className="inline-flex items-center justify-center rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            View Projects
          </Link>
          {isAdmin && (
            <Link
              to="/users"
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Manage Users
            </Link>
          )}
        </div>
      </div>

      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4 min-w-0">
            <div className="h-12 w-12 rounded-xl bg-gray-900 text-white flex items-center justify-center font-semibold shrink-0">
              {getInitials(user)}
            </div>
            <div className="min-w-0">
              <div className="text-lg font-semibold text-gray-900 truncate">
                {user?.name || '—'}
              </div>
              <div className="text-sm text-gray-600 truncate">{user?.email || '—'}</div>
              <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500">
                <span className="inline-flex items-center gap-1">
                  Role: <RoleBadge role={user?.role} />
                </span>
                <span className="hidden sm:inline text-gray-300">•</span>
                <span className="inline-flex items-center gap-1">
                  Status:{' '}
                  <span
                    className={classNames(
                      'font-medium',
                      user?.status === 'ACTIVE' ? 'text-emerald-700' : 'text-amber-700',
                    )}
                  >
                    {user?.status || '—'}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
              <div className="text-xs text-gray-500">Active</div>
              <div className="mt-1 font-semibold text-gray-900">
                {projectsQuery.isLoading ? '—' : activeCount}
              </div>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
              <div className="text-xs text-gray-500">Archived</div>
              <div className="mt-1 font-semibold text-gray-900">
                {projectsQuery.isLoading ? '—' : archivedCount}
              </div>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
              <div className="text-xs text-gray-500">Total</div>
              <div className="mt-1 font-semibold text-gray-900">
                {projectsQuery.isLoading ? '—' : totalCount}
              </div>
            </div>
          </div>
        </div>

        <InlineMessage className="mt-3 text-xs" tone="muted">
          Your account details and workspace stats.
        </InlineMessage>
      </Card>

      <RecentProjectsCard
        projects={recentProjects}
        isLoading={projectsQuery.isLoading}
        isError={projectsQuery.isError}
        errorMessage={projectsErrorMessage}
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Project Stats</h2>
          <Link className="text-sm text-gray-700 hover:underline" to="/projects">
            Open projects
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Active Projects"
            value={activeCount}
            icon={statIcons.projects}
            tone="success"
            to="/projects"
            isLoading={projectsQuery.isLoading}
          />
          <StatCard
            title="Archived Projects"
            value={archivedCount}
            icon={statIcons.archived}
            tone="warning"
            to="/projects"
            isLoading={projectsQuery.isLoading}
          />
          <StatCard
            title="Total Projects"
            value={totalCount}
            icon={statIcons.projects}
            tone="info"
            to="/projects"
            isLoading={projectsQuery.isLoading}
          />
        </div>

        {projectsQuery.isError && (
          <InlineMessage className="text-sm" tone="error">
            {projectsErrorMessage}
          </InlineMessage>
        )}
      </div>

      {isAdmin && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">User Stats</h2>
            <span className="text-xs text-gray-500">Admin only</span>
          </div>

          {usersStatsQuery.isError && (
            <InlineMessage className="text-sm" tone="error">
              {usersErrorMessage}
            </InlineMessage>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Users"
              value={totalUsers}
              subtitle={`Active: ${statusCounts.ACTIVE} • Inactive: ${statusCounts.INACTIVE}`}
              icon={statIcons.users}
              tone="neutral"
              to="/users"
              isLoading={usersStatsQuery.isLoading}
            />
            <StatCard
              title="Admins"
              value={roleCounts.ADMIN}
              icon={statIcons.admins}
              tone="info"
              to="/users"
              isLoading={usersStatsQuery.isLoading}
            />
            <StatCard
              title="Managers"
              value={roleCounts.MANAGER}
              icon={BriefcaseIcon}
              tone="warning"
              to="/users"
              isLoading={usersStatsQuery.isLoading}
            />
            <StatCard
              title="Staff"
              value={roleCounts.STAFF}
              icon={statIcons.staff}
              tone="success"
              to="/users"
              isLoading={usersStatsQuery.isLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
}

