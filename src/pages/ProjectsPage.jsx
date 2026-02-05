import {useMemo, useState} from 'react';
import {useMutation, useQuery} from '@tanstack/react-query';
import {
  createProjectApi,
  deleteProjectApi,
  getProjectsApi,
  updateProjectApi,
} from '../api/projects.api';
import {queryClient} from '../app/queryClient';
import {useAuth} from '../auth/authContext';
import ProjectCreateForm from '../components/projects/ProjectCreateForm';
import ProjectItem from '../components/projects/ProjectItem';
import ProjectsList from '../components/projects/ProjectsList';
import Tabs from '../components/ui/Tabs';
import Card from '../components/ui/Card';
import {getApiErrorMessage} from '../utils/errors';

const PROJECT_TABS = {
  ACTIVE: 'ACTIVE',
  ARCHIVED: 'ARCHIVED',
};

export default function ProjectsPage() {
  const {user} = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [activeTab, setActiveTab] = useState(PROJECT_TABS.ACTIVE);

  const projectsQuery = useQuery({
    queryKey: ['projects'],
    queryFn: getProjectsApi,
  });

  const createMutation = useMutation({
    mutationFn: createProjectApi,
    onSuccess: () => {
      setName('');
      setDescription('');
      queryClient.invalidateQueries({queryKey: ['projects']});
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProjectApi,
    onMutate: async (id) => {
      // Optimistically update the list for a faster UI, then rollback on error.
      await queryClient.cancelQueries({queryKey: ['projects']});
      const prev = queryClient.getQueryData(['projects']) || [];
      queryClient.setQueryData(['projects'], (old = []) =>
        old.filter((p) => p._id !== id),
      );
      return {prev};
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(['projects'], ctx.prev);
      }
    },
    onSettled: () => queryClient.invalidateQueries({queryKey: ['projects']}),
  });

  const updateMutation = useMutation({
    mutationFn: ({id, payload}) => updateProjectApi(id, payload),
    onMutate: async ({id, payload}) => {
      // Optimistically update the cache so edits appear immediately.
      await queryClient.cancelQueries({queryKey: ['projects']});
      const prev = queryClient.getQueryData(['projects']) || [];
      queryClient.setQueryData(['projects'], (old = []) =>
        old.map((p) => (p._id === id ? {...p, ...payload} : p)),
      );
      return {prev};
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
    onSettled: () => queryClient.invalidateQueries({queryKey: ['projects']}),
  });

  const projects = useMemo(
    () => (projectsQuery.data || []).filter((p) => !p.isDeleted),
    [projectsQuery.data],
  );

  const {activeProjects, archivedProjects} = useMemo(() => {
    const active = [];
    const archived = [];
    for (const project of projects) {
      if (project.status === PROJECT_TABS.ARCHIVED) {
        archived.push(project);
      } else {
        active.push(project);
      }
    }
    return {activeProjects: active, archivedProjects: archived};
  }, [projects]);

  const visibleProjects =
    activeTab === PROJECT_TABS.ARCHIVED ? archivedProjects : activeProjects;

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

  const handleCreate = () => createMutation.mutate({name, description});

  const handleDelete = (project) => deleteMutation.mutate(project._id);

  const createErrorMessage = createMutation.isError
    ? getApiErrorMessage(createMutation.error, 'Create failed')
    : null;

  const updateErrorMessage = updateMutation.isError
    ? getApiErrorMessage(updateMutation.error, 'Update failed')
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
      <Card>
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
      </Card>

      <Card>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-semibold">All Projects</h2>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            tabs={[
              {
                key: PROJECT_TABS.ACTIVE,
                label: `Active (${activeProjects.length})`,
              },
              {
                key: PROJECT_TABS.ARCHIVED,
                label: `Archived (${archivedProjects.length})`,
              },
            ]}
          />
        </div>

        <ProjectsList
          projects={visibleProjects}
          isLoading={projectsQuery.isLoading}
          isError={projectsQuery.isError}
          emptyMessage={
            activeTab === PROJECT_TABS.ARCHIVED
              ? 'No archived projects yet.'
              : 'No active projects yet.'
          }
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
                hasUpdateErrorFor(project._id) ? updateErrorMessage : null
              }
            />
          )}
        />
      </Card>
    </div>
  );
}
