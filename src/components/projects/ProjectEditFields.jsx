import InlineMessage from '../ui/InlineMessage';
import SelectInput from '../ui/SelectInput';
import TextInput from '../ui/TextInput';

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'ACTIVE' },
  { value: 'ARCHIVED', label: 'ARCHIVED' },
];

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
      <TextInput
        className="w-full"
        placeholder="Name"
        value={name}
        onChange={(event) => onNameChange(event.target.value)}
      />
      <TextInput
        className="w-full"
        placeholder="Description"
        value={description}
        onChange={(event) => onDescriptionChange(event.target.value)}
      />
      <SelectInput
        className="w-full"
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
        options={STATUS_OPTIONS}
      />
      {errorMessage && (
        <InlineMessage className="text-xs" tone="error">
          {errorMessage}
        </InlineMessage>
      )}
    </div>
  );
}
