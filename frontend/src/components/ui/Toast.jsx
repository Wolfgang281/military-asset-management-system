import { CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

// ── Global toast emitter ──────────────────────────────────────────────────────
let _setToasts = null;
// eslint-disable-next-line react-refresh/only-export-components
export const toast = {
  success: (msg) =>
    _setToasts?.((p) => [...p, { id: Date.now(), type: "success", msg }]),
  error: (msg) =>
    _setToasts?.((p) => [...p, { id: Date.now(), type: "error", msg }]),
};

// ── Toast item ────────────────────────────────────────────────────────────────
const ToastItem = ({ item, onRemove }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(item.id), 300);
    }, 3500);
    return () => clearTimeout(t);
  }, []);

  const isSuccess = item.type === "success";

  return (
    <div
      className={`
      flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl
      min-w-[260px] max-w-[360px] transition-all duration-300
      ${isSuccess ? "bg-[#0b1120] border-green-500/30" : "bg-[#0b1120] border-red-500/30"}
      ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
    `}
    >
      {isSuccess ? (
        <CheckCircle size={16} className="text-green-400 shrink-0" />
      ) : (
        <XCircle size={16} className="text-red-400   shrink-0" />
      )}
      <p
        className={`text-sm font-semibold ${isSuccess ? "text-green-300" : "text-red-300"}`}
      >
        {item.msg}
      </p>
    </div>
  );
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);
  // eslint-disable-next-line react-hooks/globals
  _setToasts = setToasts;

  const remove = (id) => setToasts((p) => p.filter((t) => t.id !== id));

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 items-end pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} item={t} onRemove={remove} />
      ))}
    </div>
  );
};
