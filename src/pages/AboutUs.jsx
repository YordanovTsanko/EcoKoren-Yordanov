import { useSelector } from "react-redux";
import { motion } from "framer-motion";

export default function AboutUs() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      {/* HERO */}
      <div className="relative overflow-hidden rounded- sm:rounded-[2.5rem] bg-[#0f2e1f] p-6 sm:p-10 lg:p-14">
        <div className="absolute -right-20 -top-20 h- w- rounded-full bg-[#1e4d2b] blur-3xl opacity-60" />
        <div className="absolute -left-20 -bottom-20 h- w- rounded-full bg-[#1e4d2b] blur-3xl opacity-40" />

        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text- font-bold uppercase tracking-widest text-white/80 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#8fbc8f] animate-pulse" /> От 2018 насам
            </div>
            <h1 className="mt-4 text- sm:text-[44px] lg:text-[72px] font-black leading-[0.9] tracking-tight text-white">
              НЕ ПРОДАВАМЕ<br />
              <span className="text-[#8fbc8f]">СЕМЕНА.</span><br />
              ОТГЛЕЖДАМЕ<br />
              РЕКОЛТИ.
            </h1>
            <p className="mt-5 max-w- text- sm:text- leading-relaxed text-white/60">
              Започнахме в малка оранжерия с 3 табли разсад и една идея - качественото начало не трябва да е късмет. Днес зареждаме над 50 ферми и магазина, но все още сеем всяка партида на ръка.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="rounded-full bg-white px-4 py-2 text- font-black uppercase tracking-wide text-[#0f2e1f] cursor-pointer">КЪМ МАГАЗИНА</button>
              <button className="rounded-full border border-white/20 px-4 py-2 text- font-black uppercase tracking-wide text-white cursor-pointer">СВЪРЖИ СЕ С НАС</button>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-3">
                <div className="rounded-2xl bg-[#f6f9f5] p-4">
                  <p className="text- font-black text-[#0f2e1f]">50+</p>
                  <p className="text- font-bold uppercase tracking-wide text-[#0f2e1f]/50">Ферми и магазини</p>
                </div>
                <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-[#1e4d2b]">
                  <img src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400" className="h-full w-full object-cover opacity-80" alt="" />
                </div>
              </div>
              <div className="space-y-3 pt-6">
                <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-[#8fbc8f]">
                  <img src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400" className="h-full w-full object-cover" alt="" />
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <p className="text- font-black text-[#0f2e1f]">4.9/5</p>
                  <p className="text- font-bold uppercase tracking-wide text-[#0f2e1f]/50">Средна оценка</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VALUES */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { title: "Без пестициди", desc: "0% химия. Само био тор, слънце и чиста вода. Здрав корен от ден 1.", icon: "🌱" },
          { title: "Ръчно отгледан", desc: "Всяка табла до 100бр. Поливаме, пикираме и закаляваме на ръка.", icon: "🤲" },
          { title: "Готово за бизнес", desc: "Сортиран, опакован, на кашон и палет до обекта ти с фактура.", icon: "📦" },
        ].map((v, i) => (
          <motion.div key={i} initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1}} className="rounded-2xl border border-[#1e4d2b]/10 bg-[#f6f9f5] p-5 sm:p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0f2e1f] text-">{v.icon}</div>
            <h3 className="mt-4 text- font-black uppercase tracking-widest text-[#0f2e1f]">{v.title}</h3>
            <p className="mt-2 text- leading-relaxed text-[#0f2e1f]/60">{v.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* STORY LINE */}
      <div className="mt-6 grid gap-3 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl bg-white p-6 sm:p-8 border border-black/10">
          <div className="inline-flex rounded-full bg-[#eef4ec] px-3 py-1 text- font-black uppercase tracking-widest text-[#1e4d2b]">Нашата история</div>
          <h2 className="mt-4 text- sm:text- font-black leading-[0.9] tracking-tight text-[#0f2e1f]">ЗАПОЧНА ОТ<br />ПРАЗНА ЛЕХА.</h2>
          <div className="mt-6 flex flex-col gap-4 text- leading-relaxed text-[#0f2e1f]/70">
            <p>През 2018 не намирахме здрав разсад никъде. Всичко беше изтеглено и болно. Започнахме да гледаме сами в двора.</p>
            <p>Първите бяха в кофички от кисело мляко. Давахме на съседи. Съседите искаха още, още и още.</p>
            <div className="mt-2 grid grid-cols-3 gap-3 border-t border-black/10 pt-6">
              <div><p className="text- font-black text-[#0f2e1f]">2018</p><p className="text- uppercase font-bold text-black/40">Началото</p></div>
              <div><p className="text- font-black text-[#0f2e1f]">2020</p><p className="text- uppercase font-bold text-black/40">1-ва оранжерия</p></div>
              <div><p className="text- font-black text-[#0f2e1f]">2026</p><p className="text- uppercase font-bold text-black/40">Днес</p></div>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-[#1e4d2b]/10 bg-[#f6f9f5] p-1">
          <div className="grid h-full grid-cols-2 gap-1 rounded- overflow-hidden">
            <img src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=500" className="h-full w-full object-cover" alt="" />
            <div className="flex flex-col gap-1">
              <img src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500" className="h-1/2 w-full object-cover" alt="" />
              <div className="flex h-1/2 items-center justify-center bg-[#0f2e1f] p-6 text-center">
                <p className="text- font-bold leading-snug text-white/90">"Не продаваме семена за всички. Продаваме за тези, които искат реколта."</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PROCESS */}
      <div className="mt-6 rounded-2xl border border-black/10 bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text- font-black uppercase tracking-widest text-[#0f2e1f]">Как го правим</h2>
          <span className="text- font-bold uppercase tracking-wide text-black/30">3 стъпки • 0 компромис</span>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-3 relative">
          <div className="absolute left-[10%] right-[10%] top-6 hidden h-px bg-[#1e4d2b]/10 sm:block" />
          {[
            { n:"01", t:"Сеем", d:"Семена реколта 2026, торф и перлит. Следим всяка партида." },
            { n:"02", t:"Отглеждаме", d:"На светло, без форсиране. 6-8 седмици до здрав корен." },
            { n:"03", t:"Зареждаме", d:"Директно от оранжерията, на кашон/палет с фактура и гаранция." },
          ].map((s) => (
            <div key={s.n} className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0f2e1f] text- font-black text-white">{s.n}</div>
              <h4 className="mt-4 text- font-black uppercase tracking-wide text-[#0f2e1f]">{s.t}</h4>
              <p className="mt-1.5 text- leading-relaxed text-[#0f2e1f]/60">{s.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-6 flex flex-col items-center justify-between gap-6 rounded-2xl bg-[#1e4d2b] p-6 sm:flex-row sm:p-8">
        <div>
          <h3 className="text- sm:text- font-black uppercase tracking-wide text-white">Ела да видиш разсада.</h3>
          <p className="mt-1 text- text-white/60">Оранжерията ни е отворена всеки петък. Безплатни проби.</p>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <div className="flex-1 sm:flex-none rounded-full bg-white/10 px-5 py-3 text- font-bold text-white">София, Божурище</div>
        </div>
      </div>
    </section>
  );
}