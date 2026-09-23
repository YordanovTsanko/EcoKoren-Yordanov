import { NavLink, Link } from "react-router-dom";
import {
    FiBarChart2,
    FiBox,
    FiHome,
    FiShoppingBag,
} from "react-icons/fi";

const navItems = [
    {
        to: "/admin",
        label: "Начало",
        icon: FiBarChart2,
        end: true,
    },
    {
        to: "/admin/products",
        label: "Продукти",
        icon: FiBox,
    },
];

function SidebarLink({ item }) {
    const Icon = item.icon;

    return (
        <NavLink
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
                [
                    "group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all",
                    isActive
                        ? "bg-[#1e4d2b] text-white shadow-[0_8px_20px_rgba(30,77,43,0.18)]"
                        : "text-[#102f20]/60 hover:bg-[#eef4ec] hover:text-[#1e4d2b]",
                ].join(" ")
            }
        >
            <Icon size={18} />
            <span>{item.label}</span>
        </NavLink>
    );
}

export default function AdminSidebar() {
    return (
        <>
            {/* DESKTOP */}
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-[#102f20]/8 bg-white md:flex md:flex-col">
                <div className="border-b border-[#102f20]/8 px-5 py-5">
                    <Link
                        to="/admin"
                        className="flex items-center gap-3"
                    >
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#1e4d2b] text-white">
                            <FiShoppingBag size={20} />
                        </div>

                        <div>
                            <div className="text-sm font-black tracking-tight text-[#102f20]">
                                Админ панел
                            </div>

                            <div className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#1e4d2b]/50">
                                Управление на сайта
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="flex-1 px-4 py-5">
                    <div className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#102f20]/35">
                        Навигация
                    </div>

                    <nav className="space-y-1.5">
                        {navItems.map((item) => (
                            <SidebarLink
                                key={item.to}
                                item={item}
                            />
                        ))}
                    </nav>
                </div>

                <div className="border-t border-[#102f20]/8 p-4">
                    <Link
                        to="/"
                        className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-[#102f20]/60 transition hover:bg-[#eef4ec] hover:text-[#1e4d2b]"
                    >
                        <FiHome size={18} />
                        <span>Към магазина</span>
                    </Link>
                </div>
            </aside>

            {/* MOBILE */}
            <div className="border-b border-[#102f20]/8 bg-white md:hidden">
                <div className="flex items-center justify-between px-4 py-4">
                    <Link
                        to="/admin"
                        className="flex items-center gap-3"
                    >
                        <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#1e4d2b] text-white">
                            <FiShoppingBag size={18} />
                        </div>

                        <div>
                            <div className="text-sm font-black text-[#102f20]">
                                Админ панел
                            </div>

                            <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#1e4d2b]/50">
                                Управление на сайта
                            </div>
                        </div>
                    </Link>

                    <Link
                        to="/"
                        className="text-xs font-bold text-[#1e4d2b]"
                    >
                        Към магазина
                    </Link>
                </div>

                <nav className="flex gap-2 overflow-x-auto px-4 pb-4">
                    {navItems.map((item) => (
                        <SidebarLink
                            key={item.to}
                            item={item}
                        />
                    ))}
                </nav>
            </div>
        </>
    );
}