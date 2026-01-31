export default function PaginationControls({ page, onPrev, onNext }) {
  return (
    <div className="mt-4 flex gap-2">
      <button
        className="px-3 py-1.5 border rounded"
        disabled={page === 1}
        onClick={onPrev}
      >
        Prev
      </button>
      <button className="px-3 py-1.5 border rounded" onClick={onNext}>
        Next
      </button>
    </div>
  );
}
