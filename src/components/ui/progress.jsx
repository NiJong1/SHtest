export function Progress({ value, className = "" }) {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-4 ${className}`}>
      <div
        className="bg-green-600 h-4 rounded-full"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
