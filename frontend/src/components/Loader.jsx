export default function Loader({ label = 'Loading tasks…' }) {
  return (
    <div className="loader-wrap">
      <span className="spinner" />
      {label}
    </div>
  );
}
