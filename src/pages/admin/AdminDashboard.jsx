import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiClock,
  FiGrid,
  FiLayers,
  FiTrendingUp,
  FiTruck,
  FiAlertCircle,
  FiActivity,
} from "react-icons/fi";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  AreaChart,
  Area,
  LineChart,
  Line,
  Legend,
} from "recharts";

const COLORS = {
  primary: "#1e4d2b",
  primaryLight: "#2a6b3c",
  primarySoft: "#eef4ec",
  inactive: "#dc2626",
  warning: "#f59e0b",
  blue: "#2563eb",
  grid: "#e7ece8",
  text: "#102f20",
  muted: "#718078",
};

const ZONE_COLORS = ["#1e4d2b", "#2a6b3c", "#4a9a5e", "#84b78f", "#c5dcc9"];

function StatCard({ title, value, subtext, icon, trend }) {
  return (
    <div className="rounded- border border-[#102f20]/8 bg-white p-5 shadow-[0_10px_30px_rgba(15,46,31,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text- font-bold uppercase tracking-[0.15em] text-[#102f20]/45">
            {title}
          </p>
          <p className="mt-2 text- font-black tracking-tight text-[#102f20] leading-none">
            {value}
          </p>
          {subtext && (
            <p className="mt-2 text-xs font-medium text-[#102f20]/50">
              {subtext}
            </p>
          )}
          {trend && (
            <p className={`mt-2 inline-flex text- font-bold px-2 py-1 rounded-full ${trend.positive? 'bg-[#eef4ec] text-[#1e4d2b]' : 'bg-red-50 text-red-600'}`}>
              {trend.value}
            </p>
          )}
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#eef4ec] text-[#1e4d2b]">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const stats = useMemo(() => ({
    totalLocations: 1680,
    occupiedLocations: 1312,
    occupancyRate: 78.1,
    inboundToday: 48,
    outboundToday: 62,
    movementsToday: 110,
    pendingShipments: 23,
    avgDwellDays: 12.4,
  }), []);

  const weeklyFlow = useMemo(() => [
    { day: "Пон", inbound: 42, outbound: 38 },
    { day: "Вто", inbound: 55, outbound: 48 },
    { day: "Сря", inbound: 38, outbound: 62 },
    { day: "Чет", inbound: 71, outbound: 54 },
    { day: "Пет", inbound: 64, outbound: 71 },
    { day: "Съб", inbound: 28, outbound: 35 },
    { day: "Нед", inbound: 12, outbound: 18 },
  ], []);

  const occupancyByZone = useMemo(() => [
    { name: "Зона A - Бързооборотни", value: 420, fill: ZONE_COLORS[0] },
    { name: "Зона B - Палетни", value: 380, fill: ZONE_COLORS[1] },
    { name: "Зона C - Дребни", value: 292, fill: ZONE_COLORS[2] },
    { name: "Зона D - Опасни", value: 140, fill: ZONE_COLORS[3] },
    { name: "Зона E - Входен буфер", value: 80, fill: ZONE_COLORS[4] },
  ], []);

  const hourlyActivity = useMemo(() => [
    { hour: "06:00", moves: 4 }, { hour: "08:00", moves: 18 },
    { hour: "10:00", moves: 32 }, { hour: "12:00", moves: 28 },
    { hour: "14:00", moves: 36 }, { hour: "16:00", moves: 24 },
    { hour: "18:00", moves: 12 }, { hour: "20:00", moves: 3 },
  ], []);

  const orderStatus = useMemo(() => [
    { name: "Готови за експедиция", value: 23 },
    { name: "Комисиониране", value: 14 },
    { name: "Забавени", value: 5 },
    { name: "Приети", value: 31 },
  ], []);

  const turnover = useMemo(() => [
    { month: "Апр", turnover: 2.1 },
    { month: "Май", turnover: 2.4 },
    { month: "Юни", turnover: 2.2 },
    { month: "Юли", turnover: 2.8 },
    { month: "Авг", turnover: 3.1 },
    { month: "Сеп", turnover: 2.9 },
  ], []);

  const recentMovements = useMemo(() => [
    { id: "MV-8841", type: "inbound", text: "Приемане PAL-8841", zone: "Зона A • Рампа 2", time: "преди 12 мин", color: "text-[#1e4d2b]" },
    { id: "MV-8840", type: "outbound", text: "Експедиция ORD-1023", zone: "Зона B • 14 палета", time: "преди 28 мин", color: "text-blue-600" },
    { id: "MV-8839", type: "transfer", text: "Трансфер A-12 -> C-04", zone: "Вътрешно преместване", time: "преди 1 ч", color: "text-amber-600" },
    { id: "MV-8838", type: "inbound", text: "Приемане PAL-8839", zone: "Зона E • QC", time: "преди 2 ч", color: "text-[#1e4d2b]" },
    { id: "MV-8837", type: "alert", text: "Нисък праг - Зона D", zone: "Остават 12 свободни", time: "преди 3 ч", color: "text-red-600" },
  ], []);

  return (
    <section className="min-h-screen px-4 py-6 sm:px-6 lg:px-8 bg-[#f8faf8]">
      <div className="mx-auto w-full max-w-7xl">
        {/* HEADER */}
        <div className="mb-6">
          <div className="text- font-bold uppercase tracking-[0.2em] text-[#1e4d2b]/55">
            WMS / Склад
          </div>
          <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-[#102f20] sm:text-3xl">
                Здравей, Admin
              </h1>
              <p className="mt-1 text-sm text-[#102f20]/45">
                Заетост {stats.occupancyRate}% • {stats.occupiedLocations} от {stats.totalLocations} локации • Активност днес {stats.movementsToday}
              </p>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Поръчки днес"
            value={stats.movementsToday}
            subtext={`↑ ${stats.inboundToday} входящи • ↓ ${stats.outboundToday} изходящи`}
            icon={<FiActivity size={20} />}
            trend={{ value: "+5 спрямо вчера", positive: true }}
          />
          <StatCard
            title="Стойност на поръчките днес"
            value={`${stats.occupancyRate}%`}
            subtext={`${stats.occupiedLocations} / ${stats.totalLocations} локации`}
            icon={<FiGrid size={20} />}
            trend={{ value: "+€54 233,32 спрямо вчера", positive: true }}
          />
          <StatCard
            title="Чакащи разнос"
            value={stats.pendingShipments}
            subtext="5 забавени • 14 в комисиониране"
            icon={<FiTruck size={20} />}
            trend={{ value: "10 в изчазане", positive: false }}
          />
          <StatCard
            title="Среден престой"
            value={`${stats.avgDwellDays} дни`}
            subtext="Цел: < 14 дни • Оборот 2.9"
            icon={<FiClock size={20} />}
            trend={{ value: "-0.8 дни подобрение", positive: true }}
          />
        </div>

        {/* ROW 1 */}
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
          <div className="rounded- border border-[#102f20]/8 bg-white p-5 shadow-[0_10px_30px_rgba(15,46,31,0.05)] sm:p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-[#102f20]">Поток Входящи / Изходящи</h2>
                <p className="mt-1 text-xs text-[#102f20]/45 sm:text-sm">Последни 7 дни - палети</p>
              </div>
              <div className="flex gap-3 text- font-bold">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#1e4d2b]"/> Входящи</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#84b78f]"/> Изходящи</span>
              </div>
            </div>
            <div className="h-">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyFlow} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke={COLORS.grid} vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: COLORS.muted, fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: COLORS.muted, fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="inbound" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.15} strokeWidth={3} />
                  <Area type="monotone" dataKey="outbound" stroke="#84b78f" fill="#84b78f" fillOpacity={0.15} strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded- border border-[#102f20]/8 bg-white p-5 shadow-[0_10px_30px_rgba(15,46,31,0.05)] sm:p-6">
            <h2 className="text-lg font-black text-[#102f20]">Заетост по зони</h2>
            <p className="mt-1 text-xs text-[#102f20]/45 sm:text-sm">Разпределение на палетите</p>
            <div className="h- mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={occupancyByZone} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={65} outerRadius={105} paddingAngle={3}>
                    {occupancyByZone.map((e, i) => <Cell key={e.name} fill={ZONE_COLORS[i % ZONE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {occupancyByZone.slice(0,3).map((z,i) => (
                <div key={z.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{background: ZONE_COLORS[i]}}/><span className="font-semibold text-[#102f20]/70 truncate">{z.name}</span></div>
                  <span className="font-black text-[#102f20]">{z.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ROW 2 */}
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr_1fr]">
          <div className="rounded- border border-[#102f20]/8 bg-white p-5 shadow-[0_10px_30px_rgba(15,46,31,0.05)] sm:p-6">
            <h2 className="text-base font-black text-[#102f20]">Активност по часове</h2>
            <p className="mt-1 text-xs text-[#102f20]/45">Движения днес</p>
            <div className="h- mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyActivity} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke={COLORS.grid} vertical={false} />
                  <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: COLORS.muted, fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: COLORS.muted, fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="moves" fill={COLORS.primary} radius={[8,8,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded- border border-[#102f20]/8 bg-white p-5 shadow-[0_10px_30px_rgba(15,46,31,0.05)] sm:p-6">
            <h2 className="text-base font-black text-[#102f20]">Статус на поръчките</h2>
            <p className="mt-1 text-xs text-[#102f20]/45">WMS опашка</p>
            <div className="h-">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={orderStatus} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4}>
                    <Cell fill={COLORS.blue} /><Cell fill={COLORS.primary} /><Cell fill={COLORS.inactive} /><Cell fill={COLORS.grid} />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {orderStatus.map((s,i) => (
                <div key={s.name} className="flex justify-between text-xs"><span className="text-[#102f20]/60 font-medium">{s.name}</span><span className="font-black">{s.value}</span></div>
              ))}
            </div>
          </div>

          <div className="rounded- border border-[#102f20]/8 bg-white p-5 shadow-[0_10px_30px_rgba(15,46,31,0.05)] sm:p-6">
            <h2 className="text-base font-black text-[#102f20] flex items-center gap-2"><FiTrendingUp/> Коеф. на оборот</h2>
            <p className="mt-1 text-xs text-[#102f20]/45">Колко пъти се обръща склада</p>
            <div className="h- mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={turnover} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke={COLORS.grid} vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: COLORS.muted, fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: COLORS.muted, fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="turnover" stroke={COLORS.primary} strokeWidth={3} dot={{ r: 4, fill: COLORS.primary }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 rounded-xl bg-[#eef4ec] p-3 flex items-center gap-2 text-xs font-bold text-[#1e4d2b]">
              <FiLayers/> Висок оборот = ефективен склад. Цел &gt; 2.5
            </div>
          </div>
        </div>

        {/* RECENT MOVEMENTS */}
        <div className="mt-6 rounded- border border-[#102f20]/8 bg-white shadow-[0_10px_30px_rgba(15,46,31,0.05)]">
          <div className="flex items-center justify-between border-b border-[#102f20]/8 px-5 py-5 sm:px-6">
            <div>
              <h2 className="text-lg font-black text-[#102f20]">Последни движения</h2>
              <p className="mt-1 text-xs text-[#102f20]/45">Live feed от WMS - симулация</p>
            </div>
            <div className="flex items-center gap-2 text- font-bold text-[#1e4d2b]"><span className="h-2 w-2 animate-pulse rounded-full bg-green-500"/> LIVE</div>
          </div>
          <div className="divide-y divide-[#102f20]/6">
            {recentMovements.map((m) => (
              <div key={m.id} className="flex items-center gap-4 px-5 py-4 sm:px-6">
                <div className={`grid h-10 w-10 place-items-center rounded-xl ${m.type === 'inbound'? 'bg-[#eef4ec] text-[#1e4d2b]' : m.type === 'outbound'? 'bg-blue-50 text-blue-600' : m.type === 'alert'? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                  {m.type === 'inbound'? <FiLayers size={16}/> : m.type === 'outbound'? <FiTruck size={16}/> : m.type === 'alert'? <FiAlertCircle size={16}/> : <FiGrid size={16}/>}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-[#102f20]">{m.text} <span className="ml-2 text- font-mono text-[#102f20]/40">{m.id}</span></div>
                  <div className="mt-0.5 text-xs text-[#102f20]/40">{m.zone}</div>
                </div>
                <div className="text-right">
                  <div className={`text- font-bold ${m.color}`}>{m.type === 'inbound'? 'ПРИЕМ' : m.type === 'outbound'? 'ЕКСПЕДИЦИЯ' : m.type === 'alert'? 'АЛАРМА' : 'ТРАНСФЕР'}</div>
                  <div className="mt-0.5 text- text-[#102f20]/40">{m.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}