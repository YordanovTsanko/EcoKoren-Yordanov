import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiSearch, FiShoppingCart, FiMenu, FiX, FiLogOut } from "react-icons/fi";
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

export default function Header() {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const totalQty = useSelector((s) => s.cart.totalQty);
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);
  const me = useSelector((s) => s.users.me);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUserMenuOpen(false);
    dispatch(logout()).then(() => navigate("/"));
  };

  const handleUserIconClick = () => {
    if (isAuthenticated) {
      setUserMenuOpen((v) => !v);
    } else {
      navigate("/auth");
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-black/5">
      <div className="container-eco h-[68px] sm:h-[76px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#e6f2e9] grid place-items-center">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
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
          <div>
            <div className="text-[22px] sm:text-[26px] font-extrabold leading-none tracking-tight text-[#123123]">
              ЕкоКорен
            </div>
            <div className="text-[11px] sm:text-[12px] text-[#5a715f] -mt-0.5">
              Успеха на вашия бизнес и градина
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `text-[14px] font-semibold tracking-wide transition relative pb-1 ${isActive ? "text-[#1e4d2b]" : "text-[#2a3d2f] hover:text-[#1e4d2b]"}`
              }
            >
              {({ isActive }) => (
                <>
                  {n.label}
                  {isActive && (
                    <span className="absolute left-0 right-0 -bottom-2 h-[2px] bg-[#1e4d2b]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            className="hidden sm:grid place-items-center w-9 h-9 hover:text-[#1e4d2b] cursor-pointer"
            onClick={() => {
              navigate("/search");
            }}
          >
            <FiSearch size={20} />
          </button>
          <div className="relative hidden sm:block">
            <button
              className="grid place-items-center w-9 h-9 hover:text-[#1e4d2b] cursor-pointer"
              onClick={handleUserIconClick}
            >
              <HiOutlineUser size={21} />
            </button>

            <AnimatePresence>
              {userMenuOpen && isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="absolute right-0 mt-2 w-52 rounded-xl border border-black/10 bg-white shadow-lg p-2 z-50"
                >
                  <div className="px-3 py-2 text-[13px] text-[#0f2e1f]/70 border-b border-black/5 mb-1">
                    {me?.firstName ? `Здравей, ${me.firstName}` : "Профил"}
                  </div>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate("/account");
                    }}
                    className="w-full text-left px-3 py-2 text-[14px] font-semibold rounded-lg hover:bg-[#eef4ec] text-[#0f2e1f]"
                  >
                    Моят профил
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 text-left px-3 py-2 text-[14px] font-semibold rounded-lg hover:bg-red-50 text-red-600"
                  >
                    <FiLogOut size={16} />
                    Изход
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            className="relative grid place-items-center w-9 h-9 hover:text-[#1e4d2b] cursor-pointer"
            onClick={() => {
              navigate("/cart");
            }}
          >
            <FiShoppingCart size={21} />
            <span className="absolute -top-1 -right-1 bg-[#1e4d2b] text-white text-[10px] min-w-[18px] h-[18px] px-1 grid place-items-center rounded-full font-bold">
              {totalQty}
            </span>
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden grid place-items-center w-9 h-9"
          >
            {open ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="lg:hidden border-t bg-white overflow-hidden"
          >
            <div className="container-eco py-3 flex flex-col">
              {nav.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="py-3 text-[15px] font-semibold border-b border-black/5 last:border-0"
                >
                  {n.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}