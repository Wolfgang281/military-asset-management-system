import { AlertCircle, Loader2, Plus, RefreshCw, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AssignmentFilters from "../components/assignments/AssignmentFilters";
import AssignmentForm from "../components/assignments/AssignmentForm";
import AssignmentTable from "../components/assignments/AssignmentTable";
import TopBar from "../components/dashboard/TopBar";
import { toast } from "../components/ui/Toast";
import { ASSIGNMENT_ROUTES } from "../constants/endpoints";
import axiosInstance from "../lib/axios";

const Assignments = () => {
  const { userData } = useSelector((s) => s.user);
  const canCreate = ["admin", "base_commander"].includes(userData?.role);
  const canAction = ["admin", "base_commander"].includes(userData?.role);

  const [assignments, setAssignments] = useState([]);
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

  const fetchAssignments = async () => {
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
        `${ASSIGNMENT_ROUTES.GET}?${params.toString()}`,
      );
      setAssignments(res.data.data);
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to load assignments.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleExpend = async (id) => {
    if (!window.confirm("Mark this asset as expended? This cannot be undone."))
      return;
    try {
      await axiosInstance.patch(ASSIGNMENT_ROUTES.EXPEND(id));
      toast.success("Asset marked as expended.");
      fetchAssignments();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to expend asset.");
    }
  };

  const handleReturn = async (id) => {
    if (!window.confirm("Mark this asset as returned?")) return;
    try {
      await axiosInstance.patch(ASSIGNMENT_ROUTES.RETURN(id));
      toast.success("Asset marked as returned.");
      fetchAssignments();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to return asset.");
    }
  };

  const handleSuccess = () => {
    toast.success("Assignment created successfully.");
    fetchAssignments();
  };

  // Summary counts
  const counts = assignments.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#06090f] text-slate-100 font-mono">
      <TopBar />

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
          <div>
            <p className="text-[11px] font-bold tracking-[0.25em] text-amber-500 uppercase mb-1.5">
              Personnel
            </p>
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-2.5">
              <UserCheck size={22} className="text-violet-400" />
              Assignments
            </h1>
            <p className="text-xs text-gray-600 mt-1.5">
              {assignments.length} records · {filters.base}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchAssignments}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-800 text-xs font-semibold text-gray-500 cursor-pointer hover:text-gray-300 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>

            {canCreate && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500 hover:bg-violet-400 text-white text-sm font-bold cursor-pointer transition-colors"
              >
                <Plus size={15} />
                New Assignment
              </button>
            )}
          </div>
        </div>

        {/* Summary pills */}
        {assignments.length > 0 && (
          <div className="flex flex-wrap gap-2.5 mb-6">
            {[
              {
                key: "active",
                label: "Active",
                cls: "bg-green-500/10  border-green-500/20  text-green-400",
              },
              {
                key: "returned",
                label: "Returned",
                cls: "bg-blue-500/10   border-blue-500/20   text-blue-400",
              },
              {
                key: "expended",
                label: "Expended",
                cls: "bg-orange-500/10 border-orange-500/20 text-orange-400",
              },
            ].map(({ key, label, cls }) =>
              counts[key] ? (
                <span
                  key={key}
                  className={`text-xs font-bold border rounded-full px-3 py-1 ${cls}`}
                >
                  {counts[key]} {label}
                </span>
              ) : null,
            )}
          </div>
        )}

        {/* Filters */}
        <AssignmentFilters
          filters={filters}
          onChange={setFilters}
          onApply={fetchAssignments}
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
            <span className="text-sm text-gray-600">
              Loading assignments...
            </span>
          </div>
        )}

        {/* Table */}
        {!loading && (
          <AssignmentTable
            assignments={assignments}
            onExpend={canAction ? handleExpend : null}
            onReturn={canAction ? handleReturn : null}
          />
        )}
      </main>

      {showForm && (
        <AssignmentForm
          onClose={() => setShowForm(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default Assignments;
