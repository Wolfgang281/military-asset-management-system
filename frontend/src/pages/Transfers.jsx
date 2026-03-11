import {
  AlertCircle,
  ArrowLeftRight,
  Loader2,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TopBar from "../components/dashboard/TopBar";
import TransferFilters from "../components/transfers/TransferFilters";
import TransferForm from "../components/transfers/TransferForm";
import TransferTable from "../components/transfers/TransferTable";
import { toast } from "../components/ui/Toast";
import { TRANSFER_ROUTES } from "../constants/endpoints";
import axiosInstance from "../lib/axios";

const Transfers = () => {
  const { userData } = useSelector((s) => s.user);
  const canCreate = ["admin", "base_commander", "logistics"].includes(
    userData?.role,
  );
  const canUpdateStatus = ["admin", "logistics"].includes(userData?.role);

  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [filters, setFilters] = useState({
    base:
      userData?.role === "base_commander" ? userData.assignedBase : "All Bases",
    category: "All Categories",
    status: "All Statuses",
    startDate: "2025-01-01",
    endDate: new Date().toISOString().split("T")[0],
  });

  const fetchTransfers = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filters.base && filters.base !== "All Bases")
        params.set("base", filters.base);
      if (filters.category && filters.category !== "All Categories")
        params.set("category", filters.category);
      if (filters.status && filters.status !== "All Statuses")
        params.set("status", filters.status);
      if (filters.startDate) params.set("startDate", filters.startDate);
      if (filters.endDate) params.set("endDate", filters.endDate);
      const res = await axiosInstance.get(
        `${TRANSFER_ROUTES.GET}?${params.toString()}`,
      );
      setTransfers(res.data.data);
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to load transfers.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axiosInstance.patch(TRANSFER_ROUTES.UPDATE_STATUS(id), {
        status: newStatus,
      });
      const label = newStatus === "in_transit" ? "In Transit" : "Completed";
      toast.success(`Transfer marked as ${label}.`);
      fetchTransfers();
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to update status.";
      toast.error(msg);
    }
  };

  const handleSuccess = () => {
    toast.success("Transfer created successfully.");
    fetchTransfers();
  };

  return (
    <div className="min-h-screen bg-[#06090f] text-slate-100 font-mono">
      <TopBar />

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
          <div>
            <p className="text-[11px] font-bold tracking-[0.25em] text-amber-500 uppercase mb-1.5">
              Logistics
            </p>
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-2.5">
              <ArrowLeftRight size={22} className="text-blue-400" />
              Transfers
            </h1>
            <p className="text-xs text-gray-600 mt-1.5">
              {transfers.length} records · {filters.base} · {filters.status}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchTransfers}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-800 text-xs font-semibold text-gray-500 cursor-pointer hover:text-gray-300 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>

            {canCreate && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 text-white text-sm font-bold cursor-pointer transition-colors"
              >
                <Plus size={15} />
                New Transfer
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <TransferFilters
          filters={filters}
          onChange={setFilters}
          onApply={fetchTransfers}
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
            <span className="text-sm text-gray-600">Loading transfers...</span>
          </div>
        )}

        {/* Table */}
        {!loading && (
          <TransferTable
            transfers={transfers}
            onStatusUpdate={canUpdateStatus ? handleStatusUpdate : null}
          />
        )}
      </main>

      {showForm && (
        <TransferForm
          onClose={() => setShowForm(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default Transfers;
