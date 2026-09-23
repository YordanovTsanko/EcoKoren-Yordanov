import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBell,
  FiCheckSquare,
  FiTrash2,
  FiAlertTriangle,
  FiCircle,
  FiCheckCircle,
  FiInfo,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { HiOutlineUser } from "react-icons/hi2";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  clearNotificationsError,
} from "../../store/slices/notificationsSlice";

export default function Notifications() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector((s) => s.auth?.isAuthenticated);
  const { list: notifications, status, error, total, page, limit, unreadCount } = useSelector(
    (state) => state.notifications
  );

  const [filterRead, setFilterRead] = useState(undefined);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchNotifications({ read: filterRead, page, limit }));
    }
    return () => {
      dispatch(clearNotificationsError());
    };
  }, [dispatch, isAuthenticated, filterRead, page, limit]);

  const handleMarkAsRead = (id) => {
    dispatch(markNotificationRead(id));
  };

  const handleMarkAllAsRead = () => {
    if (unreadCount > 0) {
      dispatch(markAllNotificationsRead());
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Сигурни ли сте, че искате да изтриете това известие?")) {
      dispatch(deleteNotification(id));
    }
  };

  const handlePageChange = (newPage) => {
    dispatch(fetchNotifications({ read: filterRead, page: newPage, limit }));
  };

  const isLoading = status === "loading";
  const totalPages = Math.ceil(total / limit) || 1;

  if (!isAuthenticated) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="mx-auto max-w-lg overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="h-1 bg-[#1e4d2b]" />
          <div className="px-6 py-10 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#eef4ec] text-[#1e4d2b]">
              <HiOutlineUser size={27} />
            </div>
            <h1 className="mt-5 text-2xl font-black">Известия</h1>
            <p className="mt-2 text-sm text-black/40">
              Трябва да влезете в профила си, за да прегледате известията.
            </p>
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
      <div className="mb-5 overflow-hidden rounded-2xl border border-[#1e4d2b]/10 bg-[#f7faf6]">
        <div className="flex items-center gap-3 px-4 py-4">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#1e4d2b] text-white relative">
            <FiBell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-[#f7faf6]">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#1e4d2b]/55">
              Информационен център
            </div>
            <h1 className="truncate text-lg font-black text-[#0f2e1f]">
              Известия
            </h1>
            <p className="truncate text-xs text-[#0f2e1f]/50">
              Бъдете информирани за вашите поръчки, промоции и системни съобщения.
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
        <div className="h-1 bg-[#1e4d2b]" />
        <div className="p-4 sm:p-6 lg:p-7">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-black/5 pb-4 mb-4">
            <div className="flex items-center gap-1.5 bg-gray-50 p-1 rounded-xl border border-black/[0.03] self-start">
              <button
                type="button"
                onClick={() => setFilterRead(undefined)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                  filterRead === undefined
                    ? "bg-white text-[#1e4d2b] shadow-sm"
                    : "text-black/50 hover:text-black/80"
                }`}
              >
                Всички
              </button>
              <button
                type="button"
                onClick={() => setFilterRead(false)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  filterRead === false
                    ? "bg-white text-[#1e4d2b] shadow-sm"
                    : "text-black/50 hover:text-black/80"
                }`}
              >
                Непрочетени
                {unreadCount > 0 && (
                  <span className="bg-[#1e4d2b] text-white text-[9px] px-1.5 py-0.5 rounded-md font-black">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="cursor-pointer flex items-center gap-2 rounded-lg border border-[#1e4d2b]/10 bg-white px-3.5 py-2 text-xs font-bold text-[#1e4d2b] hover:bg-[#eef4ec] transition self-start sm:self-center"
              >
                <FiCheckSquare size={14} />
                Маркирай всички като прочетени
              </button>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FiAlertTriangle className="shrink-0" size={14} />
                <span>{error}</span>
              </div>
              <button 
                onClick={() => dispatch(clearNotificationsError())} 
                className="text-red-400 hover:text-red-600 transition p-1"
              >
                <FiX size={14} />
              </button>
            </div>
          )}

          {isLoading && notifications.length === 0 ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-20 w-full bg-[#f7faf6] animate-pulse rounded-xl" />
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-14 bg-[#f7faf6] rounded-xl border border-black/[0.02]">
              <FiBell size={32} className="mx-auto text-black/20 mb-2" />
              <p className="text-xs text-black/50 font-medium">Нямате налични известия.</p>
            </div>
          ) : (
            <div className="divide-y divide-black/5">
              <AnimatePresence initial={false}>
                {notifications.map((notification) => {
                  // ИНТЕГРИРАНО: Четем с предимство MongoDB _id на модела
                  const id = notification._id || notification.id;
                  const isUnread = !notification.read;

                  return (
                    <motion.div
                      key={id}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, paddingBottom: 0, paddingTop: 0 }}
                      className={`py-4 flex items-start justify-between gap-4 transition-colors ${
                        isUnread ? "bg-[#eef4ec]/20 px-3 rounded-xl -mx-3" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <button
                          type="button"
                          disabled={!isUnread}
                          onClick={() => handleMarkAsRead(id)}
                          className={`mt-1 shrink-0 transition-all ${
                            isUnread 
                              ? "text-[#1e4d2b] cursor-pointer hover:scale-110" 
                              : "text-black/15"
                          }`}
                        >
                          {isUnread ? (
                            <FiCircle size={14} fill="#1e4d2b" className="animate-pulse" />
                          ) : (
                            <FiCheckCircle size={14} />
                          )}
                        </button>

                        <div className="min-w-0 space-y-0.5">
                          <h4 className={`text-sm text-[#0f2e1f] break-words ${isUnread ? "font-bold" : "font-medium opacity-75"}`}>
                            {notification.title || "Известие"}
                          </h4>
                          <p className="text-xs text-black/60 leading-relaxed break-words">
                            {notification.message}
                          </p>
                          <div className="text-[10px] font-bold text-black/35 flex items-center gap-1 pt-1">
                            <FiInfo size={10} />
                            {notification.createdAt ? new Date(notification.createdAt).toLocaleString("bg-BG") : "Сега"}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}