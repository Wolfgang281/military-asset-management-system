import { useState } from "react";

const fmt = (n) => {
  if (n === null || n === undefined) return "—";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return Number(n).toLocaleString();
};

const MetricCard = ({
  icon: Icon,
  label,
  value,
  sub,
  accent,
  onClick,
  badge,
  index = 0,
}) => {
  const [hovered, setHovered] = useState(false);
  const isClickable = !!onClick;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#0b1120",
        border: `1px solid ${hovered && isClickable ? accent + "55" : accent + "22"}`,
        borderRadius: 12,
        padding: "22px 24px",
        cursor: isClickable ? "pointer" : "default",
        transform:
          hovered && isClickable ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered && isClickable ? `0 12px 40px ${accent}14` : "none",
        transition: "all 0.2s ease",
        position: "relative",
        overflow: "hidden",
        animationDelay: `${index * 60}ms`,
      }}
    >
      {/* Top-right glow */}
      <div
        style={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: accent + "08",
          filter: "blur(30px)",
          pointerEvents: "none",
        }}
      />

      {/* Left accent bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 16,
          bottom: 16,
          width: 3,
          borderRadius: "0 3px 3px 0",
          background: accent + "70",
        }}
      />

      {/* Icon + badge row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 18,
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 9,
            background: accent + "12",
            border: `1px solid ${accent}25`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={17} color={accent} strokeWidth={2} />
        </div>

        {badge && (
          <span
            style={{
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: "0.15em",
              color: accent,
              background: accent + "12",
              border: `1px solid ${accent}25`,
              borderRadius: 99,
              padding: "3px 8px",
              textTransform: "uppercase",
            }}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Label */}
      <p
        style={{
          fontSize: 11,
          color: "#64748b",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          margin: "0 0 8px",
        }}
      >
        {label}
      </p>

      {/* Value */}
      <p
        style={{
          fontSize: 34,
          fontWeight: 800,
          color: "#f1f5f9",
          lineHeight: 1,
          margin: "0 0 8px",
          letterSpacing: "-0.02em",
        }}
      >
        {fmt(value)}
      </p>

      {/* Sub */}
      {sub && (
        <p
          style={{ fontSize: 12, color: "#475569", margin: 0, lineHeight: 1.5 }}
        >
          {sub}
        </p>
      )}
    </div>
  );
};

export default MetricCard;
