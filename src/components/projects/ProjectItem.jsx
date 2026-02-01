import ProjectEditFields from './ProjectEditFields';

function ProjectDetails({ project }) {
  return (
    <>
      <div className="font-medium">{project.name}</div>
      <div className="text-sm text-gray-600">{project.description}</div>
      <div className="text-xs text-gray-400 mt-1">
        Status: {project.status}
      </div>
    </>
  );
}

export default function ProjectItem({
  project,
  isEditing,
  editValues,
  onEditNameChange,
  onEditDescriptionChange,
  onEditStatusChange,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
  isSaving,
  isSaveDisabled,
  canManage,
  errorMessage,
}) {
  return (
    <div className="border rounded-lg p-4 flex items-start justify-between gap-3">
      <div className="flex-1">
        {isEditing ? (
          <ProjectEditFields
            name={editValues.name}
            description={editValues.description}
            status={editValues.status}
            onNameChange={onEditNameChange}
            onDescriptionChange={onEditDescriptionChange}
            onStatusChange={onEditStatusChange}
            errorMessage={errorMessage}
          />
        ) : (
          <ProjectDetails project={project} />
        )}
      </div>

      {canManage && (
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                className="px-3 py-1.5 rounded bg-gray-900 text-white disabled:opacity-60"
                disabled={isSaving || isSaveDisabled}
                onClick={() => onSaveEdit(project)}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                className="px-3 py-1.5 rounded border"
                disabled={isSaving}
                onClick={onCancelEdit}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                className="px-3 py-1.5 rounded border"
                onClick={() => onStartEdit(project)}
              >
                Edit
              </button>
              <button
                className="px-3 py-1.5 rounded bg-red-600 text-white"
                onClick={() => onDelete(project)}
              >
                Delete
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
