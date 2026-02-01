export default function ProjectCreateForm({
  name,
  description,
  onNameChange,
  onDescriptionChange,
  onSubmit,
  isSubmitting,
  errorMessage,
}) {
  return (
    <>
      <div className="mt-4 grid gap-2 md:grid-cols-3">
        <input
          className="border rounded px-3 py-2"
          placeholder="Name"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
        />
        <input
          className="border rounded px-3 py-2 md:col-span-2"
          placeholder="Description"
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
        />
      </div>

      <button
        className="mt-3 px-4 py-2 rounded bg-gray-900 text-white"
        disabled={isSubmitting}
        onClick={onSubmit}
      >
        {isSubmitting ? 'Creating...' : 'Create Project'}
      </button>

      {errorMessage && (
        <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
      )}
    </>
  );
}
