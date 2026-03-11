import { ArrowRight, RefreshCw } from "lucide-react";
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
  weapons: "bg-red-500/10    border-red-500/20    text-red-400",
  vehicles: "bg-blue-500/10   border-blue-500/20   text-blue-400",
  ammunition: "bg-amber-500/10  border-amber-500/20  text-amber-400",
  equipment: "bg-violet-500/10 border-violet-500/20 text-violet-400",
};

const STATUS_STYLE = {
  pending: {
    cls: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    label: "Pending",
  },
  in_transit: {
    cls: "bg-blue-500/10  border-blue-500/20  text-blue-400",
    label: "In Transit",
  },
  completed: {
    cls: "bg-green-500/10 border-green-500/20 text-green-400",
    label: "Completed",
  },
};

const StatusBadge = ({ status }) => {
  const s = STATUS_STYLE[status] ?? {
    cls: "bg-gray-500/10 border-gray-500/20 text-gray-400",
    label: status,
  };
  return (
    <span
      className={`text-[10px] font-bold tracking-wide border rounded px-2 py-0.5 whitespace-nowrap capitalize ${s.cls}`}
    >
      {s.label}
    </span>
  );
};

const CategoryBadge = ({ cat }) => (
  <span
    className={`text-[10px] font-bold tracking-wide uppercase border rounded px-2 py-0.5 whitespace-nowrap ${CAT_STYLE[cat] ?? "bg-gray-500/10 border-gray-500/20 text-gray-400"}`}
  >
    {cat}
  </span>
);

const NEXT_STATUS = { pending: "in_transit", in_transit: "completed" };
const NEXT_LABEL = { pending: "Mark In Transit", in_transit: "Mark Completed" };

/* ── Mobile card ─────────────────────────────────────────────────────────── */
const TransferCard = ({ t, canUpdateStatus, onStatusUpdate }) => (
  <div className="bg-[#0b1120] border border-gray-800 rounded-xl p-4 flex flex-col gap-3">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-bold text-slate-100 mb-1">
          {t.asset?.name ?? "—"}
        </p>
        <CategoryBadge cat={t.asset?.category} />
      </div>
      <div className="text-right shrink-0">
        <p className="text-2xl font-black text-blue-400 leading-none">
          {fmt(t.quantity)}
        </p>
        <p className="text-[11px] text-gray-500 mt-0.5">{t.asset?.unit}</p>
      </div>
    </div>

    {/* Route */}
    <div className="flex items-center gap-2 py-2.5 px-3 bg-[#06090f] rounded-lg border border-gray-800">
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">
          From
        </p>
        <p className="text-xs font-semibold text-slate-300 truncate">
          {t.fromBase?.split(" - ")[1] ?? t.fromBase}
        </p>
      </div>
      <ArrowRight size={14} className="text-gray-600 shrink-0" />
      <div className="flex-1 min-w-0 text-right">
        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">
          To
        </p>
        <p className="text-xs font-semibold text-slate-300 truncate">
          {t.toBase?.split(" - ")[1] ?? t.toBase}
        </p>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-800">
      {[
        { label: "Status", value: <StatusBadge status={t.status} /> },
        { label: "Date", value: fmtDate(t.transferDate) },
        { label: "Auth By", value: t.authorizedBy?.name ?? "—" },
        { label: "Role", value: t.authorizedBy?.role ?? "—", capitalize: true },
      ].map(({ label, value, capitalize }) => (
        <div key={label}>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">
            {label}
          </p>
          {typeof value === "string" ? (
            <p
              className={`text-xs text-gray-400 ${capitalize ? "capitalize" : ""}`}
            >
              {value}
            </p>
          ) : (
            value
          )}
        </div>
      ))}
    </div>

    {t.notes && (
      <p className="text-xs text-gray-500 pt-3 border-t border-gray-800">
        {t.notes}
      </p>
    )}

    {canUpdateStatus && NEXT_STATUS[t.status] && (
      <button
        onClick={() => onStatusUpdate(t._id, NEXT_STATUS[t.status])}
        className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg border border-blue-500/30 text-blue-400 text-xs font-semibold cursor-pointer hover:bg-blue-500/10 transition-all duration-150"
      >
        <RefreshCw size={12} /> {NEXT_LABEL[t.status]}
      </button>
    )}
  </div>
);

/* ── Main ────────────────────────────────────────────────────────────────── */
const TransferTable = ({ transfers, onStatusUpdate }) => {
  const { userData } = useSelector((s) => s.user);
  const canUpdateStatus = ["admin", "logistics"].includes(userData?.role);

  if (!transfers.length) {
    return (
      <p className="text-center py-20 text-gray-600 text-sm">
        No transfer records found
      </p>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block bg-[#0b1120] border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-800">
          <span className="text-xs text-gray-500 font-semibold">
            Showing <span className="text-slate-100">{transfers.length}</span>{" "}
            records
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[860px]">
            <thead className="bg-[#06090f]">
              <tr>
                {[
                  "Asset",
                  "Category",
                  "From",
                  "To",
                  "Qty",
                  "Status",
                  "Date",
                  "Auth By",
                  "Notes",
                  ...(canUpdateStatus ? ["Action"] : []),
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
              {transfers.map((t) => (
                <tr
                  key={t._id}
                  className="border-b border-[#0f172a] hover:bg-gray-900/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm align-middle">
                    <span className="font-bold text-slate-100">
                      {t.asset?.name ?? "—"}
                    </span>
                    {t.asset?.unit && (
                      <span className="text-[11px] text-gray-500 ml-1.5">
                        / {t.asset.unit}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <CategoryBadge cat={t.asset?.category} />
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 align-middle whitespace-nowrap">
                    {t.fromBase?.split(" - ")[1] ?? t.fromBase}
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center gap-1.5">
                      <ArrowRight
                        size={12}
                        className="text-gray-600 shrink-0"
                      />
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {t.toBase?.split(" - ")[1] ?? t.toBase}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right align-middle">
                    <span className="text-sm font-black text-blue-400">
                      {fmt(t.quantity)}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 align-middle whitespace-nowrap">
                    {fmtDate(t.transferDate)}
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <p className="text-xs text-gray-400">
                      {t.authorizedBy?.name ?? "—"}
                    </p>
                    <p className="text-[10px] text-gray-600 capitalize">
                      {t.authorizedBy?.role ?? ""}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 align-middle max-w-[140px] truncate">
                    {t.notes || "—"}
                  </td>
                  {canUpdateStatus && (
                    <td className="px-4 py-3 align-middle">
                      {NEXT_STATUS[t.status] ? (
                        <button
                          onClick={() =>
                            onStatusUpdate(t._id, NEXT_STATUS[t.status])
                          }
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-500/30 text-blue-400 text-[11px] font-semibold cursor-pointer hover:bg-blue-500/10 transition-all whitespace-nowrap"
                        >
                          <RefreshCw size={11} /> {NEXT_LABEL[t.status]}
                        </button>
                      ) : (
                        <span className="text-[11px] text-gray-700">—</span>
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
          Showing <span className="text-slate-100">{transfers.length}</span>{" "}
          records
        </p>
        {transfers.map((t) => (
          <TransferCard
            key={t._id}
            t={t}
            canUpdateStatus={canUpdateStatus}
            onStatusUpdate={onStatusUpdate}
          />
        ))}
      </div>
    </>
  );
};

export default TransferTable;
