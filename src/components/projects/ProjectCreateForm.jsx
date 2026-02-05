import Button from '../ui/Button';
import InlineMessage from '../ui/InlineMessage';
import TextInput from '../ui/TextInput';

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
        <TextInput
          placeholder="Name"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
        />
        <TextInput
          className="md:col-span-2"
          placeholder="Description"
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
        />
      </div>

      <Button
        className="mt-3"
        disabled={isSubmitting}
        onClick={onSubmit}
        isLoading={isSubmitting}
        loadingLabel="Creating..."
      >
        Create Project
      </Button>

      {errorMessage && (
        <InlineMessage className="mt-2 text-sm" tone="error">
          {errorMessage}
        </InlineMessage>
      )}
    </>
  );
}
