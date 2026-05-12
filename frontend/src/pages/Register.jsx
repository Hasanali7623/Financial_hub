import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, AlertCircle, Chrome, Apple, ArrowRight, User, Mail, Lock, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const { register } = useAuth();
  const navigate = useNavigate();

  const carouselItems = [
    {
      title: "Unlock Your Financial Potential",
      description: "Join over 50,000 users who have transformed their relationship with money using our AI-driven tools.",
      icon: <ShieldCheck className="text-indigo-500" size={24} />
    },
    {
      title: "Security is Our DNA",
      description: "Your data is encrypted with military-grade protocols. We never sell your personal information.",
      icon: <Lock className="text-emerald-500" size={24} />
    },
    {
      title: "Wealth Growth Guaranteed",
      description: "Our users see an average of 15% increase in savings within the first 3 months of using Finova.",
      icon: <CheckCircle2 className="text-blue-500" size={24} />
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselItems.length]);

  const getPasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length > 5) score += 1;
    if (pass.length > 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    return Math.min(score, 4);
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const result = await register(name, email, password);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50/50 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      {/* Left Panel - Branding & Illustration */}
      <div className="hidden lg:flex lg:w-[48%] bg-white relative overflow-hidden flex-col justify-between p-12 border-r border-gray-100">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-indigo-50 rounded-full blur-3xl opacity-60 animate-pulse-slow"></div>
          <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] bg-blue-50 rounded-full blur-3xl opacity-60 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Logo Section */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
             <ShieldCheck className="text-white" size={22} />
          </div>
          <span className="font-bold text-2xl tracking-tight text-gray-900">Finova</span>
        </div>

        {/* Hero Illustration Area */}
        <div className="relative z-10 flex-1 flex items-center justify-center">
          <div className="relative w-full max-w-lg">
            <div className="relative animate-float transition-all duration-700">
              <img 
                src="/assets/images/register-hero.png" 
                alt="Secure Vault" 
                className="w-full h-auto drop-shadow-2xl rounded-3xl"
              />
              
              {/* Floating Status Badges */}
              <div className="absolute top-10 -right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/50 flex items-center gap-2 animate-bounce-slow">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-xs font-bold text-gray-700">System Secure</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Carousel Section */}
        <div className="relative z-10">
          <div className="min-h-[160px]">
            <div key={carouselIndex} className="animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100 shadow-sm">
                  {carouselItems[carouselIndex].icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                  {carouselItems[carouselIndex].title}
                </h3>
              </div>
              <p className="text-gray-500 text-base leading-relaxed max-w-md">
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
        <div className="relative z-10 mt-12 flex items-center justify-between border-t border-gray-100 pt-8 text-xs text-gray-400 font-medium">
          <div className="flex items-center gap-4">
            <span>Verified Provider</span>
            <span>GDPR Compliant</span>
          </div>
          <p>© 2024 Finova Inc.</p>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="w-full lg:w-[52%] flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-[460px] animate-slide-in-up my-10">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Create Account ✨</h2>
            <p className="text-gray-500 font-medium text-lg">Start your journey to financial freedom today</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <button className="flex justify-center items-center gap-3 px-4 py-3.5 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all text-sm font-bold text-gray-700 shadow-sm active:scale-[0.98]">
              <Chrome size={20} className="text-gray-500" />
              <span>Google</span>
            </button>
            <button className="flex justify-center items-center gap-3 px-4 py-3.5 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all text-sm font-bold text-gray-700 shadow-sm active:scale-[0.98]">
              <Apple size={20} className="text-gray-500" />
              <span>Apple</span>
            </button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
              <span className="bg-white px-4 text-gray-400">or sign up with email</span>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3.5 rounded-2xl mb-6 text-sm flex items-center gap-3 animate-shake">
              <AlertCircle size={20} className="text-red-500 shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 ml-1">Full Name</label>
              <div className="relative group">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-base font-medium placeholder-gray-400 transition-all bg-gray-50/50 focus:bg-white"
                  required
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300">
                  <User size={20} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 ml-1">Email Address</label>
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-base font-medium placeholder-gray-400 transition-all bg-gray-50/50 focus:bg-white"
                  required
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300">
                  <Mail size={20} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 ml-1">Password</label>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create password"
                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-base font-medium placeholder-gray-400 transition-all bg-gray-50/50 focus:bg-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-2 flex gap-1 h-1.5 px-1 animate-fade-in">
                    {[1, 2, 3, 4].map((level) => (
                      <div 
                        key={level} 
                        className={`flex-1 rounded-full transition-all duration-500 ${
                          strength >= level 
                            ? (strength <= 2 ? 'bg-amber-400' : strength === 3 ? 'bg-indigo-400' : 'bg-emerald-500')
                            : 'bg-gray-100'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 ml-1">Confirm Password</label>
                <div className="relative group">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className={`w-full px-5 py-4 rounded-2xl border outline-none focus:ring-4 text-base font-medium placeholder-gray-400 transition-all bg-gray-50/50 focus:bg-white ${
                      confirmPassword && password !== confirmPassword 
                        ? 'border-red-200 focus:border-red-400 focus:ring-red-500/10' 
                        : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/10'
                    }`}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 px-1 py-2 mt-2">
              <label className="relative flex items-center cursor-pointer group mt-0.5">
                <input type="checkbox" className="peer sr-only" required />
                <div className="w-5 h-5 border-2 border-gray-300 rounded-md bg-white peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all"></div>
                <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 transition-opacity">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </label>
              <span className="text-sm text-gray-500 font-medium leading-tight">
                I agree to the <Link to="#" className="text-indigo-600 font-bold hover:underline">Terms of Service</Link> and <Link to="#" className="text-indigo-600 font-bold hover:underline">Privacy Policy</Link>
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-indigo-100 text-lg disabled:opacity-70 flex justify-center items-center transform active:scale-[0.99] group overflow-hidden relative"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
              {loading ? (
                <div className="w-7 h-7 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <span className="flex items-center gap-2">
                  Create Account <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 font-medium">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-600 font-extrabold hover:text-indigo-700 transition-colors ml-1">
                Log in instead
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
