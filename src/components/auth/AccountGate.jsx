import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const BLOCK_PATH = "/account-inactive";

/**
 * Обвива цялото приложение. Ако потребителят е логнат, но /users/me
 * се провали (напр. непотвърден имейл, деактивиран акаунт), пренасочва
 * към страница-капан /account-inactive - независимо накъде се опитва
 * да навигира - докато не логаутне или профилът му не стане активен.
 */
export default function AccountGate({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);
  const meStatus = useSelector((s) => s.users.meStatus);
  const status = useSelector((s) => s.users?.me?.data?.user?.status);

  const isBlocked = isAuthenticated && meStatus === "succeeded" && status === "pending";

  useEffect(() => {
    if (isBlocked && location.pathname !== BLOCK_PATH) {
      navigate(BLOCK_PATH, { replace: true });
    }
    // Ако вече не е блокиран (логаутнал или профилът е активен), но стои
    // на капан-страницата - изкарваме го оттам.
    if (!isBlocked && location.pathname === BLOCK_PATH) {
      navigate("/", { replace: true });
    }
  }, [isBlocked, location.pathname, navigate]);

  // Докато решаваме дали да пренасочим, не показваме нищо от реалната страница -
  // избягва кратко "проблясване" на защитено съдържание.
  if (isBlocked && location.pathname !== BLOCK_PATH) {
    return null;
  }

  return children;
}
