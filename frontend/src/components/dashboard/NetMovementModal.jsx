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

const TH = ({ children }) => (
  <th
    style={{
      textAlign: "left",
      fontSize: 10,
      fontWeight: 700,
      color: "#4b5563",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      padding: "10px 14px",
      borderBottom: "1px solid #1f2937",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </th>
);

const NetMovementModal = ({ data, onClose }) => {
  const [activeTab, setActiveTab] = useState("purchases");

  const tab = TABS.find((t) => t.key === activeTab);
  const records = data?.breakdown?.[activeTab] ?? [];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(6px)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0b1120",
          border: "1px solid #1f2937",
          borderRadius: 16,
          width: "100%",
          maxWidth: 820,
          maxHeight: "82vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* ── Modal header ──────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px",
            borderBottom: "1px solid #1f2937",
            flexShrink: 0,
          }}
        >
          <div>
            <p
              style={{
                fontSize: 17,
                fontWeight: 800,
                color: "#f1f5f9",
                margin: 0,
              }}
            >
              Net Movement Breakdown
            </p>
            <p style={{ fontSize: 13, color: "#4b5563", margin: "5px 0 0" }}>
              Purchases + Transfers In − Transfers Out ={" "}
              <span style={{ color: "#f59e0b", fontWeight: 700 }}>
                {fmt(data?.netMovement)}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "#111827",
              border: "1px solid #1f2937",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={15} color="#64748b" />
          </button>
        </div>

        {/* ── Tabs ──────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            gap: 2,
            padding: "0 24px",
            borderBottom: "1px solid #1f2937",
            flexShrink: 0,
          }}
        >
          {TABS.map((t) => {
            const count = (data?.breakdown?.[t.key] ?? []).length;
            const isActive = activeTab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                style={{
                  padding: "13px 18px",
                  fontSize: 13,
                  fontWeight: 600,
                  border: "none",
                  borderBottom: isActive
                    ? `2px solid ${t.color}`
                    : "2px solid transparent",
                  background: "transparent",
                  color: isActive ? t.color : "#4b5563",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                {t.label}
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    background: isActive ? t.color + "18" : "#1f2937",
                    color: isActive ? t.color : "#4b5563",
                    border: `1px solid ${isActive ? t.color + "30" : "#374151"}`,
                    borderRadius: 99,
                    padding: "1px 7px",
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Table ─────────────────────────────────────────── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 24px 24px" }}>
          {records.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "56px 0",
                color: "#374151",
                fontSize: 14,
              }}
            >
              No records for this period
            </div>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: 4,
              }}
            >
              <thead
                style={{
                  position: "sticky",
                  top: 0,
                  background: "#0b1120",
                  zIndex: 1,
                }}
              >
                <tr>
                  <TH>Asset</TH>
                  <TH>Category</TH>
                  <TH>{activeTab === "purchases" ? "Base" : "Route"}</TH>
                  <TH>Qty</TH>
                  <TH>Date</TH>
                  {activeTab === "purchases" && <TH>Supplier Ref</TH>}
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => (
                  <tr
                    key={i}
                    style={{ borderBottom: "1px solid #0f172a" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#111827")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td
                      style={{
                        padding: "11px 14px",
                        fontSize: 13,
                        color: "#f1f5f9",
                        fontWeight: 600,
                      }}
                    >
                      {r.asset}
                    </td>
                    <td style={{ padding: "11px 14px" }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#94a3b8",
                          background: "#1f2937",
                          borderRadius: 4,
                          padding: "2px 8px",
                          textTransform: "capitalize",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {r.category}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "11px 14px",
                        fontSize: 12,
                        color: "#64748b",
                        maxWidth: 220,
                      }}
                    >
                      {activeTab === "purchases"
                        ? r.base
                        : `${r.fromBase?.split(" - ")[1] ?? r.fromBase} → ${r.toBase?.split(" - ")[1] ?? r.toBase}`}
                    </td>
                    <td
                      style={{
                        padding: "11px 14px",
                        fontSize: 14,
                        fontWeight: 800,
                        color: tab.color,
                      }}
                    >
                      {fmt(r.quantity)}
                    </td>
                    <td
                      style={{
                        padding: "11px 14px",
                        fontSize: 12,
                        color: "#64748b",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {fmtDate(r.purchaseDate || r.transferDate)}
                    </td>
                    {activeTab === "purchases" && (
                      <td
                        style={{
                          padding: "11px 14px",
                          fontSize: 11,
                          color: "#374151",
                          fontFamily: "monospace",
                        }}
                      >
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
