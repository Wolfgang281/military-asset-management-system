import {
  ArrowDownLeft,
  ArrowUpRight,
  BarChart3,
  ShoppingCart,
  Target,
  TrendingUp,
  UserCheck,
  Zap,
} from "lucide-react";
import MetricCard from "./MetricCard";

const MetricsGrid = ({ data, onNetMovementClick }) => {
  if (!data) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* ── Row 1: Balance trio ───────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
        }}
      >
        <MetricCard
          index={0}
          icon={BarChart3}
          label="Opening Balance"
          value={data.openingBalance}
          sub="Total stock before selected period"
          accent="#6366f1"
        />
        <MetricCard
          index={1}
          icon={TrendingUp}
          label="Net Movement"
          value={data.netMovement}
          sub="Purchases + Transfers In − Out"
          accent="#f59e0b"
          badge="Click"
          onClick={onNetMovementClick}
        />
        <MetricCard
          index={2}
          icon={Target}
          label="Closing Balance"
          value={data.closingBalance}
          sub="Opening Balance + Net Movement"
          accent="#22c55e"
        />
      </div>

      {/* ── Row 2: Movement trio ──────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
        }}
      >
        <MetricCard
          index={3}
          icon={ShoppingCart}
          label="Purchases"
          value={data.purchases}
          sub="Total procured in period"
          accent="#22c55e"
        />
        <MetricCard
          index={4}
          icon={ArrowDownLeft}
          label="Transfers In"
          value={data.transfersIn}
          sub="Completed inbound transfers"
          accent="#3b82f6"
        />
        <MetricCard
          index={5}
          icon={ArrowUpRight}
          label="Transfers Out"
          value={data.transfersOut}
          sub="Completed outbound transfers"
          accent="#ef4444"
        />
      </div>

      {/* ── Row 3: Personnel duo ──────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 16,
        }}
      >
        <MetricCard
          index={6}
          icon={UserCheck}
          label="Assigned"
          value={data.assigned}
          sub="Assets actively assigned to personnel"
          accent="#a78bfa"
        />
        <MetricCard
          index={7}
          icon={Zap}
          label="Expended"
          value={data.expended}
          sub="Assets marked as expended"
          accent="#f97316"
        />
      </div>
    </div>
  );
};

export default MetricsGrid;
