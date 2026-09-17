import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

/**
 * Пази route-и, до които достъп имат само логнати потребители.
 *
 * Употреба в App.jsx:
 *
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/account" element={<Account />} />
 *     <Route path="/orders" element={<Orders />} />
 *   </Route>
 *
 * Ако искаш само admin да влиза, ползвай <ProtectedRoute requireAdmin />.
 */
export default function ProtectedRoute({ requireAdmin = false }) {
  const location = useLocation();
  const { isAuthenticated, me, meStatus } = useSelector((s) => ({
    isAuthenticated: s.auth.isAuthenticated,
    me: s.users.me,
    meStatus: s.users.meStatus,
  }));

  // Докато проверяваме дали токенът е валиден (fetchMe при зареждане на приложението)
  if (isAuthenticated && meStatus === "loading" && !me) {
    return (
      <div className="flex items-center justify-center py-24 text-[#1e4d2b] font-semibold">
        Зареждане...
      </div>
    );
  }

  if (!isAuthenticated) {
    // Пазим откъде идва потребителят, за да го върнем там след успешен login
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  if (requireAdmin && me?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}