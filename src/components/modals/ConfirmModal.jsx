import { FiAlertTriangle, FiX } from "react-icons/fi";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Потвърждаване",
  message = "Сигурен ли си, че искаш да запазиш промените?",
  confirmText = "Потвърди",
  cancelText = "Отказ",
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-black/5 bg-white shadow-xl animate-in fade-in zoom-in-95">
        <div className="h-1 bg-[#1e4d2b]" />

        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <FiAlertTriangle size={20} />
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-black/40 transition hover:bg-black/5 hover:text-black/60"
            >
              <FiX size={18} />
            </button>
          </div>

          <h3 className="mt-4 text-base font-black text-[#0f2e1f]">
            {title}
          </h3>
          <p className="mt-1.5 text-sm leading-6 text-[#0f2e1f]/60">
            {message}
          </p>

          <div className="mt-6 flex gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-bold text-[#0f2e1f] transition hover:bg-black/[0.03]"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 rounded-xl bg-[#1e4d2b] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0f2e1f] active:scale-[0.98]"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}