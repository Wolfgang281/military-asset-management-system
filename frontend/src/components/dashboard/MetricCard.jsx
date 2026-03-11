/* eslint-disable no-unused-vars */
import { useState } from "react";

const fmt = (n) => {
  if (n === null || n === undefined) return "—";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return Number(n).toLocaleString();
};

const MetricCard = ({
  label,
  value,
  sub,
  accent,
  onClick,
  badge,
  icon: Icon,
}) => {
  const [hovered, setHovered] = useState(false);
  const isClickable = !!onClick;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative overflow-hidden bg-[#0b1120] rounded-xl p-5 transition-all duration-200 ${isClickable ? "cursor-pointer" : ""}`}
      style={{
        border: `1px solid ${hovered && isClickable ? accent + "55" : accent + "22"}`,
        transform:
          hovered && isClickable ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered && isClickable ? `0 12px 40px ${accent}14` : "none",
      }}
    >
      {/* Top-right glow */}
      <div
        className="absolute -top-5 -right-5 w-24 h-24 rounded-full pointer-events-none"
        style={{ background: accent + "08", filter: "blur(30px)" }}
      />

      {/* Left accent bar */}
      <div
        className="absolute left-0 top-4 bottom-4 w-0.5 rounded-r"
        style={{ background: accent + "70" }}
      />

      {/* Icon + badge */}
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: accent + "12", border: `1px solid ${accent}25` }}
        >
          <Icon size={17} color={accent} strokeWidth={2} />
        </div>
        {badge && (
          <span
            className="text-[9px] font-black tracking-widest uppercase rounded-full px-2 py-0.5"
            style={{
              color: accent,
              background: accent + "12",
              border: `1px solid ${accent}25`,
            }}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Label */}
      <p className="text-[10px] font-bold tracking-widest uppercase mb-2 text-slate-500">
        {label}
      </p>

      {/* Value */}
      <p className="text-3xl font-black text-slate-100 leading-none mb-2 tracking-tight">
        {fmt(value)}
      </p>

      {/* Sub */}
      {sub && <p className="text-xs text-slate-600 leading-relaxed">{sub}</p>}
    </div>
  );
};

export default MetricCard;
