import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, AlertCircle, Github } from "lucide-react";

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
      title: (
        <>
          Say goodbye to financial stress<br />
          with the help of FinanceHub.
        </>
      ),
      description: "Take control of your finances with FinanceHub the quickest and simplest way"
    },
    {
      title: (
        <>
          Track your expenses<br />
          like a professional.
        </>
      ),
      description: "Visualize where your money goes and save more effectively every month."
    },
    {
      title: (
        <>
          Achieve your goals<br />
          faster than ever.
        </>
      ),
      description: "Set smart financial targets and let our AI guide your budgeting strategy."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [carouselItems.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex text-gray-900 bg-white font-sans">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-blue-400 to-blue-600 relative overflow-hidden flex-col justify-between p-12">
        {/* Diagonal Light Accents */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white opacity-5 transform rotate-45 translate-x-[20%] -translate-y-[40%]"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white opacity-5 transform -rotate-45 -translate-x-[20%] translate-y-[40%]"></div>

        {/* Logo Section */}
        <div className="relative z-10 flex items-center gap-2 text-white">
          <div className="w-5 h-5 rounded-full border-2 border-white"></div>
          <span className="font-semibold text-xl tracking-wide">created by ALI</span>
        </div>

        {/* Floating Cards Graphic */}
        <div className="relative z-10 flex-1 flex items-center justify-center">
          <div className="relative w-full max-w-sm">
            {/* Card 1 */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-[70%] -translate-y-1/2 -rotate-[30deg]">
              <div className="animate-float w-48 h-32 bg-white/30 backdrop-blur-md border border-white/40 rounded-xl shadow-2xl p-4 flex flex-col justify-end">
                <div className="w-6 h-6 border border-white/50 rounded flex items-center justify-center mb-auto">
                  <div className="w-4 h-3 border border-white/50 rounded-sm"></div>
                </div>
              </div>
            </div>
            {/* Card 2 */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-[10%] -translate-y-1/2 rotate-[35deg]">
               <div className="animate-float-delayed w-48 h-32 bg-white/30 backdrop-blur-md border border-white/40 rounded-xl shadow-2xl p-4 flex flex-col justify-end">
                 <div className="w-6 h-6 border border-white/50 rounded flex items-center justify-center mb-auto">
                    <div className="w-4 h-3 border border-white/50 rounded-sm"></div>
                 </div>
               </div>
            </div>
            {/* Sparkles */}
            <div className="absolute text-white text-2xl top-[20%] left-[15%] animate-pulse-slow">✦</div>
            <div className="absolute text-white text-2xl bottom-[30%] right-[10%] animate-pulse-slow" style={{ animationDelay: '1.5s' }}>✦</div>
          </div>
        </div>

        {/* Text Section */}
        <div className="relative z-10 text-white min-h-[140px] flex flex-col justify-end">
          <div className="transition-opacity duration-500 ease-in-out" key={carouselIndex}>
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              {carouselItems[carouselIndex].title}
            </h1>
            <p className="text-blue-100 text-sm mb-8 max-w-md w-full">
              {carouselItems[carouselIndex].description}
            </p>
          </div>
          
          {/* Pagination Indicators */}
          <div className="flex gap-2 items-center">
            {carouselItems.map((_, idx) => (
              <button 
                key={idx} 
                onClick={() => setCarouselIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === carouselIndex ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 font-sans">Log In</h2>
          
          {error && (
            <div className="bg-red-50/80 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-3 animate-fade-in-up">
              <AlertCircle size={18} className="text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="group">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 transition-colors group-focus-within:text-blue-600">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Random@gmail.com"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-sm placeholder-gray-400 transition-all bg-gray-50 focus:bg-white"
                required
              />
            </div>

            <div className="group">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 transition-colors group-focus-within:text-blue-600">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Placeholder"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-sm placeholder-gray-400 transition-all bg-gray-50 focus:bg-white pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 pb-4">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500/30 accent-blue-500 cursor-pointer transition-shadow" />
                <span className="text-xs text-gray-500 group-hover:text-gray-900 transition-colors">Remember information</span>
              </label>
              <Link to="#" className="text-xs text-blue-600 font-medium hover:text-blue-700 hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-blue-500/30 text-sm disabled:opacity-70 flex justify-center items-center transform active:scale-[0.98]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-4 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex justify-center items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 active:scale-[0.98]">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 15.01 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button className="flex justify-center items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 active:scale-[0.98]">
              <Github className="w-4 h-4" />
              GitHub
            </button>
          </div>

          <div className="mt-8 text-center text-xs text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
