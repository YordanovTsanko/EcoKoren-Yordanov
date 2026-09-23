import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
    return (
        <div className="min-h-screen bg-[#f5f7f4]">
            <AdminSidebar />

            <main className="min-w-0 md:pl-64">
                <Outlet />
            </main>
        </div>
    );
}