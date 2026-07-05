export default function EmptyState({
  title = 'No tasks found.',
  message = 'Start by creating your first task.',
  actionLabel,
  onAction,
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-title">{title}</div>
      <p>{message}</p>
      {actionLabel && (
        <button className="btn btn-primary" onClick={onAction} style={{ marginTop: '1rem' }}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
