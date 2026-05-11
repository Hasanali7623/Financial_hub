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
    // Check localStorage or system preference
    if (localStorage.getItem("darkMode") === "true") {
      return true;
    }
    if (localStorage.getItem("darkMode") === "false") {
      return false;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    // Apply dark mode class to html element
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <nav
      className={`backdrop-blur-lg bg-white/95 dark:bg-gray-900/95 fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "shadow-2xl border-b-2 border-black/20 dark:border-gray-500/30"
          : "shadow-lg"
      }`}
    >
      {/* Animated gradient accent bar */}
      <div className="h-1 bg-gradient-to-r from-gray-800 via-black to-gray-700 animate-gradient-x bg-[length:200%_100%]"></div>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuClick}
              className="md:hidden p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gradient-to-br hover:from-gray-800 hover:via-black hover:to-gray-700 hover:text-white transition-all duration-300 transform hover:scale-110 hover:rotate-180 active:scale-95 shadow-lg hover:shadow-black/50"
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-black to-gray-700 rounded-2xl blur-md opacity-40 group-hover:opacity-60 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-gray-800 via-black to-gray-700 p-2.5 rounded-2xl shadow-xl group-hover:shadow-2xl group-hover:shadow-black/50 transition-all duration-300 group-hover:scale-110">
                  <Wallet className="h-6 w-6 text-white drop-shadow-lg" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-extrabold bg-gradient-to-r from-gray-800 via-black to-gray-700 dark:from-gray-300 dark:via-white dark:to-gray-300 bg-clip-text text-transparent drop-shadow-sm">
                  FinanceHub
                </h1>
                <p className="text-[11px] font-medium text-gray-600 dark:text-gray-400 hidden sm:block tracking-wide">
                  💎 Smart Money Management
                </p>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="relative p-3 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 hover:from-gray-800 hover:to-black hover:shadow-xl hover:shadow-black/50 transition-all duration-300 transform hover:scale-110 hover:rotate-12 active:scale-95 group border-2 border-gray-200 dark:border-gray-600 hover:border-transparent"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <div className="relative">
                {darkMode ? (
                  <Sun className="h-5 w-5 text-yellow-400 group-hover:text-white transition-all duration-300 drop-shadow-md group-hover:rotate-90" />
                ) : (
                  <Moon className="h-5 w-5 text-indigo-600 group-hover:text-white transition-all duration-300 drop-shadow-md group-hover:rotate-12" />
                )}
              </div>
            </button>

            <NotificationCenter />

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 hover:from-gray-100 hover:via-gray-200 hover:to-gray-100 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-300 transform hover:scale-105 active:scale-95 border-2 border-gray-200 dark:border-gray-600 hover:border-black dark:hover:border-gray-500 hover:shadow-xl hover:shadow-black/30"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-black to-gray-700 rounded-full blur-sm opacity-40 animate-pulse"></div>
                  <div className="relative h-10 w-10 rounded-full bg-gradient-to-br from-gray-800 via-black to-gray-700 flex items-center justify-center text-white font-extrabold text-lg shadow-xl">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full animate-pulse shadow-lg"></div>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {user?.name}
                  </p>
                  <p className="text-xs font-medium bg-gradient-to-r from-gray-800 to-black dark:from-gray-300 dark:to-white bg-clip-text text-transparent">
                    ✨ Premium User
                  </p>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-gray-600 dark:text-gray-300 transition-all duration-300 ${
                    showProfile
                      ? "rotate-180 text-purple-600 dark:text-purple-400"
                      : ""
                  }`}
                />
              </button>

              {showProfile && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowProfile(false)}
                  ></div>

                  {/* Dropdown */}
                  <div className="absolute right-0 mt-3 w-[calc(100vw-1rem)] sm:w-80 max-w-sm backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 rounded-2xl shadow-2xl py-2 border-2 border-purple-200 dark:border-purple-500/30 z-20 animate-in fade-in slide-in-from-top-5 duration-200">
                    {/* Profile Section */}
                    <div className="px-4 py-4 border-b-2 border-purple-200 dark:border-purple-500/30 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 rounded-t-2xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 animate-pulse"></div>
                      <div className="flex items-center space-x-3 relative z-10">
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 rounded-full blur-md opacity-50 group-hover:opacity-75 animate-pulse"></div>
                          <div className="relative h-14 w-14 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 flex items-center justify-center text-white font-extrabold text-xl shadow-2xl ring-4 ring-white dark:ring-gray-800">
                            {user?.name?.charAt(0).toUpperCase()}
                          </div>
                          <Sparkles className="absolute -top-1 -right-1 h-6 w-6 text-yellow-400 animate-bounce drop-shadow-lg" />
                        </div>
                        <div className="flex-1">
                          <p className="text-base font-extrabold text-gray-900 dark:text-gray-100">
                            {user?.name}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate font-medium">
                            {user?.email}
                          </p>
                          <span className="inline-flex items-center mt-1.5 px-2.5 py-1 text-xs font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white rounded-full shadow-lg">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Premium Member
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setShowProfile(false);
                          navigate("/profile");
                        }}
                        className="w-full flex items-center px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-100 hover:via-pink-100 hover:to-orange-100 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-300 rounded-lg group"
                      >
                        <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3 group-hover:bg-gradient-to-br group-hover:from-purple-500 group-hover:to-pink-500 transition-all duration-300">
                          <User className="h-4 w-4 text-purple-600 dark:text-purple-400 group-hover:text-white" />
                        </div>
                        My Profile
                      </button>

                      <div className="my-2 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent dark:via-purple-500/30"></div>

                      <button
                        onClick={() => {
                          logout();
                          setShowProfile(false);
                        }}
                        className="w-full flex items-center px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 rounded-lg group"
                      >
                        <div className="h-8 w-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3 group-hover:bg-red-500 transition-all duration-300">
                          <LogOut className="h-4 w-4 text-red-600 dark:text-red-400 group-hover:text-white" />
                        </div>
                        Logout
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
