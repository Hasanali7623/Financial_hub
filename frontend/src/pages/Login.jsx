import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, AlertCircle, Github, ArrowRight, Shield, Zap, TrendingUp, Chrome, Apple } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const { login } = useAuth();
  const navigate = useNavigate();

  const carouselItems = [
    {
      title: "Your Money, Smarter, Safer",
      description: "Manage your finances, track expenses, invest smarter and grow your wealth — all in one place.",
      icon: <TrendingUp className="text-blue-500" size={24} />
    },
    {
      title: "Bank Level Security",
      description: "We use 256-bit encryption and multi-factor authentication to keep your data safe and sound.",
      icon: <Shield className="text-emerald-500" size={24} />
    },
    {
      title: "Instant AI Insights",
      description: "Get personalized financial advice and real-time alerts powered by advanced AI algorithms.",
      icon: <Zap className="text-amber-500" size={24} />
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselItems.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.message || "Invalid email or password");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100/50 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      {/* Left Panel - Branding & Illustration */}
      <div className="hidden lg:flex lg:w-[48%] bg-white relative overflow-hidden flex-col justify-between p-12 border-r border-gray-300">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-50 rounded-full blur-3xl opacity-60 animate-pulse-slow"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-50 rounded-full blur-3xl opacity-60 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Logo Section */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <TrendingUp className="text-white" size={22} />
          </div>
          <span className="font-bold text-2xl tracking-tight text-gray-900">Finova</span>
        </div>

        {/* Hero Illustration Area */}
        <div className="relative z-10 flex-1 flex items-center justify-center">
          <div className="relative w-full max-w-lg">
            {/* Main Illustration */}
            <div className="relative animate-float transition-all duration-700">
              <img 
                src="/assets/images/login-hero.png" 
                alt="Financial Management" 
                className="w-full h-auto drop-shadow-2xl rounded-3xl"
              />
              
              {/* Floating Mini Cards */}
              <div className="absolute -top-6 -left-6 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 animate-float-delayed">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                    <Zap size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-700 font-medium uppercase tracking-wider">Total Balance</p>
                    <p className="text-lg font-bold text-gray-900">$24,560.00</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                    <TrendingUp size={20} />
                  </div>
                  <div className="flex flex-col">
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full mb-1">
                      <div className="w-3/4 h-full bg-blue-500 rounded-full"></div>
                    </div>
                    <p className="text-[10px] text-gray-700 font-medium">Growth rate +12.5%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Carousel Section */}
        <div className="relative z-10">
          <div className="min-h-[160px]">
            <div key={carouselIndex} className="animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-gray-100 border border-gray-300 shadow-sm">
                  {carouselItems[carouselIndex].icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                  {carouselItems[carouselIndex].title}
                </h3>
              </div>
              <p className="text-gray-700 text-base leading-relaxed max-w-md">
                {carouselItems[carouselIndex].description}
              </p>
            </div>
          </div>
          
          {/* Pagination Indicators */}
          <div className="flex gap-2 items-center mt-8">
            {carouselItems.map((_, idx) => (
              <button 
                key={idx} 
                onClick={() => setCarouselIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  idx === carouselIndex ? "w-10 bg-indigo-600" : "w-3 bg-gray-200 hover:bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="relative z-10 mt-12 flex items-center justify-between border-t border-gray-300 pt-8 text-xs text-gray-600 font-medium">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><Shield size={14} className="text-gray-500"/> 256-bit Encryption</span>
            <span className="flex items-center gap-1.5"><Zap size={14} className="text-gray-500"/> Instant Setup</span>
          </div>
          <p>© 2024 Finova Inc.</p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-[52%] flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-[440px] animate-slide-in-up">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="text-white" size={22} />
            </div>
            <span className="font-bold text-2xl tracking-tight text-gray-900">Finova</span>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Welcome Back 👋</h2>
            <p className="text-gray-700 font-medium">Log in to continue managing your finances</p>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button className="flex justify-center items-center gap-3 px-4 py-3 border border-gray-300 rounded-2xl hover:bg-gray-100 transition-all text-sm font-bold text-gray-700 active:scale-[0.98] shadow-sm">
              <Chrome size={18} className="text-gray-700" />
              <span>Google</span>
            </button>
            <button className="flex justify-center items-center gap-3 px-4 py-3 border border-gray-300 rounded-2xl hover:bg-gray-100 transition-all text-sm font-bold text-gray-700 active:scale-[0.98] shadow-sm">
              <Apple size={18} className="text-gray-700" />
              <span>Apple</span>
            </button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
              <span className="bg-white px-4 text-gray-600">or use email</span>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3.5 rounded-2xl mb-6 text-sm flex items-center gap-3 animate-shake">
              <AlertCircle size={20} className="text-red-500 shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 ml-1">
                Email / Username
              </label>
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-5 py-4 rounded-2xl border border-gray-300 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-base font-medium placeholder-gray-400 transition-all bg-gray-100/50 focus:bg-white"
                  required
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600">
                  <ArrowRight size={18} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="block text-sm font-bold text-gray-700">
                  Password
                </label>
                <Link to="#" className="text-sm text-indigo-600 font-bold hover:text-indigo-700 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-5 py-4 rounded-2xl border border-gray-300 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-base font-medium placeholder-gray-400 transition-all bg-gray-100/50 focus:bg-white pr-14"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-600 focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 px-1 py-1">
              <label className="relative flex items-center cursor-pointer group">
                <input type="checkbox" className="peer sr-only" />
                <div className="w-5 h-5 border-2 border-gray-300 rounded-md bg-white peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all"></div>
                <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 transition-opacity">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="ml-3 text-sm text-gray-700 font-semibold group-hover:text-gray-900 transition-colors">Keep me logged in</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-indigo-100 text-base disabled:opacity-70 flex justify-center items-center transform active:scale-[0.99] group overflow-hidden relative"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <span className="flex items-center gap-2">
                  Log In <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-gray-700 font-medium">
              Don't have an account?{" "}
              <Link to="/register" className="text-indigo-600 font-extrabold hover:text-indigo-700 transition-colors ml-1">
                Sign up now
              </Link>
            </p>
          </div>

          {/* Social Proof / Trust */}
          <div className="mt-12 pt-8 border-t border-gray-300 flex flex-col items-center gap-4">
             <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-white bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">+50k</div>
             </div>
             <p className="text-[11px] text-gray-600 font-bold uppercase tracking-widest">Trusted by 50,000+ happy users</p>
          </div>
        </div>
      </div>
    </div>
  );
}
