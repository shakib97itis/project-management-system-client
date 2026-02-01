import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createProjectApi,
  deleteProjectApi,
  getProjectsApi,
  updateProjectApi,
} from '../api/projects.api';
import { queryClient } from '../app/queryClient';
import { useAuth } from '../auth/AuthProvider';
import ProjectCreateForm from '../components/projects/ProjectCreateForm';
import ProjectItem from '../components/projects/ProjectItem';
import ProjectsList from '../components/projects/ProjectsList';

export default function ProjectsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState('');

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
        old.filter((p) => p._id !== id),
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

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateProjectApi(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: ['projects'] });
      const prev = queryClient.getQueryData(['projects']) || [];
      queryClient.setQueryData(['projects'], (old = []) =>
        old.map((p) => (p._id === id ? { ...p, ...payload } : p)),
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(['projects'], ctx.prev);
      }
    },
    onSuccess: () => {
      setEditingId(null);
      setEditName('');
      setEditDescription('');
      setEditStatus('');
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });

  const projects = useMemo(
    () => (projectsQuery.data || []).filter((p) => !p.isDeleted),
    [projectsQuery.data],
  );

  const startEdit = (project) => {
    setEditingId(project._id);
    setEditName(project.name || '');
    setEditDescription(project.description || '');
    setEditStatus(project.status || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditDescription('');
    setEditStatus('');
  };

  const saveEdit = (project) => {
    const trimmedName = editName.trim();
    const trimmedDescription = editDescription.trim();
    const trimmedStatus = editStatus.trim();
    if (!trimmedName) return;
    updateMutation.mutate({
      id: project._id,
      payload: {
        name: trimmedName,
        description: trimmedDescription,
        status: trimmedStatus,
      },
    });
  };

  const resolveErrorMessage = (error, fallback) =>
    error?.response?.data?.message || fallback;

  const isSaveDisabled = (project) => {
    const trimmedName = editName.trim();
    const trimmedDescription = editDescription.trim();
    const trimmedStatus = editStatus.trim();

    if (!trimmedName) return true;

    return (
      trimmedName === (project.name || '') &&
      trimmedDescription === (project.description || '') &&
      trimmedStatus === (project.status || '')
    );
  };

  const handleCreate = () => createMutation.mutate({ name, description });

  const handleDelete = (project) => deleteMutation.mutate(project._id);

  const createErrorMessage = createMutation.isError
    ? resolveErrorMessage(createMutation.error, 'Create failed')
    : null;

  const updateErrorMessage = updateMutation.isError
    ? resolveErrorMessage(updateMutation.error, 'Update failed')
    : null;

  const editValues = {
    name: editName,
    description: editDescription,
    status: editStatus,
  };

  const hasUpdateErrorFor = (projectId) =>
    updateMutation.isError && updateMutation.variables?.id === projectId;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-xl font-semibold">Projects</h1>

        <ProjectCreateForm
          name={name}
          description={description}
          onNameChange={setName}
          onDescriptionChange={setDescription}
          onSubmit={handleCreate}
          isSubmitting={createMutation.isPending}
          errorMessage={createErrorMessage}
        />
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <ProjectsList
          projects={projects}
          isLoading={projectsQuery.isLoading}
          isError={projectsQuery.isError}
          emptyMessage="No projects yet."
          renderItem={(project) => (
            <ProjectItem
              key={project._id}
              project={project}
              isEditing={editingId === project._id}
              editValues={editValues}
              onEditNameChange={setEditName}
              onEditDescriptionChange={setEditDescription}
              onEditStatusChange={setEditStatus}
              onStartEdit={startEdit}
              onCancelEdit={cancelEdit}
              onSaveEdit={saveEdit}
              onDelete={handleDelete}
              isSaving={updateMutation.isPending}
              isSaveDisabled={isSaveDisabled(project)}
              canManage={isAdmin}
              errorMessage={
                hasUpdateErrorFor(project._id)
                  ? updateErrorMessage
                  : null
              }
            />
          )}
        />
      </div>
    </div>
  );
}
