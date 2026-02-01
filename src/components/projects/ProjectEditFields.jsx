export default function ProjectEditFields({
  name,
  description,
  status,
  onNameChange,
  onDescriptionChange,
  onStatusChange,
  errorMessage,
}) {
  return (
    <div className="space-y-2">
      <input
        className="w-full border rounded px-3 py-2"
        placeholder="Name"
        value={name}
        onChange={(event) => onNameChange(event.target.value)}
      />
      <input
        className="w-full border rounded px-3 py-2"
        placeholder="Description"
        value={description}
        onChange={(event) => onDescriptionChange(event.target.value)}
      />
      <select
        className="w-full border rounded px-3 py-2"
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
      >
        <option value="ACTIVE">ACTIVE</option>
        <option value="ARCHIVED">ARCHIVED</option>
      </select>
      {errorMessage && (
        <p className="text-xs text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}
