import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import { Mail, Lock, User, ShieldCheck } from "lucide-react";

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isAuthenticated } = useSession();

  const [isLogin, setIsLogin] = useState(location.state?.isLogin ?? true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "expert" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated]);

  useEffect(() => {
    if (location.state?.isLogin !== undefined) setIsLogin(location.state.isLogin);
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password, formData.role);
      }
      navigate("/dashboard");
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center p-4">
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{ backgroundImage: "radial-gradient(circle at 50% 0%, #0ea5e9 0%, transparent 50%)" }}
      />

      <div className="relative w-full max-w-md bg-white/[0.02] border border-white/[0.08] rounded-2xl p-8 backdrop-blur-xl z-10 my-10">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-violet-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-white mb-2">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-center text-sm text-white/40 mb-8">
          {isLogin ? "Sign in to access your portal" : "Sign up to start using MVCVS"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-1 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  required type="text" placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-1 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                required type="email" placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-1 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                required type="password" placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition"
              />
            </div>
          </div>

          {!isLogin && (
            <div className="pt-2">
              <label className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2 block">I am a...</label>
              <div className="flex gap-4">
                {["expert", "citizen"].map((role) => (
                  <label key={role} className="flex-1 flex items-center gap-2 p-3 border border-white/10 rounded-lg cursor-pointer hover:bg-white/5">
                    <input
                      type="radio" name="role" value={role}
                      checked={formData.role === role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="text-sky-500"
                    />
                    <span className="text-sm text-white capitalize">{role}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
              {errorMsg}
            </div>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full py-3 mt-4 rounded-lg font-bold text-white transition-all bg-gradient-to-r from-sky-500 to-violet-600 hover:opacity-90 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-white/50">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => { setIsLogin(!isLogin); setErrorMsg(""); }}
            className="ml-2 text-sky-400 hover:text-sky-300 font-semibold transition"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}