export default function ProjectsList({
  projects,
  isLoading,
  isError,
  emptyMessage = 'No projects yet.',
  renderItem,
}) {
  return (
    <>
      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-600">Failed to load projects</p>}

      <div className="space-y-3">
        {projects.map(renderItem)}

        {!isLoading && projects.length === 0 && emptyMessage && (
          <p className="text-sm text-gray-500">{emptyMessage}</p>
        )}
      </div>
    </>
  );
}
