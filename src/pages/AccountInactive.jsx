import { useDispatch, useSelector } from "react-redux";
import { fetchMe } from "../store/slices/usersSlice";
import { logout } from "../store/slices/authSlice";

export default function AccountInactive() {
  const dispatch = useDispatch();
  const meError = useSelector((s) => s.users.meError);
  const meStatus = useSelector((s) => s.users.meStatus);
  const isChecking = meStatus === "loading";

  const handleRetry = () => dispatch(fetchMe());
  const handleLogout = () => dispatch(logout());

  return (
    <section className="mx-auto max-w-md px-6 py-16 text-center">
      <div className="rounded-xl border border-black/10 bg-white p-8">
        <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-amber-50 grid place-items-center text-amber-600 text-2xl font-black">
          !
        </div>

        <h1 className="text-lg font-black text-[#0f2e1f] mb-2">Акаунтът не е активен</h1>

        <p className="text-[14px] text-[#0f2e1f]/70 mb-6">
          {meError || "Моля, потвърди имейла си, за да продължиш."}
        </p>

        <p className="text-[13px] text-[#0f2e1f]/60 mb-6">
          Провери пощата си за линк за потвърждение. Ако вече потвърди
          имейла си, натисни „Провери отново“.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleRetry}
            disabled={isChecking}
            className="w-full rounded-full py-3 font-black text-white uppercase transition bg-[#1e4d2b] hover:bg-[#0f2e1f] disabled:opacity-60 disabled:cursor-wait"
          >
            {isChecking ? "Проверка..." : "Провери отново"}
          </button>
          <button
            onClick={handleLogout}
            className="w-full rounded-full cursor-pointer py-3 font-bold uppercase text-[#1e4d2b] border border-[#1e4d2b]/30 hover:bg-[#eef4ec] transition"
          >
            Изход
          </button>
        </div>
      </div>
    </section>
  );
}