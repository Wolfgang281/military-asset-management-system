import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { useSelector } from "react-redux";

const BASES = [
  "All Bases",
  "Northern Command - Udhampur",
  "Western Command - Chandimandir",
  "Southern Command - Pune",
  "Forward Ops - Siachen",
];
const CATEGORIES = [
  "All Categories",
  "weapons",
  "vehicles",
  "ammunition",
  "equipment",
];
const STATUSES = ["All Statuses", "active", "returned", "expended"];

const STATUS_STYLE = {
  active: "bg-green-500/10  border-green-500/20  text-green-400",
  returned: "bg-blue-500/10   border-blue-500/20   text-blue-400",
  expended: "bg-orange-500/10 border-orange-500/20 text-orange-400",
};

const selectCls =
  "w-full bg-[#06090f] border border-gray-800 rounded-lg px-3 py-2.5 text-sm text-slate-100 outline-none appearance-none cursor-pointer [color-scheme:dark]";

const SelectField = ({ label, value, onChange, options }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
      {label}
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={selectCls}
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-[#0b1120] capitalize">
            {o}
          </option>
        ))}
      </select>
      <ChevronDown
        size={13}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
      />
    </div>
  </div>
);

const AssignmentFilters = ({ filters, onChange, onApply, loading }) => {
  const { userData } = useSelector((s) => s.user);
  const isCommander = userData?.role === "base_commander";
  const set = (key) => (val) => onChange({ ...filters, [key]: val });

  return (
    <div className="bg-[#0b1120] border border-gray-800 rounded-xl p-5 mb-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-3.5 border-b border-gray-800">
        <SlidersHorizontal size={14} className="text-amber-500" />
        <span className="text-[11px] font-bold tracking-widest text-gray-500 uppercase">
          Filters
        </span>
        <div className="ml-auto flex gap-2 flex-wrap">
          {filters.status !== "All Statuses" && (
            <span
              className={`text-[10px] border rounded-full px-2 py-0.5 font-semibold capitalize ${STATUS_STYLE[filters.status] ?? "bg-gray-500/10 border-gray-500/20 text-gray-400"}`}
            >
              {filters.status}
            </span>
          )}
          {filters.base !== "All Bases" && (
            <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full px-2 py-0.5 font-semibold">
              {filters.base.split(" - ")[1] ?? filters.base}
            </span>
          )}
          {filters.category !== "All Categories" && (
            <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full px-2 py-0.5 font-semibold capitalize">
              {filters.category}
            </span>
          )}
        </div>
      </div>

      {/* Fields */}
      <div
        className={`grid gap-3 items-end grid-cols-1 sm:grid-cols-2 ${isCommander ? "lg:grid-cols-4" : "lg:grid-cols-6"}`}
      >
        {!isCommander && (
          <SelectField
            label="Base"
            value={filters.base}
            onChange={set("base")}
            options={BASES}
          />
        )}
        <SelectField
          label="Equipment Type"
          value={filters.category}
          onChange={set("category")}
          options={CATEGORIES}
        />
        <SelectField
          label="Status"
          value={filters.status}
          onChange={set("status")}
          options={STATUSES}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            Start Date
          </label>
          <input
            type="date"
            value={filters.startDate}
            max={filters.endDate || undefined}
            onChange={(e) => {
              const val = e.target.value;
              if (filters.endDate && val > filters.endDate)
                onChange({ ...filters, startDate: val, endDate: val });
              else set("startDate")(val);
            }}
            className="w-full bg-[#06090f] border border-gray-800 rounded-lg px-3 py-2.5 text-sm text-slate-100 outline-none [color-scheme:dark]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            End Date
          </label>
          <input
            type="date"
            value={filters.endDate}
            min={filters.startDate || undefined}
            onChange={(e) => {
              const val = e.target.value;
              if (filters.startDate && val < filters.startDate)
                onChange({ ...filters, startDate: val, endDate: val });
              else set("endDate")(val);
            }}
            className="w-full bg-[#06090f] border border-gray-800 rounded-lg px-3 py-2.5 text-sm text-slate-100 outline-none [color-scheme:dark]"
          />
        </div>

        <button
          onClick={onApply}
          disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-900 font-bold text-sm rounded-lg py-2.5 cursor-pointer transition-colors sm:col-span-2 lg:col-span-1"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default AssignmentFilters;
