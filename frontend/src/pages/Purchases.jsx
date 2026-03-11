import {
  AlertCircle,
  Loader2,
  Plus,
  RefreshCw,
  ShoppingCart,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TopBar from "../components/dashboard/TopBar";
import PurchaseFilters from "../components/purchases/PurchaseFilters";
import PurchaseForm from "../components/purchases/PurchaseForm";
import PurchaseTable from "../components/purchases/PurchaseTable";
import { toast } from "../components/ui/Toast";
import { PURCHASE_ROUTES } from "../constants/endpoints";
import axiosInstance from "../lib/axios";

const Purchases = () => {
  const { userData } = useSelector((s) => s.user);
  const canCreate = ["admin", "logistics"].includes(userData?.role);
  const canDelete = userData?.role === "admin";

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [filters, setFilters] = useState({
    base:
      userData?.role === "base_commander" ? userData.assignedBase : "All Bases",
    category: "All Categories",
    startDate: "2025-01-01",
    endDate: new Date().toISOString().split("T")[0],
  });

  const fetchPurchases = async () => {
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
        `${PURCHASE_ROUTES.GET}?${params.toString()}`,
      );
      setPurchases(res.data.data);
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to load purchases.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this purchase record? This cannot be undone."))
      return;
    try {
      await axiosInstance.delete(PURCHASE_ROUTES.DELETE(id));
      setPurchases((prev) => prev.filter((p) => p._id !== id));
      toast.success("Purchase record deleted.");
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to delete purchase.";
      setError(msg);
      toast.error(msg);
    }
  };

  const handleSuccess = () => {
    toast.success("Purchase recorded successfully.");
    fetchPurchases();
  };

  return (
    <div className="min-h-screen bg-[#06090f] text-slate-100 font-mono">
      <TopBar />

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
          <div>
            <p className="text-[11px] font-bold tracking-[0.25em] text-amber-500 uppercase mb-1.5">
              Procurement
            </p>
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-2.5">
              <ShoppingCart size={22} className="text-green-400" />
              Purchases
            </h1>
            <p className="text-xs text-gray-600 mt-1.5">
              {purchases.length} records · {filters.base} · {filters.category}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchPurchases}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-800 text-xs font-semibold text-gray-500 cursor-pointer hover:text-gray-300 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>

            {canCreate && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-400 text-slate-900 text-sm font-bold cursor-pointer transition-colors"
              >
                <Plus size={15} />
                New Purchase
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <PurchaseFilters
          filters={filters}
          onChange={setFilters}
          onApply={fetchPurchases}
          loading={loading}
        />

        {/* Inline error (keeps UI context, toast is also shown) */}
        {error && (
          <div className="flex items-center gap-2.5 bg-red-500/8 border border-red-500/25 rounded-xl px-4 py-3 mb-6">
            <AlertCircle size={15} className="text-red-400 shrink-0" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center gap-3 py-24">
            <Loader2 size={20} className="text-amber-500 animate-spin" />
            <span className="text-sm text-gray-600">Loading purchases...</span>
          </div>
        )}

        {!loading && (
          <PurchaseTable
            purchases={purchases}
            onDelete={canDelete ? handleDelete : null}
          />
        )}
      </main>

      {showForm && (
        <PurchaseForm
          onClose={() => setShowForm(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default Purchases;
