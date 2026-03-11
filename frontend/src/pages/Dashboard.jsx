import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FilterBar from "../components/dashboard/FilterBar";
import MetricsGrid from "../components/dashboard/MetricsGrid";
import NetMovementModal from "../components/dashboard/NetMovementModal";
import TopBar from "../components/dashboard/TopBar";
import axiosInstance from "../lib/axios";

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const Dashboard = () => {
  const { userData } = useSelector((s) => s.user);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [filters, setFilters] = useState({
    base:
      userData?.role === "base_commander" ? userData.assignedBase : "All Bases",
    category: "All Categories",
    startDate: "2025-01-01",
    endDate: new Date().toISOString().split("T")[0],
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
    <div className="min-h-screen bg-[#06090f] text-slate-100 font-mono">
      <TopBar />

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
          <div>
            <p className="text-[11px] font-bold tracking-[0.25em] text-amber-500 uppercase mb-1.5">
              Operations Overview
            </p>
            <h1 className="text-2xl font-black tracking-tight">
              Asset Dashboard
            </h1>
            {data?.appliedFilters && (
              <p className="text-xs text-gray-600 mt-1.5">
                {data.appliedFilters.base} · {data.appliedFilters.category} ·{" "}
                {fmtDate(data.appliedFilters.startDate)} –{" "}
                {fmtDate(data.appliedFilters.endDate)}
              </p>
            )}
          </div>

          <button
            onClick={fetchDashboard}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-800 text-xs font-semibold text-gray-500 cursor-pointer hover:text-gray-300 transition-colors disabled:opacity-50 self-start sm:self-auto"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <FilterBar
          filters={filters}
          onChange={setFilters}
          onApply={fetchDashboard}
          loading={loading}
        />

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2.5 bg-red-500/8 border border-red-500/25 rounded-xl px-4 py-3 mb-6">
            <AlertCircle size={15} className="text-red-400 shrink-0" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center gap-3 py-24">
            <Loader2 size={20} className="text-amber-500 animate-spin" />
            <span className="text-sm text-gray-600 tracking-wide">
              Loading...
            </span>
          </div>
        )}

        {/* Metrics */}
        {!loading && data && (
          <MetricsGrid
            data={data}
            onNetMovementClick={() => setShowModal(true)}
          />
        )}
      </main>

      {showModal && data && (
        <NetMovementModal data={data} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default Dashboard;
