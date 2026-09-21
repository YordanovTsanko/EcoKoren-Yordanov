import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiLogOut,
  FiChevronDown,
  FiChevronRight,
  FiPackage,
  FiHeart,
  FiSettings,
  FiMapPin,
  FiBell,
} from "react-icons/fi";
import { HiOutlineUser } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "../../store/slices/authSlice";

const nav = [
  { to: "/", label: "НАЧАЛО" },
  { to: "/store", label: "МАГАЗИН" },
  { to: "/promotions", label: "ПРОМОЦИИ" },
  { to: "/new-products", label: "НОВИ ПРОДУКТИ" },
  { to: "/about-us", label: "ЗА НАС" },
  { to: "/contacts", label: "КОНТАКТИ" },
];

const accountMenu = [
  {
    label: "Моят профил",
    icon: HiOutlineUser,
    to: "/account",
  },
  {
    label: "Моите поръчки",
    icon: FiPackage,
    to: "/account/orders",
  },
  {
    label: "Любими продукти",
    icon: FiHeart,
    to: "/account/favorites",
  },
  {
    label: "Адреси",
    icon: FiMapPin,
    to: "/account/addresses",
  },
  {
    label: "Известия",
    icon: FiBell,
    to: "/account/settings/notifications",
  },
  {
    label: "Настройки",
    icon: FiSettings,
    children: [
      {
        label: "Сигурност",
        to: "/account/settings/security",
      },
    ],
  },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileAccountOpen, setMobileAccountOpen] = useState(false);
  const [desktopSubmenu, setDesktopSubmenu] = useState(null);

  const userMenuRef = useRef(null);

  const totalQty = useSelector((s) => s.cart.totalQty);
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);
  const me = useSelector((s) => s.users?.me?.data?.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  /**
   * CLICK OUTSIDE + ESCAPE
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
        setDesktopSubmenu(null);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setUserMenuOpen(false);
        setDesktopSubmenu(null);
        setOpen(false);
        setMobileAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  /**
   * HELPERS
   */
  const closeAllMenus = () => {
    setOpen(false);
    setUserMenuOpen(false);
    setDesktopSubmenu(null);
    setMobileAccountOpen(false);
  };

  const handleLogout = async () => {
    setUserMenuOpen(false);
    setDesktopSubmenu(null);
    setMobileAccountOpen(false);

    try {
      const result = dispatch(logout());

      if (result?.then) {
        await result;
      }
    } finally {
      navigate("/");
    }
  };

  const handleUserIconClick = () => {
    if (isAuthenticated) {
      setUserMenuOpen((prev) => !prev);
      setDesktopSubmenu(null);
    } else {
      navigate("/auth");
      setOpen(false);
    }
  };

  const handleMobileUserClick = () => {
    if (!isAuthenticated) {
      navigate("/auth");
      setOpen(false);
      return;
    }

    setMobileAccountOpen((prev) => !prev);
  };

  const handleNavClick = () => {
    setOpen(false);
    setMobileAccountOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-black/5">
      <div className="container-eco min-h-[68px] sm:min-h-[76px] flex items-center justify-between gap-4">
        {/* LOGO */}
        <Link
          to="/"
          onClick={closeAllMenus}
          className="flex items-center gap-2.5 sm:gap-3 min-w-0 shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#e6f2e9] grid place-items-center shrink-0">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 2C8 5 4 8.5 4 13c0 3.3 2.7 6 6 6 1.6 0 3-.6 4-1.6"
                stroke="#1e4d2b"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M12 17.4c1-.9 2.4-1.4 4-1.4 3.3 0 6-2.7 6-6 0-4.5-4-8-8-11"
                stroke="#2d7a3e"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="min-w-0">
            <div className="text-[20px] xs:text-[22px] sm:text-[26px] font-extrabold leading-none tracking-tight text-[#123123] truncate">
              ЕкоКорен
            </div>

            <div className="hidden xs:block text-[10px] sm:text-[12px] text-[#5a715f] -mt-0.5 truncate">
              Успеха на вашия бизнес и градина
            </div>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-[13px] xl:text-[14px] font-semibold tracking-wide transition relative pb-1 whitespace-nowrap ${
                  isActive
                    ? "text-[#1e4d2b]"
                    : "text-[#2a3d2f] hover:text-[#1e4d2b]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}

                  {isActive && (
                    <span className="absolute left-0 right-0 -bottom-2 h-[2px] bg-[#1e4d2b]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* SEARCH - desktop */}
          <button
            type="button"
            aria-label="Търсене"
            className="hidden sm:grid place-items-center cursor-pointer w-9 h-9 rounded-lg hover:bg-[#eef4ec] hover:text-[#1e4d2b] transition"
            onClick={() => {
              navigate("/search");
              closeAllMenus();
            }}
          >
            <FiSearch size={20} />
          </button>

          {/* ACCOUNT - desktop */}
          <div className="relative hidden sm:block" ref={userMenuRef}>
            <button
              type="button"
              aria-label="Профил"
              aria-haspopup="menu"
              aria-expanded={userMenuOpen}
              className={`grid place-items-center w-9 h-9 cursor-pointer rounded-lg transition ${
                userMenuOpen
                  ? "bg-[#eef4ec] text-[#1e4d2b]"
                  : "hover:bg-[#eef4ec] hover:text-[#1e4d2b]"
              }`}
              onClick={handleUserIconClick}
            >
              <HiOutlineUser size={21} />
            </button>

            <AnimatePresence>
              {userMenuOpen && isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.16 }}
                  className="absolute right-0 top-full mt-2 w-[280px] rounded-2xl border border-black/10 bg-white shadow-xl p-2 z-50"
                  role="menu"
                >
                  {/* USER HEADER */}
                  <div className="px-3 py-3 border-b border-black/5 mb-1.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#e6f2e9] grid place-items-center text-[#1e4d2b] shrink-0">
                        <HiOutlineUser size={20} />
                      </div>

                      <div className="min-w-0">
                        <div className="text-[13px] text-[#607064]">
                          Здравейте
                        </div>

                        <div className="font-bold text-[14px] text-[#0f2e1f] truncate">
                          {me?.firstName && me?.lastName
                            ? `${me.firstName} ${me.lastName}`
                            : me?.email || "Профил"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ACCOUNT ITEMS */}
                  <div className="space-y-1">
                    {accountMenu.map((item) => {
                      const Icon = item.icon;
                      const hasChildren = Array.isArray(item.children);

                      if (hasChildren) {
                        const isOpen = desktopSubmenu === item.label;

                        return (
                          <div key={item.label} className="relative">
                            <button
                              type="button"
                              className={`w-full flex items-center cursor-pointer justify-between gap-3 px-3 py-2.5 rounded-xl text-[14px] font-semibold transition ${
                                isOpen
                                  ? "bg-[#eef4ec] text-[#1e4d2b]"
                                  : "text-[#0f2e1f] hover:bg-[#f5f8f4]"
                              }`}
                              onClick={() =>
                                setDesktopSubmenu((prev) =>
                                  prev === item.label ? null : item.label,
                                )
                              }
                              aria-expanded={isOpen}
                            >
                              <span className="flex items-center gap-3">
                                <Icon size={17} />
                                {item.label}
                              </span>

                              <FiChevronRight
                                size={16}
                                className={`transition-transform ${
                                  isOpen ? "rotate-90" : ""
                                }`}
                              />
                            </button>

                            <AnimatePresence initial={false}>
                              {isOpen && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="ml-5 pl-3 mt-1 border-l border-black/10 space-y-1">
                                    {item.children.map((child) => (
                                      <NavLink
                                        key={child.to}
                                        to={child.to}
                                        onClick={closeAllMenus}
                                        className={({ isActive }) =>
                                          `flex items-center px-3 py-2 rounded-lg text-[13px] transition ${
                                            isActive
                                              ? "bg-[#eef4ec] text-[#1e4d2b] font-semibold"
                                              : "text-[#44554a] hover:bg-[#f5f8f4] hover:text-[#1e4d2b]"
                                          }`
                                        }
                                      >
                                        {child.label}
                                      </NavLink>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      }

                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          onClick={closeAllMenus}
                          role="menuitem"
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-semibold transition ${
                              isActive
                                ? "bg-[#eef4ec] text-[#1e4d2b]"
                                : "text-[#0f2e1f] hover:bg-[#f5f8f4]"
                            }`
                          }
                        >
                          <Icon size={17} />
                          {item.label}
                        </NavLink>
                      );
                    })}
                  </div>

                  {/* LOGOUT */}
                  <div className="border-t border-black/5 mt-2 pt-2">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-semibold text-red-600 hover:bg-red-50 transition"
                    >
                      <FiLogOut size={17} />
                      Изход
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* CART */}
          <button
            type="button"
            aria-label="Количка"
            className="relative grid place-items-center w-9 h-9 cursor-pointer rounded-lg hover:bg-[#eef4ec] hover:text-[#1e4d2b] transition"
            onClick={() => {
              navigate("/cart");
              closeAllMenus();
            }}
          >
            <FiShoppingCart size={21} />

            <span className="absolute -top-1 -right-1 bg-[#1e4d2b] text-white text-[10px] min-w-[18px] h-[18px] px-1 grid place-items-center rounded-full font-bold">
              {totalQty > 99 ? "99+" : totalQty}
            </span>
          </button>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            aria-label={open ? "Затвори менюто" : "Отвори менюто"}
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
            className="lg:hidden grid place-items-center w-9 h-9 rounded-lg hover:bg-[#eef4ec] hover:text-[#1e4d2b] transition"
          >
            {open ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-black/5 bg-white overflow-hidden"
          >
            <div className="container-eco py-3">
              {/* MOBILE QUICK ACTIONS */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => {
                    navigate("/search");
                    setOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl border border-black/5 bg-[#f8faf7] px-3 py-3 text-[13px] font-semibold text-[#0f2e1f]"
                >
                  <FiSearch size={17} />
                  Търсене
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigate("/cart");
                    setOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl border border-black/5 bg-[#f8faf7] px-3 py-3 text-[13px] font-semibold text-[#0f2e1f]"
                >
                  <FiShoppingCart size={17} />
                  Количка
                </button>
              </div>

              {/* MOBILE NAV */}
              <nav className="flex flex-col">
                {nav.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      `py-3.5 text-[14px] sm:text-[15px] font-semibold border-b border-black/5 transition ${
                        isActive
                          ? "text-[#1e4d2b]"
                          : "text-[#24382b] hover:text-[#1e4d2b]"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              {/* MOBILE ACCOUNT */}
              <div className="mt-2 border-t border-black/5 pt-2">
                {!isAuthenticated ? (
                  <button
                    type="button"
                    onClick={() => {
                      navigate("/auth");
                      setOpen(false);
                    }}
                    className="w-full flex items-center gap-3 py-3.5 text-[14px] font-semibold text-[#24382b]"
                  >
                    <HiOutlineUser size={20} />
                    Вход / Регистрация
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleMobileUserClick}
                      className="w-full flex items-center justify-between gap-3 py-3.5 text-left"
                      aria-expanded={mobileAccountOpen}
                    >
                      <span className="flex items-center gap-3">
                        <HiOutlineUser size={20} />

                        <span>
                          <span className="block text-[12px] text-[#67756a]">
                            Профил
                          </span>

                          <span className="block text-[14px] font-semibold text-[#24382b]">
                            {me?.firstName || me?.email || "Моят акаунт"}
                          </span>
                        </span>
                      </span>

                      <FiChevronDown
                        size={18}
                        className={`transition-transform ${
                          mobileAccountOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {mobileAccountOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="ml-3 pl-3 border-l border-black/10 pb-2">
                            {accountMenu.map((item) => {
                              const Icon = item.icon;

                              if (item.children) {
                                return (
                                  <div key={item.label} className="py-1">
                                    <div className="flex items-center gap-2 px-2 py-2 text-[13px] font-semibold text-[#506057]">
                                      <Icon size={16} />
                                      {item.label}
                                    </div>

                                    <div className="ml-4 border-l border-black/10 pl-2">
                                      {item.children.map((child) => (
                                        <NavLink
                                          key={child.to}
                                          to={child.to}
                                          onClick={handleNavClick}
                                          className={({ isActive }) =>
                                            `block px-3 py-2.5 rounded-lg text-[13px] ${
                                              isActive
                                                ? "bg-[#eef4ec] text-[#1e4d2b] font-semibold"
                                                : "text-[#526057] hover:bg-[#f5f8f4]"
                                            }`
                                          }
                                        >
                                          {child.label}
                                        </NavLink>
                                      ))}
                                    </div>
                                  </div>
                                );
                              }

                              return (
                                <NavLink
                                  key={item.to}
                                  to={item.to}
                                  onClick={handleNavClick}
                                  className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-semibold ${
                                      isActive
                                        ? "bg-[#eef4ec] text-[#1e4d2b]"
                                        : "text-[#314338] hover:bg-[#f5f8f4]"
                                    }`
                                  }
                                >
                                  <Icon size={16} />
                                  {item.label}
                                </NavLink>
                              );
                            })}

                            <button
                              type="button"
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-3 py-2.5 mt-1 rounded-lg text-[13px] font-semibold text-red-600 hover:bg-red-50"
                            >
                              <FiLogOut size={16} />
                              Изход
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
