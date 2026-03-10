import { LogOut, Shield } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../lib/axios";
import { clearUser } from "../../redux/slices/userSlice";

const ROLE_COLOR = {
  admin: "#ef4444",
  base_commander: "#3b82f6",
  logistics: "#22c55e",
};

const ROLE_LABEL = {
  admin: "Admin",
  base_commander: "Base Commander",
  logistics: "Logistics Officer",
};

const TopBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/auth/logout");
    } catch {
      // clear regardless
    }
    dispatch(clearUser());
    navigate("/login");
  };

  const roleColor = ROLE_COLOR[userData?.role] ?? "#94a3b8";
  const roleLabel = ROLE_LABEL[userData?.role] ?? userData?.role;

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        height: 60,
        borderBottom: "1px solid #1f2937",
        background: "#06090f",
        padding: "0 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* ── Left: Logo ─────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 32,
            height: 32,
            background: "#f59e0b",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Shield size={16} color="#0f172a" fill="#0f172a" />
        </div>
        <div>
          <span
            style={{
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: "0.15em",
              color: "#f1f5f9",
            }}
          >
            MAMS
          </span>
          <span
            style={{
              marginLeft: 10,
              fontSize: 12,
              color: "#374151",
              letterSpacing: "0.05em",
            }}
          >
            Military Asset Management
          </span>
        </div>
      </div>

      {/* ── Right: User + logout ────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {/* Status dot */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#22c55e",
              display: "inline-block",
              boxShadow: "0 0 6px #22c55e88",
            }}
          />
          <span
            style={{ fontSize: 11, color: "#374151", letterSpacing: "0.08em" }}
          >
            SECURE
          </span>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 28, background: "#1f2937" }} />

        {/* User info */}
        <div style={{ textAlign: "right" }}>
          <p
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#f1f5f9",
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            {userData?.name}
          </p>
          <p style={{ fontSize: 11, margin: 0, lineHeight: 1.3 }}>
            <span style={{ color: roleColor, fontWeight: 600 }}>
              {roleLabel}
            </span>
            {userData?.assignedBase && (
              <span style={{ color: "#374151" }}>
                {" "}
                · {userData.assignedBase.split(" - ")[1]}
              </span>
            )}
          </p>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "transparent",
            border: "1px solid #1f2937",
            borderRadius: 8,
            padding: "7px 13px",
            fontSize: 12,
            fontWeight: 600,
            color: "#64748b",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#ef444455";
            e.currentTarget.style.color = "#ef4444";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#1f2937";
            e.currentTarget.style.color = "#64748b";
          }}
        >
          <LogOut size={13} />
          Logout
        </button>
      </div>
    </header>
  );
};

export default TopBar;
