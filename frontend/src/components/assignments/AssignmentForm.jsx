import { AlertCircle, Loader2, UserCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ASSET_ROUTES, ASSIGNMENT_ROUTES } from "../../constants/endpoints";
import axiosInstance from "../../lib/axios";

const BASES = [
  "Northern Command - Udhampur",
  "Western Command - Chandimandir",
  "Southern Command - Pune",
  "Forward Ops - Siachen",
];
const CATEGORIES = ["weapons", "vehicles", "ammunition", "equipment"];

const inputCls =
  "w-full bg-[#06090f] border border-gray-800 rounded-lg px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-amber-500/50 transition-colors [color-scheme:dark]";
const selectCls = `${inputCls} appearance-none cursor-pointer`;

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
      {label}
    </label>
    {children}
  </div>
);

const EMPTY = {
  asset: "",
  base: "",
  personnelName: "",
  personnelId: "",
  serialNumber: "",
  quantity: "",
  assignedDate: new Date().toISOString().split("T")[0],
  notes: "",
};

const AssignmentForm = ({ onClose, onSuccess }) => {
  const { userData } = useSelector((s) => s.user);
  const isCommander = userData?.role === "base_commander";

  const [form, setForm] = useState({
    ...EMPTY,
    base: isCommander ? userData.assignedBase : "",
  });
  const [assets, setAssets] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axiosInstance
      .get(ASSET_ROUTES.GET_ALL)
      .then((r) => {
        setAssets(r.data.data);
        setFiltered(r.data.data);
      })
      .catch(() => setError("Failed to load assets."))
      .finally(() => setFetching(false));
  }, []);

  useEffect(() => {
    setFiltered(
      category ? assets.filter((a) => a.category === category) : assets,
    );
    setForm((f) => ({ ...f, asset: "" }));
  }, [category, assets]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async () => {
    setError("");
    if (!form.asset) return setError("Please select an asset.");
    if (!form.base) return setError("Please select a base.");
    if (!form.personnelName) return setError("Personnel name is required.");
    if (!form.personnelId) return setError("Service ID is required.");
    if (!form.quantity || Number(form.quantity) < 1)
      return setError("Quantity must be at least 1.");
    if (!form.assignedDate) return setError("Assignment date is required.");
    if (new Date(form.assignedDate) > new Date())
      return setError("Assignment date cannot be in the future.");

    setLoading(true);
    try {
      await axiosInstance.post(ASSIGNMENT_ROUTES.CREATE, {
        asset: form.asset,
        base: form.base,
        personnelName: form.personnelName,
        personnelId: form.personnelId,
        serialNumber: form.serialNumber || null,
        quantity: Number(form.quantity),
        assignedDate: form.assignedDate,
        notes: form.notes,
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create assignment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0b1120] border border-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <UserCheck size={16} className="text-violet-400" />
            </div>
            <div>
              <p className="text-base font-black text-slate-100">
                New Assignment
              </p>
              <p className="text-xs text-gray-500">Assign asset to personnel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center cursor-pointer hover:border-gray-600 transition-colors"
          >
            <X size={15} className="text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
          {error && (
            <div className="flex items-center gap-2 bg-red-500/8 border border-red-500/25 rounded-lg px-3 py-2.5">
              <AlertCircle size={14} className="text-red-400 shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Category filter */}
          <Field label="Filter by Category">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={selectCls}
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-[#0b1120] capitalize">
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </Field>

          {/* Asset */}
          <Field label="Asset *">
            {fetching ? (
              <div className="flex items-center gap-2 py-2">
                <Loader2 size={14} className="text-amber-500 animate-spin" />
                <span className="text-sm text-gray-500">Loading assets...</span>
              </div>
            ) : (
              <select
                value={form.asset}
                onChange={set("asset")}
                className={selectCls}
              >
                <option value="">Select asset...</option>
                {filtered.map((a) => (
                  <option key={a._id} value={a._id} className="bg-[#0b1120]">
                    {a.name} ({a.unit})
                  </option>
                ))}
              </select>
            )}
          </Field>

          {/* Base */}
          <Field label="Base *">
            {isCommander ? (
              <div className={`${inputCls} text-gray-500 cursor-not-allowed`}>
                {userData.assignedBase}
              </div>
            ) : (
              <select
                value={form.base}
                onChange={set("base")}
                className={selectCls}
              >
                <option value="">Select base...</option>
                {BASES.map((b) => (
                  <option key={b} value={b} className="bg-[#0b1120]">
                    {b}
                  </option>
                ))}
              </select>
            )}
          </Field>

          {/* Personnel */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Personnel Name *">
              <input
                type="text"
                value={form.personnelName}
                onChange={set("personnelName")}
                placeholder="e.g. Maj. Arjun Singh"
                maxLength={100}
                className={inputCls}
              />
            </Field>
            <Field label="Service ID *">
              <input
                type="text"
                value={form.personnelId}
                onChange={set("personnelId")}
                placeholder="e.g. IC-12345"
                maxLength={50}
                className={inputCls}
              />
            </Field>
          </div>

          {/* Quantity + Serial */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Quantity *">
              <input
                type="number"
                min={1}
                step={1}
                value={form.quantity}
                onChange={set("quantity")}
                placeholder="e.g. 1"
                className={inputCls}
              />
            </Field>
            <Field label="Serial Number">
              <input
                type="text"
                value={form.serialNumber}
                onChange={set("serialNumber")}
                placeholder="e.g. SN-2025-001"
                maxLength={100}
                className={inputCls}
              />
            </Field>
          </div>

          {/* Date */}
          <Field label="Assignment Date *">
            <input
              type="date"
              value={form.assignedDate}
              max={new Date().toISOString().split("T")[0]}
              onChange={set("assignedDate")}
              className={inputCls}
            />
          </Field>

          {/* Notes */}
          <Field label="Notes">
            <textarea
              value={form.notes}
              onChange={set("notes")}
              placeholder="Optional notes..."
              maxLength={500}
              rows={3}
              className={`${inputCls} resize-y min-h-[76px] leading-relaxed`}
            />
          </Field>
        </div>

        {/* Footer */}
        <div className="flex gap-2.5 px-6 py-4 border-t border-gray-800 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-gray-800 text-sm font-semibold text-gray-500 cursor-pointer hover:text-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-[2] py-2.5 rounded-lg bg-violet-500 hover:bg-violet-400 disabled:opacity-60 text-white text-sm font-bold cursor-pointer transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {loading ? "Assigning..." : "Create Assignment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentForm;
