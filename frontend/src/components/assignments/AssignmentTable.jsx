import { RotateCcw, Zap } from "lucide-react";
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
  active: {
    cls: "bg-green-500/10  border-green-500/20  text-green-400",
    label: "Active",
  },
  returned: {
    cls: "bg-blue-500/10   border-blue-500/20   text-blue-400",
    label: "Returned",
  },
  expended: {
    cls: "bg-orange-500/10 border-orange-500/20 text-orange-400",
    label: "Expended",
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

/* ── Mobile card ─────────────────────────────────────────────────────────── */
const AssignmentCard = ({ a, canAction, onExpend, onReturn }) => (
  <div className="bg-[#0b1120] border border-gray-800 rounded-xl p-4 flex flex-col gap-3">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-bold text-slate-100 mb-1">
          {a.asset?.name ?? "—"}
        </p>
        <CategoryBadge cat={a.asset?.category} />
      </div>
      <div className="text-right shrink-0">
        <p className="text-2xl font-black text-violet-400 leading-none">
          {fmt(a.quantity)}
        </p>
        <p className="text-[11px] text-gray-500 mt-0.5">{a.asset?.unit}</p>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-800">
      {[
        { label: "Personnel", value: a.personnelName },
        { label: "Service ID", value: a.personnelId, mono: true },
        { label: "Base", value: a.base?.split(" - ")[1] ?? a.base },
        { label: "Status", value: <StatusBadge status={a.status} /> },
        { label: "Assigned On", value: fmtDate(a.assignedDate) },
        { label: "Serial No", value: a.serialNumber || "—", mono: true },
      ].map(({ label, value, mono }) => (
        <div key={label}>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">
            {label}
          </p>
          {typeof value === "string" ? (
            <p className={`text-xs text-gray-400 ${mono ? "font-mono" : ""}`}>
              {value}
            </p>
          ) : (
            value
          )}
        </div>
      ))}
    </div>

    {a.notes && (
      <p className="text-xs text-gray-500 pt-3 border-t border-gray-800">
        {a.notes}
      </p>
    )}

    {canAction && a.status === "active" && (
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onExpend(a._id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-orange-500/30 text-orange-400 text-xs font-semibold cursor-pointer hover:bg-orange-500/10 transition-all"
        >
          <Zap size={12} /> Expend
        </button>
        <button
          onClick={() => onReturn(a._id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-blue-500/30 text-blue-400 text-xs font-semibold cursor-pointer hover:bg-blue-500/10 transition-all"
        >
          <RotateCcw size={12} /> Return
        </button>
      </div>
    )}
  </div>
);

/* ── Main ────────────────────────────────────────────────────────────────── */
const AssignmentTable = ({ assignments, onExpend, onReturn }) => {
  const { userData } = useSelector((s) => s.user);
  const canAction = ["admin", "base_commander"].includes(userData?.role);

  if (!assignments.length) {
    return (
      <p className="text-center py-20 text-gray-600 text-sm">
        No assignment records found
      </p>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block bg-[#0b1120] border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-800">
          <span className="text-xs text-gray-500 font-semibold">
            Showing <span className="text-slate-100">{assignments.length}</span>{" "}
            records
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[960px]">
            <thead className="bg-[#06090f]">
              <tr>
                {[
                  "Asset",
                  "Category",
                  "Personnel",
                  "Service ID",
                  "Base",
                  "Qty",
                  "Status",
                  "Assigned On",
                  "Serial No",
                  "Assigned By",
                  ...(canAction ? ["Actions"] : []),
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
              {assignments.map((a) => (
                <tr
                  key={a._id}
                  className="border-b border-[#0f172a] hover:bg-gray-900/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm align-middle">
                    <span className="font-bold text-slate-100">
                      {a.asset?.name ?? "—"}
                    </span>
                    {a.asset?.unit && (
                      <span className="text-[11px] text-gray-500 ml-1.5">
                        / {a.asset.unit}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <CategoryBadge cat={a.asset?.category} />
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-300 font-semibold align-middle">
                    {a.personnelName}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 font-mono align-middle">
                    {a.personnelId}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 align-middle whitespace-nowrap">
                    {a.base?.split(" - ")[1] ?? a.base}
                  </td>
                  <td className="px-4 py-3 text-right align-middle">
                    <span className="text-sm font-black text-violet-400">
                      {fmt(a.quantity)}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 align-middle whitespace-nowrap">
                    {fmtDate(a.assignedDate)}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 font-mono align-middle">
                    {a.serialNumber || "—"}
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <p className="text-xs text-gray-400">
                      {a.assignedBy?.name ?? "—"}
                    </p>
                    <p className="text-[10px] text-gray-600 capitalize">
                      {a.assignedBy?.role ?? ""}
                    </p>
                  </td>
                  {canAction && (
                    <td className="px-4 py-3 align-middle">
                      {a.status === "active" ? (
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => onExpend(a._id)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-orange-500/30 text-orange-400 text-[11px] font-semibold cursor-pointer hover:bg-orange-500/10 transition-all whitespace-nowrap"
                          >
                            <Zap size={11} /> Expend
                          </button>
                          <button
                            onClick={() => onReturn(a._id)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-blue-500/30 text-blue-400 text-[11px] font-semibold cursor-pointer hover:bg-blue-500/10 transition-all whitespace-nowrap"
                          >
                            <RotateCcw size={11} /> Return
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-gray-700 capitalize">
                          {a.status}
                        </span>
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
          Showing <span className="text-slate-100">{assignments.length}</span>{" "}
          records
        </p>
        {assignments.map((a) => (
          <AssignmentCard
            key={a._id}
            a={a}
            canAction={canAction}
            onExpend={onExpend}
            onReturn={onReturn}
          />
        ))}
      </div>
    </>
  );
};

export default AssignmentTable;
