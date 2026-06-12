import {
  Menu,
  Bell,
  User,
  LogOut,
  Moon,
  Sun,
  Wallet,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NotificationCenter from "./NotificationCenter";

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (localStorage.getItem("darkMode") === "true") return true;
    if (localStorage.getItem("darkMode") === "false") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "shadow-lg" : ""
      }`}
      style={{
        background: isScrolled
          ? "rgba(var(--navbar-rgb, 255,255,255), 0.97)"
          : "var(--color-surface)",
        borderBottom: `1px solid ${isScrolled ? "rgba(0,0,0,0.08)" : "var(--color-border)"}`,
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Accent strip */}
      <div
        className="h-0.5"
        style={{
          background:
            "linear-gradient(90deg, #4F46E5 0%, #7C3AED 40%, #EC4899 80%, #F59E0B 100%)",
        }}
      />

      <div className="px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">

          {/* Left: hamburger + logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95"
              style={{ color: "var(--color-text-secondary)" }}
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600 to-purple-700 flex items-center justify-center shadow-md">
                <Wallet className="h-4 w-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1
                  className="text-base font-extrabold tracking-tight"
                  style={{ color: "var(--color-text-primary)", fontSize: "1rem" }}
                >
                  FinanceHub
                </h1>
                <p
                  className="text-[10px] font-medium leading-none"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Smart Money Management
                </p>
              </div>
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2">

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95"
              style={{ color: "var(--color-text-secondary)" }}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? (
                <Sun className="h-4.5 w-4.5 text-amber-500" />
              ) : (
                <Moon className="h-4.5 w-4.5" />
              )}
            </button>

            <NotificationCenter />

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95"
                style={{ border: "1.5px solid var(--color-border)" }}
              >
                <div className="relative">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold leading-tight" style={{ color: "var(--color-text-primary)" }}>
                    {user?.name}
                  </p>
                  <p className="text-[10px] leading-tight" style={{ color: "var(--color-text-muted)" }}>
                    Premium
                  </p>
                </div>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    showProfile ? "rotate-180" : ""
                  }`}
                  style={{ color: "var(--color-text-muted)" }}
                />
              </button>

              {showProfile && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowProfile(false)}
                  />

                  {/* Dropdown */}
                  <div
                    className="absolute right-0 mt-2 w-72 rounded-2xl z-50 overflow-hidden animate-fade-in"
                    style={{
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      boxShadow: "0 10px 40px -8px rgba(0,0,0,0.2), 0 2px 8px -2px rgba(0,0,0,0.1)",
                    }}
                  >
                    {/* Profile Header */}
                    <div
                      className="px-4 py-4 relative overflow-hidden"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(124,58,237,0.05) 100%)",
                        borderBottom: "1px solid var(--color-border)",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {user?.name?.charAt(0).toUpperCase()}
                          </div>
                          <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-amber-400 drop-shadow" />
                        </div>
                        <div>
                          <p className="font-bold text-sm" style={{ color: "var(--color-text-primary)" }}>
                            {user?.name}
                          </p>
                          <p className="text-xs mt-0.5 truncate max-w-[160px]" style={{ color: "var(--color-text-muted)" }}>
                            {user?.email}
                          </p>
                          <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-primary-600 to-purple-600 text-white">
                            <Sparkles className="h-2.5 w-2.5" />
                            Premium Member
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setShowProfile(false);
                          navigate("/profile");
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 hover:bg-slate-100 dark:hover:bg-slate-800 group"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors">
                          <User className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                        </div>
                        My Profile
                      </button>

                      <div
                        className="my-1.5 mx-2 h-px"
                        style={{ background: "var(--color-border)" }}
                      />

                      <button
                        onClick={() => {
                          logout();
                          setShowProfile(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 hover:bg-red-50 dark:hover:bg-red-900/20 group text-red-600 dark:text-red-400"
                      >
                        <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/30 flex items-center justify-center group-hover:bg-red-100 dark:group-hover:bg-red-900/50 transition-colors">
                          <LogOut className="h-4 w-4 text-red-500" />
                        </div>
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
