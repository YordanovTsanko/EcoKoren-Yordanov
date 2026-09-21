import { useEffect, useState } from "react";
import { FiX, FiMapPin } from "react-icons/fi";

export default function AddressModal({ isOpen, onClose, initialAddress, onSave }) {
  const [form, setForm] = useState({
    country: "",
    city: "",
    state: "",
    postalCode: "",
    street: "",
  });
  const [confirmStep, setConfirmStep] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm({
        country: initialAddress?.country || "",
        city: initialAddress?.city || "",
        state: initialAddress?.state || "",
        postalCode: initialAddress?.postalCode || "",
        street: initialAddress?.street || "",
      });
      setConfirmStep(false);
    }
  }, [isOpen, initialAddress]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({...p, [name]: value }));
  };

  const handleSaveClick = () => {
    if (!confirmStep) {
      setConfirmStep(true);
      setTimeout(() => setConfirmStep(false), 3000);
      return;
    }
    // изпращаме null където е празно, както в твоя модел
    const payload = {
      country: form.country || null,
      city: form.city || null,
      state: form.state || null,
      postalCode: form.postalCode || null,
      street: form.street || null,
    };
    onSave(payload);
    setConfirmStep(false);
  };

  const inputCls = "w-full rounded-xl border border-black/10 bg-transparent px-3.5 py-2.5 text-sm font-bold text-[#0f2e1f] outline-none focus:border-[#1e4d2b] focus:ring-2 focus:ring-[#1e4d2b]/10";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-" onClick={onClose} />
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="h-1 bg-[#1e4d2b]" />
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#eef4ec] text-[#1e4d2b]"><FiMapPin size={18} /></div>
              <h3 className="text-sm font-black text-[#0f2e1f]">Адрес</h3>
            </div>
            <button onClick={onClose} className="cursor-pointer rounded-lg p-1.5 text-black/40 hover:bg-black/5"><FiX size={18} /></button>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text- font-bold uppercase tracking-[0.12em] text-black/40">Улица</label>
              <input name="street" value={form.street} onChange={handleChange} placeholder="ул. Пример 1" className={`mt-1.5 ${inputCls}`} />
            </div>
            <div>
              <label className="text- font-bold uppercase tracking-[0.12em] text-black/40">Град</label>
              <input name="city" value={form.city} onChange={handleChange} placeholder="София" className={`mt-1.5 ${inputCls}`} />
            </div>
            <div>
              <label className="text- font-bold uppercase tracking-[0.12em] text-black/40">Пощенски код</label>
              <input name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="1000" className={`mt-1.5 ${inputCls}`} />
            </div>
            <div>
              <label className="text- font-bold uppercase tracking-[0.12em] text-black/40">Област / Щат</label>
              <input name="state" value={form.state} onChange={handleChange} placeholder="София" className={`mt-1.5 ${inputCls}`} />
            </div>
            <div>
              <label className="text- font-bold uppercase tracking-[0.12em] text-black/40">Държава</label>
              <input name="country" value={form.country} onChange={handleChange} placeholder="България" className={`mt-1.5 ${inputCls}`} />
            </div>
          </div>

          <div className="mt-6 flex gap-2.5">
            <button type="button" onClick={onClose} className="cursor-pointer flex-1 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-bold hover:bg-black/[0.03]">Отказ</button>
            <button type="button" onClick={handleSaveClick} className={`cursor-pointer flex-1 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition active:scale-[0.98] ${confirmStep? "bg-amber-600 hover:bg-amber-700" : "bg-[#1e4d2b] hover:bg-[#0f2e1f]"}`}>
              {confirmStep? "Потвърди запазването" : "Запази"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}