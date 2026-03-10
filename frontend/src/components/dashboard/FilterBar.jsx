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

const inputStyle = {
  width: "100%",
  background: "#06090f",
  border: "1px solid #1f2937",
  borderRadius: 8,
  padding: "9px 12px",
  fontSize: 13,
  color: "#f1f5f9",
  outline: "none",
  boxSizing: "border-box",
  colorScheme: "dark",
};

const labelStyle = {
  display: "block",
  fontSize: 10,
  fontWeight: 700,
  color: "#4b5563",
  textTransform: "uppercase",
  letterSpacing: "0.12em",
  marginBottom: 6,
};

const SelectField = ({ label, value, onChange, options }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <div style={{ position: "relative" }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          ...inputStyle,
          paddingRight: 32,
          appearance: "none",
          cursor: "pointer",
        }}
      >
        {options.map((o) => (
          <option key={o} value={o} style={{ background: "#0b1120" }}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown
        size={13}
        color="#4b5563"
        style={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
        }}
      />
    </div>
  </div>
);

const FilterBar = ({ filters, onChange, onApply, loading }) => {
  const { userData } = useSelector((state) => state.user);
  const isCommander = userData?.role === "base_commander";

  const set = (key) => (val) => onChange({ ...filters, [key]: val });

  return (
    <div
      style={{
        background: "#0b1120",
        border: "1px solid #1f2937",
        borderRadius: 12,
        padding: "18px 24px",
        marginBottom: 28,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 16,
          paddingBottom: 14,
          borderBottom: "1px solid #1f2937",
        }}
      >
        <SlidersHorizontal size={14} color="#f59e0b" />
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.15em",
            color: "#4b5563",
            textTransform: "uppercase",
          }}
        >
          Filters
        </span>
        {/* Applied filters pills */}
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
          }}
        >
          {filters.base !== "All Bases" && (
            <span
              style={{
                fontSize: 10,
                background: "#6366f112",
                border: "1px solid #6366f125",
                color: "#818cf8",
                borderRadius: 99,
                padding: "2px 8px",
                fontWeight: 600,
              }}
            >
              {filters.base.split(" - ")[1] ?? filters.base}
            </span>
          )}
          {filters.category !== "All Categories" && (
            <span
              style={{
                fontSize: 10,
                background: "#f59e0b12",
                border: "1px solid #f59e0b25",
                color: "#fbbf24",
                borderRadius: 99,
                padding: "2px 8px",
                fontWeight: 600,
                textTransform: "capitalize",
              }}
            >
              {filters.category}
            </span>
          )}
        </div>
      </div>

      {/* Filter fields */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isCommander
            ? "1fr 1fr 1fr auto"
            : "1fr 1fr 1fr 1fr auto",
          gap: 14,
          alignItems: "end",
        }}
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

        <div>
          <label style={labelStyle}>Start Date</label>
          <input
            type="date"
            value={filters.startDate}
            max={filters.endDate || undefined}
            onChange={(e) => {
              const val = e.target.value;
              // if start goes past end, pull end forward to match
              if (filters.endDate && val > filters.endDate) {
                onChange({ ...filters, startDate: val, endDate: val });
              } else {
                set("startDate")(val);
              }
            }}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>End Date</label>
          <input
            type="date"
            value={filters.endDate}
            min={filters.startDate || undefined}
            onChange={(e) => {
              const val = e.target.value;
              // if end goes before start, push start back to match
              if (filters.startDate && val < filters.startDate) {
                onChange({ ...filters, startDate: val, endDate: val });
              } else {
                set("endDate")(val);
              }
            }}
            style={inputStyle}
          />
        </div>

        <button
          onClick={onApply}
          disabled={loading}
          style={{
            background: "#f59e0b",
            border: "none",
            borderRadius: 8,
            padding: "10px 22px",
            fontSize: 13,
            fontWeight: 700,
            color: "#0f172a",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            whiteSpace: "nowrap",
            letterSpacing: "0.03em",
          }}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
