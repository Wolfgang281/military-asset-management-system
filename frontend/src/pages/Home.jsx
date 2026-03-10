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
    <div
      className="min-h-screen bg-slate-950 text-white"
      style={{ fontFamily: "system-ui, sans-serif" }}
    >
      {/* ── NAVBAR ─────────────────────────────────────────────── */}
      <nav style={{ borderBottom: "1px solid #1e293b", padding: "16px 24px" }}>
        <div
          style={{
            maxWidth: 1152,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                background: "#f59e0b",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Shield size={18} color="#0f172a" fill="#0f172a" />
            </div>
            <div>
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  letterSpacing: "0.15em",
                  color: "white",
                }}
              >
                MAMS
              </span>
              <span style={{ marginLeft: 10, fontSize: 13, color: "#64748b" }}>
                Military Asset Management System
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate("/login")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#f59e0b",
              color: "#0f172a",
              border: "none",
              borderRadius: 8,
              padding: "10px 20px",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Sign In <ArrowRight size={15} />
          </button>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.15,
            backgroundImage: `url('https://images.unsplash.com/photo-1569025690938-a00729c9e1f9?w=1400&q=80')`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(2,6,23,0.5), rgba(2,6,23,0.85), #020617)",
          }}
        />

        <div
          style={{
            position: "relative",
            maxWidth: 1152,
            margin: "0 auto",
            padding: "100px 24px",
            textAlign: "center",
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              border: "1px solid rgba(245,158,11,0.3)",
              background: "rgba(245,158,11,0.08)",
              borderRadius: 999,
              padding: "6px 16px",
              marginBottom: 28,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#fbbf24",
                display: "inline-block",
                animation: "pulse 2s infinite",
              }}
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#fbbf24",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
              }}
            >
              Indian Army — Defence Operations Platform
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(36px, 6vw, 72px)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              margin: "0 0 24px",
            }}
          >
            Military Asset
            <br />
            <span style={{ color: "#fbbf24" }}>Management System</span>
          </h1>

          <p
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              color: "#94a3b8",
              maxWidth: 640,
              margin: "0 auto 40px",
              lineHeight: 1.7,
            }}
          >
            A secure, role-based platform for tracking weapons, vehicles and
            ammunition across Northern, Western, Southern commands and forward
            deployments. Built for accountability, transparency and operational
            speed.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              justifyContent: "center",
            }}
          >
            <button
              onClick={() => navigate("/login")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#f59e0b",
                color: "#0f172a",
                border: "none",
                borderRadius: 10,
                padding: "14px 28px",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(245,158,11,0.25)",
              }}
            >
              Access System <ArrowRight size={17} />
            </button>
            <a
              href="https://github.com/Wolfgang281/military-asset-management-system"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                border: "1px solid #334155",
                background: "#0f172a",
                borderRadius: 10,
                padding: "14px 28px",
                fontSize: 16,
                fontWeight: 600,
                color: "#cbd5e1",
                textDecoration: "none",
              }}
            >
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────────── */}
      <section
        style={{
          borderTop: "1px solid #1e293b",
          borderBottom: "1px solid #1e293b",
          background: "rgba(15,23,42,0.6)",
        }}
      >
        <div
          style={{
            maxWidth: 1152,
            margin: "0 auto",
            padding: "48px 24px",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 32,
            textAlign: "center",
          }}
        >
          {STATS.map((s) => (
            <div key={s.label}>
              <p
                style={{
                  fontSize: "clamp(36px, 4vw, 56px)",
                  fontWeight: 800,
                  color: "#fbbf24",
                  margin: "0 0 8px",
                }}
              >
                {s.value}
              </p>
              <p style={{ fontSize: 15, color: "#64748b", margin: 0 }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────── */}
      <section
        style={{ maxWidth: 1152, margin: "0 auto", padding: "96px 24px" }}
      >
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.3em",
              color: "#f59e0b",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Platform Capabilities
          </p>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 800,
              margin: "0 0 16px",
              color: "white",
            }}
          >
            Everything in one system
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "#94a3b8",
              maxWidth: 520,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            From procurement to expiry, every asset movement is tracked, logged
            and visible to the right people.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
        >
          {FEATURES.map((f) => (
            <div
              key={f.title}
              style={{
                borderRadius: 14,
                border: "1px solid #1e293b",
                background: "#0f172a",
                padding: 28,
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "#334155")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "#1e293b")
              }
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: "rgba(245,158,11,0.1)",
                  border: "1px solid rgba(245,158,11,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                <f.icon size={22} color="#fbbf24" />
              </div>
              <h3
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: "white",
                  marginBottom: 10,
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "#64748b",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TECH STACK ─────────────────────────────────────────── */}
      <section
        style={{
          borderTop: "1px solid #1e293b",
          background: "rgba(15,23,42,0.4)",
        }}
      >
        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "80px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.3em",
                color: "#f59e0b",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Tech Stack
            </p>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 800,
                color: "white",
                margin: 0,
              }}
            >
              Built with modern tooling
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
              maxWidth: 860,
              margin: "0 auto",
            }}
          >
            {STACK.map((s) => (
              <div
                key={s.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  borderRadius: 12,
                  border: "1px solid #1e293b",
                  background: "#0f172a",
                  padding: "18px 20px",
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#fbbf24",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <p
                    style={{
                      fontSize: 12,
                      color: "#64748b",
                      fontWeight: 600,
                      margin: "0 0 4px",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {s.label}
                  </p>
                  <p
                    style={{
                      fontSize: 15,
                      color: "#e2e8f0",
                      fontWeight: 600,
                      margin: 0,
                    }}
                  >
                    {s.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ──────────────────────────────────────────────── */}
      <section style={{ borderTop: "1px solid #1e293b" }}>
        <div
          style={{
            maxWidth: 800,
            margin: "0 auto",
            padding: "80px 24px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.3em",
              color: "#f59e0b",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            About
          </p>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 800,
              color: "white",
              marginBottom: 20,
            }}
          >
            Built by Utkarsh Gupta
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "#94a3b8",
              lineHeight: 1.8,
              marginBottom: 40,
            }}
          >
            MAMS is a take-home engineering project demonstrating a full-stack
            secure application with role-based access control, RESTful APIs,
            MongoDB aggregation pipelines and a responsive React frontend. The
            system models real-world military logistics workflows including
            procurement, inter-command transfers, personnel assignments and a
            complete audit trail of every transaction.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
            }}
          >
            <button
              onClick={() => navigate("/login")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#f59e0b",
                color: "#0f172a",
                border: "none",
                borderRadius: 10,
                padding: "14px 28px",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Access System <ArrowRight size={17} />
            </button>
            <a
              href="https://github.com/Wolfgang281/military-asset-management-system"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 15,
                color: "#64748b",
                textDecoration: "underline",
                textUnderlineOffset: 4,
              }}
            >
              github.com/Wolfgang281/MAMS
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid #1e293b", padding: "24px" }}>
        <div
          style={{
            maxWidth: 1152,
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 4,
                background: "rgba(245,158,11,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Shield size={12} color="#f59e0b" />
            </div>
            <span style={{ fontSize: 13, color: "#334155" }}>
              MAMS — Military Asset Management System
            </span>
          </div>
          <span style={{ fontSize: 13, color: "#334155" }}>
            © 2026 Utkarsh Gupta · All rights reserved
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Home;
