import {
  ArrowRight,
  BarChart2,
  GitMerge,
  Lock,
  Shield,
  ShoppingCart,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const FEATURES = [
  {
    icon: BarChart2,
    title: "Live Dashboard",
    desc: "Opening balance, closing balance and net movement across all commands in real time.",
  },
  {
    icon: ShoppingCart,
    title: "Purchases",
    desc: "Record and audit every procurement — weapons, vehicles, ammunition — against a base and supplier.",
  },
  {
    icon: GitMerge,
    title: "Transfers",
    desc: "Move assets between commands with a full status trail: pending, in transit, completed.",
  },
  {
    icon: Users,
    title: "Assignments",
    desc: "Assign assets to individual personnel and track expended or returned items with timestamps.",
  },
  {
    icon: Lock,
    title: "Role-Based Access",
    desc: "Three-tier RBAC — Admin, Base Commander, Logistics Officer — enforced at the API level.",
  },
  {
    icon: Shield,
    title: "Audit Logging",
    desc: "Every write operation is logged with user, role, IP address and timestamp for full accountability.",
  },
];

const STACK = [
  { label: "Frontend", value: "React 19 + Vite + Tailwind CSS" },
  { label: "State", value: "Redux Toolkit" },
  { label: "Backend", value: "Node.js + Express (ESM)" },
  { label: "Database", value: "MongoDB + Mongoose" },
  { label: "Auth", value: "JWT + bcryptjs" },
  { label: "Deployment", value: "Vercel + Render + MongoDB Atlas" },
];

const STATS = [
  { value: "4", label: "Commands" },
  { value: "14+", label: "Asset Types" },
  { value: "3", label: "Role Tiers" },
  { value: "100%", label: "Audit Logged" },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white font-mono">
      {/* ── NAVBAR ──────────────────────────────────────────────── */}
      <nav className="border-b border-slate-800 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center shrink-0">
              <Shield size={18} className="text-slate-900 fill-slate-900" />
            </div>
            <div>
              <span className="text-sm font-black tracking-widest text-white">
                MAMS
              </span>
              <span className="hidden sm:inline ml-3 text-xs text-slate-500">
                Military Asset Management System
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm rounded-lg px-4 py-2 cursor-pointer transition-colors"
          >
            Sign In <ArrowRight size={14} />
          </button>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1569025690938-a00729c9e1f9?w=1400&q=80')`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/80 to-slate-950" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 border border-amber-500/30 bg-amber-500/8 rounded-full px-4 py-1.5 mb-7">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-bold text-amber-400 tracking-[0.25em] uppercase">
              Indian Army — Defence Operations Platform
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-tight tracking-tight mb-6">
            Military Asset
            <br />
            <span className="text-amber-400">Management System</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto leading-relaxed mb-10">
            A secure, role-based platform for tracking weapons, vehicles and
            ammunition across Northern, Western, Southern commands and forward
            deployments.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-base rounded-xl px-7 py-3.5 cursor-pointer transition-colors shadow-lg shadow-amber-500/20"
            >
              Access System <ArrowRight size={16} />
            </button>
            <a
              href="https://github.com/Wolfgang281/military-asset-management-system"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-slate-700 bg-slate-900 hover:bg-slate-800 rounded-xl px-7 py-3.5 text-base font-semibold text-slate-300 no-underline transition-colors"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────── */}
      <section className="border-y border-slate-800 bg-slate-900/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-4xl sm:text-5xl font-black text-amber-400 mb-2">
                  {s.value}
                </p>
                <p className="text-sm text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-xs font-bold tracking-[0.3em] text-amber-500 uppercase mb-3">
            Platform Capabilities
          </p>
          <h2 className="text-3xl sm:text-4xl font-black mb-4">
            Everything in one system
          </h2>
          <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
            From procurement to expiry, every asset movement is tracked, logged
            and visible to the right people.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-slate-800 bg-slate-900 p-7 hover:border-slate-700 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-5">
                <f.icon size={22} className="text-amber-400" />
              </div>
              <h3 className="text-base font-bold text-white mb-2.5">
                {f.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TECH STACK ──────────────────────────────────────────── */}
      <section className="border-t border-slate-800 bg-slate-900/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-[0.3em] text-amber-500 uppercase mb-3">
              Tech Stack
            </p>
            <h2 className="text-3xl sm:text-4xl font-black">
              Built with modern tooling
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {STACK.map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900 px-5 py-4"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">
                    {s.label}
                  </p>
                  <p className="text-sm font-semibold text-slate-200">
                    {s.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ───────────────────────────────────────────────── */}
      <section className="border-t border-slate-800">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
          <p className="text-xs font-bold tracking-[0.3em] text-amber-500 uppercase mb-3">
            About
          </p>
          <h2 className="text-3xl sm:text-4xl font-black mb-5">
            Built by Utkarsh Gupta
          </h2>
          <p className="text-slate-400 leading-relaxed mb-10">
            MAMS is a take-home engineering project demonstrating a full-stack
            secure application with role-based access control, RESTful APIs,
            MongoDB aggregation pipelines and a responsive React frontend. The
            system models real-world military logistics workflows including
            procurement, inter-command transfers, personnel assignments and a
            complete audit trail of every transaction.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-5">
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-base rounded-xl px-7 py-3.5 cursor-pointer transition-colors"
            >
              Access System <ArrowRight size={16} />
            </button>
            <a
              href="https://github.com/Wolfgang281/military-asset-management-system"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-500 underline underline-offset-4 hover:text-slate-300 transition-colors"
            >
              github.com/Wolfgang281/MAMS
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800 px-4 sm:px-6 py-5">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded bg-amber-500/10 flex items-center justify-center">
              <Shield size={11} className="text-amber-500" />
            </div>
            <span className="text-xs text-slate-600">
              MAMS — Military Asset Management System
            </span>
          </div>
          <span className="text-xs text-slate-600">
            © 2026 Utkarsh Gupta · All rights reserved
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Home;
