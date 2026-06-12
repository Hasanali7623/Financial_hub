export default function LoadingSpinner({ size = "md" }) {
  const sizeMap = { sm: "h-5 w-5 border-2", md: "h-9 w-9 border-[3px]", lg: "h-14 w-14 border-4" };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeMap[size]} rounded-full animate-spin`}
        style={{
          borderColor: "var(--color-border)",
          borderTopColor: "#6366F1",
        }}
      />
      {size !== "sm" && (
        <p className="text-xs font-medium animate-pulse" style={{ color: "var(--color-text-muted)" }}>
          Loading…
        </p>
      )}
    </div>
  );
}
