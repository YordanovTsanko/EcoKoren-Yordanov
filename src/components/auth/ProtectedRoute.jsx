import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute({ requireAdmin = false }) {
    const location = useLocation();

    const { isAuthenticated, user, meStatus } = useSelector((s) => ({
        isAuthenticated: s.auth.isAuthenticated,
        user: s.users.me?.data?.user ?? null,
        meStatus: s.users.meStatus,
    }));
    if (
        isAuthenticated &&
        !user &&
        (meStatus === "loading" || meStatus === "idle")
    ) {
        return (
            <div className="flex items-center justify-center py-24 text-[#1e4d2b] font-semibold">
                Зареждане...
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/auth"
                replace
                state={{ from: location }}
            />
        );
    }

    const isAdmin =
        user?.role === "admin" ||
        user?.role === "super_admin";

    if (requireAdmin && !isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}