export default function StatCard({
  title,
  value,
  icon: Icon,
  color = "primary",
  trend,
}) {
  const colorClasses = {
    primary: "from-blue-500 to-blue-600",
    success: "from-green-500 to-green-600",
    danger: "from-red-500 to-red-600",
    warning: "from-yellow-500 to-yellow-600",
    purple: "from-purple-500 to-purple-600",
    black: "from-gray-800 to-gray-900",
  };

  return (
    <div
      className={`bg-gradient-to-br ${colorClasses[color]} text-white rounded-xl shadow-lg p-6 transform transition-transform hover:scale-105`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {trend && <p className="text-sm mt-1 text-white/90">{trend}</p>}
        </div>
        {Icon && (
          <div className="bg-white/20 p-3 rounded-lg">
            <Icon className="h-8 w-8" />
          </div>
        )}
      </div>
    </div>
  );
}
