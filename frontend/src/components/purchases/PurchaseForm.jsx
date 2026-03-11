import { AlertCircle, Loader2, Package, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ASSET_ROUTES, PURCHASE_ROUTES } from "../../constants/endpoints";
import axiosInstance from "../../lib/axios";

const BASES = [
  "Northern Command - Udhampur",
  "Western Command - Chandimandir",
  "Southern Command - Pune",
  "Forward Ops - Siachen",
];
const CATEGORIES = ["weapons", "vehicles", "ammunition", "equipment"];

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
      {label}
    </label>
    {children}
  </div>
);

const inputCls =
  "w-full bg-[#06090f] border border-gray-800 rounded-lg px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-amber-500/50 transition-colors [color-scheme:dark]";
const selectCls = `${inputCls} appearance-none cursor-pointer`;

const EMPTY = {
  asset: "",
  base: "",
  quantity: "",
  purchaseDate: new Date().toISOString().split("T")[0],
  supplierRef: "",
  notes: "",
};

const PurchaseForm = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState(EMPTY);
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
    if (!form.quantity || Number(form.quantity) < 1)
      return setError("Quantity must be at least 1.");
    if (!form.purchaseDate) return setError("Purchase date is required.");
    if (new Date(form.purchaseDate) > new Date())
      return setError("Purchase date cannot be in the future.");

    setLoading(true);
    try {
      await axiosInstance.post(PURCHASE_ROUTES.CREATE, {
        asset: form.asset,
        base: form.base,
        quantity: Number(form.quantity),
        purchaseDate: form.purchaseDate,
        supplierRef: form.supplierRef,
        notes: form.notes,
      });
      onSuccess(); // triggers toast.success in parent
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create purchase.");
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
            <div className="w-9 h-9 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <Package size={16} className="text-green-400" />
            </div>
            <div>
              <p className="text-base font-black text-slate-100">
                Record Purchase
              </p>
              <p className="text-xs text-gray-500">Add new asset procurement</p>
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

          <Field label="Base *">
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
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Quantity *">
              <input
                type="number"
                min={1}
                step={1}
                value={form.quantity}
                onChange={set("quantity")}
                placeholder="e.g. 100"
                className={inputCls}
              />
            </Field>
            <Field label="Purchase Date *">
              <input
                type="date"
                value={form.purchaseDate}
                max={new Date().toISOString().split("T")[0]}
                onChange={set("purchaseDate")}
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Supplier Reference">
            <input
              type="text"
              value={form.supplierRef}
              onChange={set("supplierRef")}
              placeholder="e.g. OFB-2025-099"
              maxLength={100}
              className={inputCls}
            />
          </Field>

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
            className="flex-[2] py-2.5 rounded-lg bg-green-500 hover:bg-green-400 disabled:opacity-60 text-slate-900 text-sm font-bold cursor-pointer transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {loading ? "Saving..." : "Record Purchase"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseForm;
