import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { login, register, clearAuthError } from "../store/slices/authSlice";

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [remember, setRemember] = useState(false);
  const [policy, setPolicy] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [formError, setFormError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error, isAuthenticated } = useSelector((s) => s.auth);

  const redirectTo = location.state?.from?.pathname || "/";

  // Ако вече е логнат (или логинът мине успешно), пренасочваме
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  // Чистим грешката от Redux при смяна на таб (вход/регистрация)
  useEffect(() => {
    setFormError(null);
    dispatch(clearAuthError());
  }, [mode, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(null);

    if (mode === "login") {
      dispatch(login({ email, password }));
      return;
    }

    // register
    if (password !== confirmPassword) {
      setFormError("Паролите не съвпадат");
      return;
    }
    if (!policy) return;

    dispatch(register({ email, password, firstName, lastName })).then((res) => {
      // след успешна регистрация обикновено чака email verification -> връщаме на login
      if (res.meta.requestStatus === "fulfilled") {
        setMode("login");
        setPassword("");
        setConfirmPassword("");
      }
    });
  };

  const isLoading = status === "loading";
  const displayError = formError || error;

  return (
    <section className="mx-auto max-w-md px-6 py-12">
      <div className="flex gap-2 rounded-full bg-[#eef4ec] p-1 mb-6">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 rounded-full py-2 text- font-bold ${mode === "login" ? "bg-[#0f2e1f] text-white" : "text-[#0f2e1f]/60"}`}
        >
          ВХОД
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`flex-1 rounded-full py-2 text- font-bold ${mode === "register" ? "bg-[#0f2e1f] text-white" : "text-[#0f2e1f]/60"}`}
        >
          РЕГИСТРАЦИЯ
        </button>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        key={mode}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-black/10 bg-white p-5"
      >
        <div className="flex flex-col gap-4">
          {displayError && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-[13px] text-red-700">
              {displayError}
            </div>
          )}

          {mode === "register" && (
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Име"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-1/2 rounded-lg border border-black/10 bg-[#f6f9f5] px-4 py-2.5 text- focus:outline-none"
              />
              <input
                type="text"
                placeholder="Фамилия"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-1/2 rounded-lg border border-black/10 bg-[#f6f9f5] px-4 py-2.5 text- focus:outline-none"
              />
            </div>
          )}

          <input
            type="email"
            placeholder="Имейл"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-black/10 bg-[#f6f9f5] px-4 py-2.5 text- focus:outline-none"
          />
          <input
            type="password"
            placeholder="Парола"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-lg border border-black/10 bg-[#f6f9f5] px-4 py-2.5 text- focus:outline-none"
          />

          {mode === "register" && (
            <>
              <input
                type="password"
                placeholder="Потвърди паролата"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-black/10 bg-[#f6f9f5] px-4 py-2.5 text- focus:outline-none"
              />

              <div
                onClick={() => setPolicy(!policy)}
                style={{ display: "flex", alignItems: "flex-start", gap: "8px", cursor: "pointer", userSelect: "none", marginTop: "4px" }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    minWidth: "20px",
                    borderRadius: "6px",
                    border: "2px solid #1e4d2b",
                    backgroundColor: policy ? "#1e4d2b" : "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "1px",
                  }}
                >
                  {policy && <span style={{ color: "white", fontSize: "12px", fontWeight: "900", lineHeight: 1 }}>✓</span>}
                </div>
                <span style={{ fontSize: "12px", lineHeight: "16px", color: "#0f2e1f" }}>
                  Приемам{" "}
                  <a href="/privacy-policy" onClick={(e) => e.stopPropagation()} style={{ fontWeight: 700, color: "#1e4d2b", textDecoration: "underline" }}>
                    Политика за поверителност
                  </a>{" "}
                  и{" "}
                  <a href="/terms" onClick={(e) => e.stopPropagation()} style={{ fontWeight: 700, color: "#1e4d2b", textDecoration: "underline" }}>
                    Общи условия
                  </a>
                </span>
              </div>
            </>
          )}

          {mode === "login" && (
            <div className="flex items-center justify-between">
              <div
                onClick={() => setRemember(!remember)}
                style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", userSelect: "none" }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "6px",
                    border: "2px solid #1e4d2b",
                    backgroundColor: remember ? "#1e4d2b" : "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {remember && <span style={{ color: "white", fontSize: "12px", fontWeight: "900", lineHeight: 1 }}>✓</span>}
                </div>
                <span style={{ fontSize: "12px", fontWeight: 500, color: "#0f2e1f" }}>Запомни ме</span>
              </div>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                style={{ fontSize: "12px", fontWeight: 700, color: "#1e4d2b" }}
              >
                Забравена парола?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || (mode === "register" && !policy)}
            className={`mt-2 w-full rounded-full py-3 text- font-black text-white uppercase transition ${
              isLoading
                ? "bg-[#1e4d2b]/60 cursor-wait"
                : policy || mode === "login"
                ? "bg-[#1e4d2b] hover:bg-[#0f2e1f]"
                : "bg-[#1e4d2b]/40 cursor-not-allowed"
            }`}
          >
            {isLoading ? "Моля, изчакай..." : mode === "login" ? "Влез" : "Създай профил"}
          </button>
        </div>
      </motion.form>
    </section>
  );
}