import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AUTH_ROUTES } from "../constants/endpoints";
import axiosInstance from "../lib/axios";
import { setUserData } from "../redux/slices/userSlice";
const Login = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setError("");
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.email || !formData.password) {
      setError("Email and access code are required.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(AUTH_ROUTES.LOGIN, formData);
      console.log("response: ", response);
      dispatch(setUserData(response.data.user));
      navigate("/dashboard");
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fillCredentials = (role) => {
    const credential = {
      Admin: { email: "admin@indianarmy.mil", password: "Admin@123" },
      Commander: {
        email: "commander.northern@indianarmy.mil",
        password: "Base@123",
      },
      Logistics: {
        email: "logistics@indianarmy.mil",
        password: "Logistics@123",
      },
    };
    setFormData(credential[role]);
    setError("");
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-950">
      {/* ── LEFT PANEL ─────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-14 relative overflow-hidden">
        {/* Background photo */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1569025690938-a00729c9e1f9?w=900&q=80')`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        />
        <div className="absolute inset-0 bg-slate-950/80" />
        <div
          className="absolute bottom-0 inset-x-0 h-64"
          style={{
            background: "linear-gradient(to top, #020617, transparent)",
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded bg-amber-500 shadow-lg">
            <Shield size={20} className="text-slate-900 fill-slate-900" />
          </div>
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-amber-400 uppercase">
              Indian Army
            </p>
            <p className="text-sm font-bold text-white tracking-widest">MAMS</p>
          </div>
        </div>

        {/* Bottom content */}
        <div className="relative z-10 space-y-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] text-amber-500 uppercase mb-3">
              Defense Operations Platform
            </p>
            <h2 className="text-4xl font-bold text-white leading-snug">
              Military Asset
              <br />
              Management
              <br />
              System
            </h2>
            <p className="mt-4 text-base text-slate-300 leading-relaxed">
              Real-time tracking of weapons, vehicles and ammunition across
              Northern, Western, Southern commands and forward deployments.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-700">
            {[
              { label: "Commands", value: "4" },
              { label: "Asset Types", value: "14+" },
              { label: "Role Tiers", value: "3" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-amber-400">{s.value}</p>
                <p className="text-sm text-slate-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-600">
            © 2026 Utkarsh Gupta · All sessions are logged and monitored
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-3 mb-10">
          <div className="flex h-10 w-10 items-center justify-center rounded bg-amber-500">
            <Shield size={20} className="text-slate-900 fill-slate-900" />
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest text-amber-400 uppercase">
              Indian Army
            </p>
            <p className="text-sm font-bold text-white">MAMS</p>
          </div>
        </div>

        <div className="w-full max-w-sm">
          {/* Heading */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 mb-5">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-semibold text-amber-400 tracking-wide">
                Secure Portal Active
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white">Welcome back</h1>
            <p className="mt-2 text-sm text-slate-400">
              Sign in to access your command dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-200">
                Officer Email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  placeholder="officer@indianarmy.mil"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-200">
                Access Code
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  placeholder="Enter your access code"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 py-3 pl-10 pr-11 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
                <AlertCircle
                  size={16}
                  className="mt-0.5 shrink-0 text-red-400"
                />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="group mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 py-3 text-sm font-bold text-slate-900 shadow-lg shadow-amber-500/20 transition-all hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900/30 border-t-slate-900" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Authenticate</span>
                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-slate-800" />
              <span className="text-xs text-slate-600 font-medium">
                Demo Credentials
              </span>
              <div className="h-px flex-1 bg-slate-800" />
            </div>
            <div className="space-y-2">
              {[
                {
                  role: "Admin",
                  email: "admin@indianarmy.mil",
                  badge: "text-red-400   bg-red-500/10   border-red-500/20",
                },
                {
                  role: "Commander",
                  email: "commander.northern@...",
                  badge: "text-blue-400  bg-blue-500/10  border-blue-500/20",
                },
                {
                  role: "Logistics",
                  email: "logistics@indianarmy.mil",
                  badge: "text-green-400 bg-green-500/10 border-green-500/20",
                },
              ].map((c) => (
                <button
                  key={c.role}
                  type="button"
                  onClick={() => fillCredentials(c.role)}
                  className="w-full flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 px-4 py-2.5 transition-all hover:border-slate-700 hover:bg-slate-800"
                >
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full border ${c.badge}`}
                  >
                    {c.role}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {c.email}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-600 text-center mt-3">
              Click any row to auto-fill credentials
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-slate-700 leading-relaxed">
            Unauthorized access is a punishable offense under the IT Act, 2000.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
