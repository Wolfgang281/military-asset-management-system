import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FilterBar from "../components/dashboard/FilterBar";
import MetricsGrid from "../components/dashboard/MetricsGrid";
import NetMovementModal from "../components/dashboard/NetMovementModal";
import TopBar from "../components/dashboard/TopBar";
import axiosInstance from "../lib/axios";

const Dashboard = () => {
  const { userData } = useSelector((state) => state.user);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [filters, setFilters] = useState({
    base:
      userData?.role === "base_commander" ? userData.assignedBase : "All Bases",
    category: "All Categories",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
  });

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filters.base && filters.base !== "All Bases")
        params.set("base", filters.base);
      if (filters.category && filters.category !== "All Categories")
        params.set("category", filters.category);
      if (filters.startDate) params.set("startDate", filters.startDate);
      if (filters.endDate) params.set("endDate", filters.endDate);

      const res = await axiosInstance.get(
        `/api/dashboard?${params.toString()}`,
      );
      setData(res.data.data);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to load dashboard data.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#06090f",
        color: "#f1f5f9",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Topbar */}
      <TopBar />

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 28px" }}>
        {/* ── Page heading ──────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 28,
          }}
        >
          <div>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.25em",
                color: "#f59e0b",
                textTransform: "uppercase",
                margin: "0 0 6px",
              }}
            >
              Operations Overview
            </p>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 800,
                margin: 0,
                letterSpacing: "-0.02em",
                color: "#f1f5f9",
              }}
            >
              Asset Dashboard
            </h1>
            {data?.appliedFilters && (
              <p style={{ fontSize: 12, color: "#374151", margin: "6px 0 0" }}>
                {data.appliedFilters.base} · {data.appliedFilters.category} ·{" "}
                {new Date(data.appliedFilters.startDate).toLocaleDateString(
                  "en-IN",
                  { day: "2-digit", month: "short", year: "numeric" },
                )}
                {" – "}
                {new Date(data.appliedFilters.endDate).toLocaleDateString(
                  "en-IN",
                  { day: "2-digit", month: "short", year: "numeric" },
                )}
              </p>
            )}
          </div>

          <button
            onClick={fetchDashboard}
            disabled={loading}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              background: "transparent",
              border: "1px solid #1f2937",
              borderRadius: 8,
              padding: "9px 16px",
              fontSize: 12,
              fontWeight: 600,
              color: "#64748b",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            <RefreshCw
              size={13}
              style={{
                animation: loading ? "spin 1s linear infinite" : "none",
              }}
            />
            Refresh
          </button>
        </div>

        {/* ── Filter bar ────────────────────────────────────── */}
        <FilterBar
          filters={filters}
          onChange={setFilters}
          onApply={fetchDashboard}
          loading={loading}
        />

        {/* ── Error ─────────────────────────────────────────── */}
        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: 10,
              padding: "12px 16px",
              marginBottom: 24,
            }}
          >
            <AlertCircle size={15} color="#ef4444" />
            <p style={{ fontSize: 13, color: "#ef4444", margin: 0 }}>{error}</p>
          </div>
        )}

        {/* ── Loading ───────────────────────────────────────── */}
        {loading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "100px 0",
              gap: 12,
            }}
          >
            <Loader2
              size={20}
              color="#f59e0b"
              style={{ animation: "spin 1s linear infinite" }}
            />
            <span
              style={{
                fontSize: 13,
                color: "#374151",
                letterSpacing: "0.05em",
              }}
            >
              Loading...
            </span>
          </div>
        )}

        {/* ── Metrics ───────────────────────────────────────── */}
        {!loading && data && (
          <MetricsGrid
            data={data}
            onNetMovementClick={() => setShowModal(true)}
          />
        )}
      </main>

      {/* ── Net Movement Modal ────────────────────────────── */}
      {showModal && data && (
        <NetMovementModal data={data} onClose={() => setShowModal(false)} />
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
