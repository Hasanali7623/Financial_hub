import { useEffect, useState } from "react";

// Enhanced 3D-style animations with CSS
export default function Enhanced3DBackground({
  variant = "login",
  className = "",
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Color schemes for different pages
  const colorSchemes = {
    login: {
      gradients: [
        "from-slate-900 via-blue-950 to-indigo-950",
        "from-emerald-900/20 via-transparent to-blue-900/30",
      ],
      particles: ["emerald", "cyan", "blue", "teal"],
      shapes: ["emerald", "cyan", "blue"],
    },
    register: {
      gradients: [
        "from-slate-900 via-blue-950 to-indigo-950",
        "from-emerald-900/20 via-transparent to-blue-900/30",
      ],
      particles: ["emerald", "cyan", "blue", "teal"],
      shapes: ["emerald", "cyan", "blue"],
    },
  };

  const colors = colorSchemes[variant];

  return (
    <div className={`absolute inset-0 ${className}`} style={{ zIndex: -1 }}>
      {/* Base sophisticated gradient background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${colors.gradients[0]}`}
      />
      <div
        className={`absolute inset-0 bg-gradient-to-tr ${colors.gradients[1]}`}
      />

      {/* 3D Animated gradient overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "linear-gradient(-45deg, #0f172a, #1e3a8a, #065f46, #0e7490, #1e40af, #0f172a)",
          backgroundSize: "600% 600%",
          animation: "gradient3D 12s ease infinite",
        }}
      />

      {/* Enhanced floating particles with 3D effects */}
      {mounted && (
        <>
          {[...Array(25)].map((_, i) => {
            const colorClass = colors.particles[i % colors.particles.length];
            return (
              <div
                key={i}
                className={`absolute rounded-full animate-float3D bg-gradient-to-br from-${colorClass}-400/40 to-${colorClass}-600/20`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 6 + 2}px`,
                  height: `${Math.random() * 6 + 2}px`,
                  background: `radial-gradient(circle, var(--tw-gradient-stops))`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${Math.random() * 4 + 3}s`,
                  boxShadow: `0 0 20px rgba(16, 185, 129, 0.3), 0 0 40px rgba(6, 182, 212, 0.2)`,
                  filter: "blur(0.5px)",
                }}
              />
            );
          })}
        </>
      )}

      {/* 3D Floating geometric shapes with depth */}
      <div className="absolute inset-0">
        {/* 3D Cube effect */}
        <div
          className="absolute animate-float3D transform-gpu"
          style={{
            top: "15%",
            left: "8%",
            animationDuration: "8s",
            animationDelay: "0s",
            perspective: "1000px",
          }}
        >
          <div className="w-16 h-16 relative transform-gpu rotate-45 animate-spin3D">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-cyan-600/30 rounded-lg backdrop-blur-sm border border-emerald-400/30 shadow-lg shadow-emerald-400/20" />
            <div className="absolute inset-1 bg-gradient-to-tl from-emerald-500/10 to-cyan-500/20 rounded-lg" />
          </div>
        </div>

        {/* 3D Sphere effect */}
        <div
          className="absolute animate-float3D transform-gpu"
          style={{
            top: "40%",
            right: "12%",
            animationDuration: "10s",
            animationDelay: "2s",
          }}
        >
          <div className="w-20 h-20 relative">
            <div className="absolute inset-0 rounded-full bg-gradient-radial from-cyan-400/30 via-blue-500/20 to-transparent animate-pulse3D backdrop-blur-sm border border-cyan-400/20 shadow-xl shadow-cyan-400/20" />
            <div className="absolute inset-2 rounded-full bg-gradient-radial from-cyan-500/20 to-transparent" />
            <div className="absolute top-2 left-2 w-4 h-4 rounded-full bg-white/30 blur-sm" />
          </div>
        </div>

        {/* 3D Hexagon */}
        <div
          className="absolute animate-float3D transform-gpu"
          style={{
            bottom: "25%",
            left: "15%",
            animationDuration: "7s",
            animationDelay: "1s",
          }}
        >
          <div className="w-14 h-14 relative animate-spin3D">
            <div
              className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-600/30 backdrop-blur-sm border border-blue-400/30 shadow-lg shadow-blue-400/20"
              style={{
                clipPath:
                  "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
              }}
            />
          </div>
        </div>

        {/* 3D Triangle */}
        <div
          className="absolute animate-float3D transform-gpu"
          style={{
            bottom: "40%",
            right: "20%",
            animationDuration: "6s",
            animationDelay: "3s",
          }}
        >
          <div className="w-12 h-12 relative animate-spin3D">
            <div
              className="absolute inset-0 bg-gradient-to-br from-teal-400/20 to-emerald-600/30 backdrop-blur-sm border border-teal-400/30 shadow-lg shadow-teal-400/20"
              style={{
                clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Enhanced grid with 3D depth */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="h-full w-full animate-grid3D"
          style={{
            backgroundImage: `
              linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px),
              linear-gradient(rgba(59, 130, 246, 0.05) 2px, transparent 2px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.05) 2px, transparent 2px)
            `,
            backgroundSize: "30px 30px, 30px 30px, 120px 120px, 120px 120px",
          }}
        />
      </div>

      {/* 3D Light rays effect */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-emerald-400/30 via-transparent to-cyan-400/20 animate-pulse3D transform rotate-12"
          style={{ animationDelay: "0s", animationDuration: "4s" }}
        />
        <div
          className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-blue-400/20 via-transparent to-emerald-400/30 animate-pulse3D transform -rotate-12"
          style={{ animationDelay: "2s", animationDuration: "5s" }}
        />
      </div>

      {/* Radial 3D spotlight effects */}
      <div className="absolute inset-0 opacity-25">
        <div
          className="absolute animate-pulse3D"
          style={{
            top: "20%",
            left: "30%",
            width: "200px",
            height: "200px",
            background:
              "radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(40px)",
            animationDelay: "0s",
          }}
        />
        <div
          className="absolute animate-pulse3D"
          style={{
            bottom: "30%",
            right: "20%",
            width: "150px",
            height: "150px",
            background:
              "radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(30px)",
            animationDelay: "2s",
          }}
        />
      </div>
    </div>
  );
}
