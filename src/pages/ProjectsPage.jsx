import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createProjectApi,
  deleteProjectApi,
  getProjectsApi,
} from '../api/projects.api';
import { queryClient } from '../app/queryClient';
import { useAuth } from '../auth/AuthProvider';

export default function ProjectsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const projectsQuery = useQuery({
    queryKey: ['projects'],
    queryFn: getProjectsApi,
  });

  const createMutation = useMutation({
    mutationFn: createProjectApi,
    onSuccess: () => {
      setName('');
      setDescription('');
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProjectApi,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['projects'] });
      const prev = queryClient.getQueryData(['projects']) || [];
      queryClient.setQueryData(['projects'], (old = []) =>
        old.filter((p) => p.id !== id),
      );
      return { prev };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(['projects'], ctx.prev);
      }
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });

  const projects = useMemo(
    () => (projectsQuery.data || []).filter((p) => !p.isDeleted),
    [projectsQuery.data],
  );

  console.log(projects);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-xl font-semibold">Projects</h1>

        <div className="mt-4 grid gap-2 md:grid-cols-3">
          <input
            className="border rounded px-3 py-2"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="border rounded px-3 py-2 md:col-span-2"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button
          className="mt-3 px-4 py-2 rounded bg-gray-900 text-white"
          disabled={createMutation.isPending}
          onClick={() => createMutation.mutate({ name, description })}
        >
          {createMutation.isPending ? 'Creating...' : 'Create Project'}
        </button>

        {createMutation.isError && (
          <p className="mt-2 text-sm text-red-600">
            {createMutation.error?.response?.data?.message || 'Create failed'}
          </p>
        )}
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        {projectsQuery.isLoading && <p>Loading...</p>}
        {projectsQuery.isError && (
          <p className="text-red-600">Failed to load projects</p>
        )}

        <div className="space-y-3">
          {projects.map((p) => (
            <div
              key={p._id}
              className="border rounded-lg p-4 flex items-start justify-between gap-3"
            >
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-sm text-gray-600">{p.description}</div>
                <div className="text-xs text-gray-400 mt-1">
                  Status: {p.status}
                </div>
              </div>

              {isAdmin && (
                <button
                  className="px-3 py-1.5 rounded bg-red-600 text-white"
                  onClick={() => deleteMutation.mutate(p._id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))}

          {!projectsQuery.isLoading && projects.length === 0 && (
            <p className="text-sm text-gray-500">No projects yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
