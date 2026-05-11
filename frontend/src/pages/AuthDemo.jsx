import { useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Eye, Sparkles } from "lucide-react";
import ThreeBackground from "../components/ThreeBackground";

export default function AuthDemo() {
  const [mounted, setMounted] = useState(false);

  useState(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Three.js Animated Background */}
      <ThreeBackground />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-indigo-900/90 to-purple-900/95" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-8">
        <div
          className={`max-w-4xl w-full text-center transform transition-all duration-1000 ${mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-white/20">
            <div className="flex items-center justify-center mb-8">
              <Sparkles className="h-12 w-12 text-yellow-400 mr-4 animate-pulse" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-600 bg-clip-text text-transparent">
                Enhanced Authentication
              </h1>
            </div>

            <p className="text-xl text-gray-200 mb-12 leading-relaxed">
              Experience our redesigned login and registration pages with
              stunning Three.js animations, glassmorphism design, and
              expert-level user interface.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Login Demo */}
              <div className="bg-white/5 backdrop-blur rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full">
                    <Eye className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Enhanced Login
                </h3>
                <p className="text-gray-300 mb-6">
                  Sophisticated design with floating particles, animated
                  gradients, and smooth transitions.
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  View Login Page
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </div>

              {/* Register Demo */}
              <div className="bg-white/5 backdrop-blur rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4 rounded-full">
                    <ExternalLink className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Enhanced Register
                </h3>
                <p className="text-gray-300 mb-6">
                  Modern signup experience with 3D graphics, premium animations,
                  and professional styling.
                </p>
                <Link
                  to="/register"
                  className="inline-flex items-center bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  View Register Page
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Features List */}
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
                <h4 className="text-lg font-semibold text-white mb-2">
                  🎨 Three.js Animations
                </h4>
                <p className="text-gray-300 text-sm">
                  Interactive 3D particles, floating geometries, and dynamic
                  lighting effects.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
                <h4 className="text-lg font-semibold text-white mb-2">
                  ✨ Glassmorphism Design
                </h4>
                <p className="text-gray-300 text-sm">
                  Modern frosted glass effects with backdrop blur and
                  transparency.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
                <h4 className="text-lg font-semibold text-white mb-2">
                  🚀 Premium UX
                </h4>
                <p className="text-gray-300 text-sm">
                  Smooth transitions, hover effects, and professional
                  typography.
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link
                to="/dashboard"
                className="text-gray-400 hover:text-white transition-colors"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
