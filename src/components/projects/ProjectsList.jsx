import DataList from '../ui/DataList';

export default function ProjectsList({
  projects,
  isLoading,
  isError,
  emptyMessage = 'No projects yet.',
  renderItem,
}) {
  return (
    <DataList
      items={projects}
      isLoading={isLoading}
      isError={isError}
      emptyMessage={emptyMessage}
      loadingMessage="Loading..."
      errorMessage="Failed to load projects"
      renderItem={renderItem}
    />
  );
}
