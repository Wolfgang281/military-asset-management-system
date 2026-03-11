import { X } from "lucide-react";
import { useState } from "react";

const fmt = (n) => {
  if (n === null || n === undefined) return "—";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return Number(n).toLocaleString();
};

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const TABS = [
  { key: "purchases", label: "Purchases", color: "#22c55e" },
  { key: "transfersIn", label: "Transfers In", color: "#3b82f6" },
  { key: "transfersOut", label: "Transfers Out", color: "#ef4444" },
];

const NetMovementModal = ({ data, onClose }) => {
  const [activeTab, setActiveTab] = useState("purchases");
  const tab = TABS.find((t) => t.key === activeTab);
  const records = data?.breakdown?.[activeTab] ?? [];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0b1120] border border-gray-800 rounded-2xl w-full max-w-3xl max-h-[82vh] flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800 shrink-0">
          <div>
            <p className="text-lg font-black text-slate-100">
              Net Movement Breakdown
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Purchases + Transfers In − Transfers Out ={" "}
              <span className="text-amber-400 font-bold">
                {fmt(data?.netMovement)}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center cursor-pointer hover:border-gray-600 transition-colors"
          >
            <X size={15} className="text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-0.5 px-6 border-b border-gray-800 shrink-0 overflow-x-auto">
          {TABS.map((t) => {
            const count = (data?.breakdown?.[t.key] ?? []).length;
            const isActive = activeTab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className="flex items-center gap-2 px-4 py-3.5 text-sm font-semibold cursor-pointer transition-all whitespace-nowrap border-b-2"
                style={{
                  color: isActive ? t.color : "#4b5563",
                  borderBottomColor: isActive ? t.color : "transparent",
                  background: "transparent",
                  border: "none",
                  borderBottom: isActive
                    ? `2px solid ${t.color}`
                    : "2px solid transparent",
                }}
              >
                {t.label}
                <span
                  className="text-[10px] font-bold rounded-full px-1.5 py-0.5"
                  style={{
                    background: isActive ? t.color + "18" : "#1f2937",
                    color: isActive ? t.color : "#4b5563",
                    border: `1px solid ${isActive ? t.color + "30" : "#374151"}`,
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto px-6 pb-6">
          {records.length === 0 ? (
            <p className="text-center py-14 text-gray-600 text-sm">
              No records for this period
            </p>
          ) : (
            <table className="w-full border-collapse mt-1 min-w-[520px]">
              <thead className="sticky top-0 bg-[#0b1120] z-10">
                <tr>
                  {[
                    "Asset",
                    "Category",
                    activeTab === "purchases" ? "Base" : "Route",
                    "Qty",
                    "Date",
                    ...(activeTab === "purchases" ? ["Supplier Ref"] : []),
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3.5 py-2.5 border-b border-gray-800 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => (
                  <tr
                    key={i}
                    className="border-b border-[#0f172a] hover:bg-gray-900/50 transition-colors"
                  >
                    <td className="px-3.5 py-2.5 text-sm font-semibold text-slate-100">
                      {r.asset}
                    </td>
                    <td className="px-3.5 py-2.5">
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-800 rounded px-2 py-0.5 capitalize tracking-wide">
                        {r.category}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 text-xs text-gray-500 max-w-[200px]">
                      {activeTab === "purchases"
                        ? r.base
                        : `${r.fromBase?.split(" - ")[1] ?? r.fromBase} → ${r.toBase?.split(" - ")[1] ?? r.toBase}`}
                    </td>
                    <td
                      className="px-3.5 py-2.5 text-sm font-black whitespace-nowrap"
                      style={{ color: tab.color }}
                    >
                      {fmt(r.quantity)}
                    </td>
                    <td className="px-3.5 py-2.5 text-xs text-gray-500 whitespace-nowrap">
                      {fmtDate(r.purchaseDate || r.transferDate)}
                    </td>
                    {activeTab === "purchases" && (
                      <td className="px-3.5 py-2.5 text-xs text-gray-600 font-mono">
                        {r.supplierRef ?? "—"}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetMovementModal;
