import { Trash2 } from "lucide-react";
import { useSelector } from "react-redux";

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";
const fmt = (n) => (n == null ? "—" : Number(n).toLocaleString());

const CAT_STYLE = {
  weapons: "bg-red-500/10 border-red-500/20 text-red-400",
  vehicles: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  ammunition: "bg-amber-500/10 border-amber-500/20 text-amber-400",
  equipment: "bg-violet-500/10 border-violet-500/20 text-violet-400",
};

const CategoryBadge = ({ cat }) => (
  <span
    className={`text-[10px] font-bold tracking-wide uppercase border rounded px-2 py-0.5 whitespace-nowrap ${CAT_STYLE[cat] ?? "bg-gray-500/10 border-gray-500/20 text-gray-400"}`}
  >
    {cat}
  </span>
);

/* ── Mobile card ─────────────────────────────────────────────────────────── */
const PurchaseCard = ({ p, onDelete, isAdmin }) => (
  <div className="bg-[#0b1120] border border-gray-800 rounded-xl p-4 flex flex-col gap-3">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-bold text-slate-100 mb-1">
          {p.asset?.name ?? "—"}
        </p>
        <CategoryBadge cat={p.asset?.category} />
      </div>
      <div className="text-right shrink-0">
        <p className="text-2xl font-black text-green-400 leading-none">
          {fmt(p.quantity)}
        </p>
        <p className="text-[11px] text-gray-500 mt-0.5">{p.asset?.unit}</p>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-800">
      {[
        { label: "Base", value: p.base?.split(" - ")[1] ?? p.base },
        { label: "Date", value: fmtDate(p.purchaseDate) },
        { label: "Supplier Ref", value: p.supplierRef || "—", mono: true },
        { label: "Recorded By", value: p.createdBy?.name ?? "—" },
      ].map(({ label, value, mono }) => (
        <div key={label}>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">
            {label}
          </p>
          <p className={`text-xs text-gray-400 ${mono ? "font-mono" : ""}`}>
            {value}
          </p>
        </div>
      ))}
    </div>

    {p.notes && (
      <p className="text-xs text-gray-500 pt-3 border-t border-gray-800">
        {p.notes}
      </p>
    )}

    {isAdmin && onDelete && (
      <button
        onClick={() => onDelete(p._id)}
        className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg border border-gray-800 text-red-400 text-xs font-semibold cursor-pointer hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-150"
      >
        <Trash2 size={13} /> Delete
      </button>
    )}
  </div>
);

/* ── Main ────────────────────────────────────────────────────────────────── */
const PurchaseTable = ({ purchases, onDelete }) => {
  const { userData } = useSelector((s) => s.user);
  const isAdmin = userData?.role === "admin";

  if (!purchases.length) {
    return (
      <p className="text-center py-20 text-gray-600 text-sm">
        No purchase records found
      </p>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block bg-[#0b1120] border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-800">
          <span className="text-xs text-gray-500 font-semibold">
            Showing <span className="text-slate-100">{purchases.length}</span>{" "}
            records
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[780px]">
            <thead className="bg-[#06090f]">
              <tr>
                {[
                  "Asset",
                  "Category",
                  "Base",
                  "Qty",
                  "Date",
                  "Supplier Ref",
                  "Recorded By",
                  "Notes",
                  ...(isAdmin ? ["Action"] : []),
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest px-4 py-2.5 border-b border-gray-800 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {purchases.map((p) => (
                <tr
                  key={p._id}
                  className="border-b border-[#0f172a] hover:bg-gray-900/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm align-middle">
                    <span className="font-bold text-slate-100">
                      {p.asset?.name ?? "—"}
                    </span>
                    {p.asset?.unit && (
                      <span className="text-[11px] text-gray-500 ml-1.5">
                        / {p.asset.unit}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <CategoryBadge cat={p.asset?.category} />
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 align-middle whitespace-nowrap">
                    {p.base?.split(" - ")[1] ?? p.base}
                  </td>
                  <td className="px-4 py-3 text-right align-middle">
                    <span className="text-sm font-black text-green-400">
                      {fmt(p.quantity)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 align-middle whitespace-nowrap">
                    {fmtDate(p.purchaseDate)}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 font-mono align-middle">
                    {p.supplierRef || "—"}
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <p className="text-xs text-gray-400">
                      {p.createdBy?.name ?? "—"}
                    </p>
                    <p className="text-[10px] text-gray-600 capitalize">
                      {p.createdBy?.role ?? ""}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 align-middle max-w-[160px] truncate">
                    {p.notes || "—"}
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-3 align-middle">
                      {onDelete && (
                        <button
                          onClick={() => onDelete(p._id)}
                          className="w-8 h-8 rounded-lg border border-gray-800 flex items-center justify-center cursor-pointer hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-150"
                        >
                          <Trash2 size={13} className="text-red-400" />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden flex flex-col gap-3">
        <p className="text-xs text-gray-500 font-semibold">
          Showing <span className="text-slate-100">{purchases.length}</span>{" "}
          records
        </p>
        {purchases.map((p) => (
          <PurchaseCard
            key={p._id}
            p={p}
            onDelete={onDelete}
            isAdmin={isAdmin}
          />
        ))}
      </div>
    </>
  );
};

export default PurchaseTable;
