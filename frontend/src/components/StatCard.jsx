export default function StatCard({
  title,
  value,
  icon: Icon,
  color = "primary",
  trend,
}) {
  const variants = {
    primary: {
      bg: "from-blue-500 to-blue-600",
      glow: "rgba(59,130,246,0.35)",
    },
    success: {
      bg: "from-emerald-500 to-emerald-600",
      glow: "rgba(16,185,129,0.35)",
    },
    danger: {
      bg: "from-red-500 to-red-600",
      glow: "rgba(239,68,68,0.35)",
    },
    warning: {
      bg: "from-amber-500 to-amber-600",
      glow: "rgba(245,158,11,0.35)",
    },
    purple: {
      bg: "from-violet-500 to-purple-600",
      glow: "rgba(139,92,246,0.35)",
    },
    black: {
      bg: "from-slate-700 to-slate-900",
      glow: "rgba(30,41,59,0.4)",
    },
  };

  const v = variants[color] || variants.primary;

  return (
    <div
      className={`relative bg-gradient-to-br ${v.bg} text-white rounded-2xl p-5 overflow-hidden transition-all duration-200 hover:-translate-y-1 cursor-default select-none`}
      style={{
        boxShadow: `0 2px 4px ${v.glow}, 0 8px 24px -6px ${v.glow}`,
      }}
    >
      {/* Decorative circle */}
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/20" />
      <div className="absolute -right-2 -bottom-6 w-32 h-32 rounded-full bg-white/20" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-white/75 text-xs font-semibold uppercase tracking-wider mb-2">{title}</p>
          <p className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-none">{value}</p>
          {trend && (
            <p className="text-white/80 text-xs mt-2 font-medium">{trend}</p>
          )}
        </div>
        {Icon && (
          <div className="shrink-0 bg-white/20 backdrop-blur-sm p-2.5 rounded-xl shadow-sm">
            <Icon className="h-6 w-6 text-white" />
          </div>
        )}
      </div>
    </div>
  );
}
