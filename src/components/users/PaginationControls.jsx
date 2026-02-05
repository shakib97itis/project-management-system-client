import Button from '../ui/Button';

export default function PaginationControls({ page, onPrev, onNext }) {
  return (
    <div className="mt-4 flex gap-2">
      <Button
        variant="secondary"
        size="sm"
        disabled={page === 1}
        onClick={onPrev}
      >
        Prev
      </Button>
      <Button variant="secondary" size="sm" onClick={onNext}>
        Next
      </Button>
    </div>
  );
}
