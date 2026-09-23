import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiMonitor, 
  FiSmartphone, 
  FiTrash2, 
  FiAlertTriangle, 
  FiShield, 
  FiGlobe,
  FiClock
} from "react-icons/fi";
import { HiOutlineUser } from "react-icons/hi2";
import { fetchSessions, deleteSession, deleteAllSessions } from "../../store/slices/sessionsSlice";
import { logout } from "../../store/slices/authSlice";
import ConfirmModal from "../../components/modals/ConfirmModal";

// Помощна функция за разчитане на операционната система и браузъра от userAgent
const parseUserAgent = (ua) => {
  if (!ua) return { os: "Неизвестна ОС", browser: "Браузър" };
  let os = "Windows";
  let browser = "Браузър";

  if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("Macintosh")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux";

  if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Edg")) browser = "Edge";
  else if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Safari")) browser = "Safari";

  return { os, browser };
};

export default function Sessions() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const isAuthenticated = useSelector((s) => s.auth?.isAuthenticated);
  const { list, status, error } = useSelector((state) => state.sessions);

  // Безопасно изваждане на масива със сесии спрямо твоя JSON обект
  const sessions = list?.data?.sessions || [];

  // Какво чака потвърждение: { type: "one", id } | { type: "all" } | null
  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchSessions());
    }
  }, [dispatch, isAuthenticated]);

  const handleTerminateOne = (id) => {
    setPendingAction({ type: "one", id });
  };

  const handleTerminateAll = () => {
    setPendingAction({ type: "all" });
  };

  const closeConfirm = () => setPendingAction(null);

  const handleConfirmTerminate = async () => {
    if (!pendingAction) return;

    if (pendingAction.type === "one") {
      dispatch(deleteSession(pendingAction.id));
      setPendingAction(null);
      return;
    }

    // "Прекрати всички сесии" маха и текущата сесия — refresh token-ът вече
    // е revoke-нат на бекенда, затова форсираме локален logout веднага,
    // вместо да чакаме accessToken-ът сам да изтече и следващият refresh
    // да гръмне с 401.
    await dispatch(deleteAllSessions());
    setPendingAction(null);

    try {
      await dispatch(logout());
    } finally {
      navigate("/");
    }
  };

  const isLoading = status === "loading";

  // Проверка за неаутентифициран потребител — същата структура като в Account
  if (!isAuthenticated) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="mx-auto max-w-lg overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="h-1 bg-[#1e4d2b]" />
          <div className="px-6 py-10 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#eef4ec] text-[#1e4d2b]">
              <HiOutlineUser size={27} />
            </div>
            <h1 className="mt-5 text-2xl font-black">Активни сесии</h1>
            <p className="mt-2 text-sm text-black/40">Трябва да влезете в профила си, за да видите сесиите.</p>
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
    <section className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-8">
      {/* Шапка/Банер със същия фон и заобляне */}
      <div className="mb-5 overflow-hidden rounded-2xl border border-[#1e4d2b]/10 bg-[#f7faf6]">
        <div className="flex items-center gap-3 px-4 py-4">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#1e4d2b] text-white">
            <FiShield size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#1e4d2b]/55">
              Сигурност на профила
            </div>
            <h1 className="truncate text-lg font-black text-[#0f2e1f]">
              Активни сесии
            </h1>
            <p className="truncate text-xs text-[#0f2e1f]/50">
              Преглед и управление на устройствата, влезли във вашия акаунт.
            </p>
          </div>
        </div>
      </div>

      {/* Основна карта на контейнера */}
      <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
        <div className="h-1 bg-[#1e4d2b]" />
        <div className="p-4 sm:p-6 lg:p-7">
          
          {/* Секционен Хедър с бутон за изход от всички */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-black/5 pb-4 mb-4">
            <div>
              <h3 className="text-sm font-black">Списък с устройства</h3>
              <p className="text-xs text-black/40">Всички текущи влизания</p>
            </div>
            {sessions.length > 0 && (
              <button
                type="button"
                onClick={handleTerminateAll}
                className="cursor-pointer flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-100"
              >
                <FiAlertTriangle size={14} />
                Прекрати всички сесии
              </button>
            )}
          </div>

          {/* Извеждане на грешка при проблем */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
              <FiAlertTriangle className="shrink-0" size={14} />
              <span>{error}</span>
            </div>
          )}

          {/* Лоудър скелетон */}
          {isLoading && sessions.length === 0 ? (
            <div className="space-y-3">
              {[1, 2].map((n) => (
                <div key={n} className="h-16 w-full bg-[#f7faf6] animate-pulse rounded-xl" />
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-10 bg-[#f7faf6] rounded-xl border border-black/[0.02]">
              <FiMonitor size={28} className="mx-auto text-black/20 mb-2" />
              <p className="text-xs text-black/50">Няма намерени активни сесии.</p>
            </div>
          ) : (
            /* Списък на сесиите */
            <div className="divide-y divide-black/5">
              <AnimatePresence initial={false}>
                {sessions.map((session) => {
                  const { os, browser } = parseUserAgent(session.userAgent);
                  const isMobileDevice = session.userAgent?.toLowerCase().includes("mobi");
                  const isCurrent = session.isActive; 

                  return (
                    <motion.div
                      key={session._id}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                        isCurrent ? "bg-[#eef4ec]/20 px-3 rounded-xl -mx-3" : ""
                      }`}
                    >
                      {/* Лява част - Информация за устройство */}
                      <div className="flex items-center gap-3">
                        <div className={`grid h-10 w-10 place-items-center rounded-xl shrink-0 ${
                          isCurrent ? "bg-[#eef4ec] text-[#1e4d2b]" : "bg-gray-100 text-gray-500"
                        }`}>
                          {isMobileDevice ? <FiSmartphone size={18} /> : <FiMonitor size={18} />}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-[#0f2e1f]">
                              {os} — {browser}
                            </span>
                            {isCurrent && (
                              <span className="bg-[#eef4ec] text-[#1e4d2b] text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border border-[#1e4d2b]/10">
                                Текущо устройство
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-black/40 mt-0.5">
                            <span className="flex items-center gap-1">
                              <FiGlobe size={11} /> {session.ip === "::1" ? "127.0.0.1 (Localhost)" : session.ip}
                            </span>
                            <span className="flex items-center gap-1">
                              <FiClock size={11} /> Последно: {new Date(session.lastActivityAt).toLocaleDateString("bg-BG")}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Дясна част - Действие/Бутон */}
                      <div className="flex sm:justify-end items-center">
                        {isCurrent ? (
                          <span className="text-[11px] font-bold text-[#1e4d2b] uppercase tracking-wider opacity-60">
                            Активна
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleTerminateOne(session._id)}
                            className="cursor-pointer flex items-center justify-center gap-2 text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 sm:px-3 sm:py-2 rounded-lg transition-colors w-full sm:w-auto"
                          >
                            <FiTrash2 size={13} />
                            <span>Прекрати</span>
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
                </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!pendingAction}
        onClose={closeConfirm}
        onConfirm={handleConfirmTerminate}
        title={
          pendingAction?.type === "all"
            ? "Прекратяване на всички сесии"
            : "Прекратяване на сесия"
        }
        message={
          pendingAction?.type === "all"
            ? "Сигурни ли сте, че искате да прекратите всички активни сесии? Ще излезете от съответните устройства."
            : "Сигурни ли сте, че искате да прекратите тази сесия?"
        }
        confirmText="Прекрати"
        cancelText="Отказ"
      />
    </section>
  )
}