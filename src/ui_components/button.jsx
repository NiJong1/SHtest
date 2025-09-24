export function Button({ children, variant = "default", className = "", ...props }) {
  const base = "px-4 py-2 rounded-lg font-medium focus:outline-none transition";
  const variants = {
    default: "bg-green-600 text-white hover:bg-green-700",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300",
    destructive: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button className={`${base} ${variants[variant] || ""} ${className}`} {...props}>
      {children}
    </button>
  );
}
