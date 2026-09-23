import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiMapPin,
  FiLogOut,
  FiEdit3,
  FiPhone,
  FiMail,
  FiFileText,
  FiX,
} from "react-icons/fi";
import { HiOutlineUser } from "react-icons/hi2";
import { logout } from "../../store/slices/authSlice";
import { updateMe } from "../../store/slices/usersSlice";
import ConfirmModal from "../../components/modals/ConfirmModal";
import AddressModal from "../../components/modals/AddressModal";

export default function Account() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [buttonEdit, setButtonEdit] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  const isAuthenticated = useSelector((s) => s.auth?.isAuthenticated);
  const me = useSelector((s) => s.users?.me?.data?.user);

  const [fullNameInput, setFullNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");

  useEffect(() => {
    if (me) {
      setFullNameInput(`${me.firstName || ""} ${me.lastName || ""}`.trim());
      setPhoneInput(me.phone || "");
    }
  }, [me]);

  const fullName = useMemo(() => {
    const name = `${me?.firstName || ""} ${me?.lastName || ""}`.trim();
    return name || me?.email || "Потребител";
  }, [me?.firstName, me?.lastName, me?.email]);

  const initials = useMemo(() => {
    const first = me?.firstName?.[0] || "";
    const last = me?.lastName?.[0] || "";
    return `${first}${last}`.toUpperCase() || "П";
  }, [me?.firstName, me?.lastName]);

  const address = me?.address || {};
  const hasAddress = Boolean(
    address?.country ||
    address?.city ||
    address?.state ||
    address?.postalCode ||
    address?.street,
  );

  const handleEdit = () => {
    if (!buttonEdit) setButtonEdit(true);
    else setShowConfirm(true);
  };

  const handleCancel = () => {
    setFullNameInput(`${me?.firstName || ""} ${me?.lastName || ""}`.trim());
    setPhoneInput(me?.phone || "");
    setButtonEdit(false);
  };

  const handleConfirmSave = () => {
    const trimmed = fullNameInput.trim();
    const idx = trimmed.indexOf(" ");
    const firstName = idx === -1 ? trimmed : trimmed.slice(0, idx).trim();
    const lastName = idx === -1 ? "" : trimmed.slice(idx + 1).trim();
    dispatch(updateMe({ firstName, lastName, phone: phoneInput }));
    setShowConfirm(false);
    setButtonEdit(false);
  };

  const handleAddressSave = (newAddress) => {
    dispatch(updateMe({ address: newAddress }));
    setShowAddressModal(false);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout());
    } finally {
      navigate("/");
    }
  };

  const inputCls = (disabled) =>
    `mt-1.5 w-full rounded-lg border bg-transparent px-3 py-2 text-sm font-bold outline-none transition placeholder:text-sm placeholder:font-normal placeholder:italic placeholder:text-black/40 ${
      disabled
        ? "border-transparent text-[#0f2e1f] opacity-100"
        : "border-[#1e4d2b]/20 text-[#0f2e1f] focus:border-[#1e4d2b] focus:ring-2 focus:ring-[#1e4d2b]/10"
    }`;

  if (!isAuthenticated) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="mx-auto max-w-lg overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="h-1 bg-[#1e4d2b]" />
          <div className="px-6 py-10 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#eef4ec] text-[#1e4d2b]">
              <HiOutlineUser size={27} />
            </div>
            <h1 className="mt-5 text-2xl font-black">Моят профил</h1>
            <div className="mt-7 flex justify-center">
              <button
                onClick={() => navigate("/auth")}
                className="cursor-pointer rounded-xl bg-[#1e4d2b] px-6 py-3 text-sm font-bold text-white"
              >
                Вход / Регистрация
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-8">
        <div className="mb-5 overflow-hidden rounded-2xl border border-[#1e4d2b]/10 bg-[#f7faf6]">
          <div className="flex items-center gap-3 px-4 py-4">
            {me?.avatar ? (
              <img
                src={me.avatar}
                alt={fullName}
                className="h-12 w-12 rounded-xl object-cover"
              />
            ) : (
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#1e4d2b] text-sm font-black text-white">
                {initials}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#1e4d2b]/55">
                Моят профил
              </div>
              <h1 className="truncate text-lg font-black text-[#0f2e1f]">
                Здравей, {me?.firstName || "добре дошъл"}!
              </h1>
              <p className="truncate text-xs text-[#0f2e1f]/50">{me?.email}</p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
          <div className="h-1 bg-[#1e4d2b]" />
          <div className="p-4 sm:p-6 lg:p-7">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-black/5 pb-4">
              <div>
                <h3 className="text-sm font-black">Лични данни</h3>
                <p className="text-xs text-black/40">Информация за профила</p>
              </div>
              <div className="flex gap-2">
                {buttonEdit && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="cursor-pointer flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold"
                  >
                    <FiX size={14} />
                    Отказ
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleEdit}
                  className="cursor-pointer flex items-center gap-2 rounded-lg border border-[#1e4d2b]/10 bg-white px-3.5 py-2 text-xs font-bold text-[#1e4d2b] hover:bg-[#eef4ec]"
                >
                  <FiEdit3 size={14} />
                  {buttonEdit ? "Запази" : "Редактирай"}
                </button>
              </div>
            </div>

            <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl bg-[#f7faf6] p-3.5">
                <div className="flex items-center gap-1.5">
                  <HiOutlineUser size={12} className="text-[#1e4d2b]" />
                    <dt className="text-xs font-bold uppercase tracking-wider text-black/40">
                    Име
                  </dt>
                </div>
                <input
                  value={fullNameInput}
                  onChange={(e) => setFullNameInput(e.target.value)}
                  disabled={!buttonEdit}
                  placeholder="Име и фамилия"
                  className={inputCls(!buttonEdit)}
                />
              </div>

              <div className="rounded-xl bg-[#f7faf6] p-3.5">
                <div className="flex items-center gap-1.5">
                  <FiPhone size={12} className="text-[#1e4d2b]" />
                    <dt className="text-xs font-bold uppercase tracking-wider text-black/40">
                    Телефон
                  </dt>
                </div>
                <input
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  disabled={!buttonEdit}
                  placeholder="Няма добавен"
                  className={inputCls(!buttonEdit)}
                />
              </div>

              <div className="rounded-xl bg-[#f7faf6] p-3.5">
                <div className="flex items-center gap-1.5">
                  <FiMail size={12} className="text-[#1e4d2b]" />
                    <dt className="text-xs font-bold uppercase tracking-wider text-black/40">
                    Имейл
                  </dt>
                </div>
                <input
                  value={me?.email || ""}
                  disabled
                  className="mt-1.5 w-full rounded-lg border border-transparent bg-transparent px-3 py-2 text-sm font-bold text-black/60"
                />
              </div>

              <div className="rounded-xl bg-[#f7faf6] p-4 sm:col-span-2 lg:col-span-3 flex flex-col justify-between border border-black/[0.03]">
                <div>
                  <div className="flex items-center gap-1.5 mb-3">
                    <FiMapPin size={14} className="text-[#1e4d2b]" />
                    <dt className="text-xs font-bold uppercase tracking-wider text-black/40">
                      Адрес за доставка
                    </dt>
                  </div>

                  {/* Данни за адреса */}
                  <dd>
                    {hasAddress && address ? (
                      <div className="space-y-2.5 text-sm">
                        {/* Улица */}
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-black/30">
                            Улица
                          </span>
                          <span className="font-semibold text-gray-900 mt-0.5">
                            {address.street || "—"}
                          </span>
                        </div>

                        {/* Град и Пощенски код */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-black/30">
                              Град
                            </span>
                            <span className="font-medium text-gray-800 mt-0.5">
                              {address.city || "—"}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-black/30">
                              Пощенски код
                            </span>
                            <span className="font-mono font-bold text-[#1e4d2b] mt-0.5">
                              {address.postalCode || "—"}
                            </span>
                          </div>
                        </div>

                        {/* Област / Щат */}
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-black/30">
                            Област / Щат
                          </span>
                          <span className="font-medium text-gray-700 mt-0.5">
                            {address.state || "—"}
                          </span>
                        </div>

                        {/* Държава */}
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-black/30">
                            Държава
                          </span>
                          <span className="font-medium text-gray-700 mt-0.5">
                            {address.country || "—"}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm italic text-black/40 block py-1">
                        Няма добавен адрес за доставка.
                      </span>
                    )}
                  </dd>
                </div>

                {/* Бутон за действие */}
                <div className="mt-4 pt-3 border-t border-black/[0.04]">
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(true)}
                    className="cursor-pointer text-xs font-bold uppercase tracking-wider text-[#1e4d2b] hover:underline flex items-center gap-1"
                  >
                    {hasAddress ? "Редактирай адреса" : "Добави адрес"}
                  </button>
                </div>
              </div>
            </dl>

            <div className="mt-5 flex justify-end border-t border-black/5 pt-4">
              <button
                type="button"
                onClick={handleLogout}
                className="cursor-pointer flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50"
              >
                <FiLogOut size={14} />
                Изход
              </button>
            </div>
          </div>
        </div>
      </section>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmSave}
      />
      <AddressModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        initialAddress={address}
        onSave={handleAddressSave}
      />
    </>
  );
}