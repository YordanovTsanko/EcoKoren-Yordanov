import { useSelector } from "react-redux";
import { motion } from "framer-motion";

export default function Promotions() {
  const products = useSelector((s) => s.products?.products || []);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      {/* HERO */}
      <div className="relative overflow-hidden rounded- bg-[#0f2e1f] p-6 sm:p-10">
        <div className="absolute -right-20 -top-20 h- w- rounded-full bg-[#1e4d2b] blur-3xl opacity-60" />
        <div className="absolute left-10 -bottom-32 h- w- rounded-full bg-[#8fbc8f]/15 blur-3xl" />
        ```jsx
        <div className="relative flex flex-col lg:flex-row lg:items-center gap-10">
          {/* ЛЯВО - твоя размер */}
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#8fbc8f] px-3 py-1 text-sm font-black uppercase tracking-widest text-[#0f2e1f]">
              🔥 Само тази седмица
            </div>
            <h1 className="mt-4 text-[44px] md:text-[72px] sm:text- font-black leading-[0.9] tracking-tight text-white">
              -30% НА
              <br />
              <span className="text-[#8fbc8f]">ВСИЧКО +</span>
              <br />
              ПОДАРЪК
            </h1>
            <p className="mt-4 max-w- text- leading-relaxed text-white/60">
              Безплатна доставка с код:{" "}
              <span className="font-black text-white">EKOFREE2K26</span>
            </p>

            <div className="mt-6 flex gap-2">
              {[
                { v: "02", l: "дни" },
                { v: "14", l: "часа" },
                { v: "33", l: "мин" },
                { v: "08", l: "сек" },
              ].map((t) => (
                <div
                  key={t.l}
                  className="rounded-xl bg-white/10 backdrop-blur border border-white/10 px-3.5 py-2 text-center min-w-"
                >
                  <p className="text- font-black leading-none text-white">
                    {t.v}
                  </p>
                  <p className="mt-1 text- font-bold uppercase tracking-widest text-white/40">
                    {t.l}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ДЯСНО - 3 снимки, които се преливат с фона */}
          <div className="relative w-full lg:w-[52%] h-[360px] sm:h-[430px] lg:h-[500px]">
            {/* меко зелено сияние зад изображенията */}
            <div className="absolute inset-0 bg-[#8fbc8f]/10 blur-3xl rounded-full scale-75" />

            {/* Снимка 1 - РАЗСАД */}
            <div
              className="
        absolute left-0 top-10
        w-[55%] h-[78%]
        overflow-hidden
        rounded-[2rem]
        rotate-[-4deg]
        shadow-2xl
      "
              style={{
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, black 10%, black 88%, transparent 100%), linear-gradient(to right, transparent 0%, black 10%, black 92%, transparent 100%)",
                WebkitMaskComposite: "source-in",
                maskImage:
                  "linear-gradient(to bottom, transparent 0%, black 10%, black 88%, transparent 100%), linear-gradient(to right, transparent 0%, black 10%, black 92%, transparent 100%)",
                maskComposite: "intersect",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=1000"
                alt="Разсад"
                className="h-full w-full object-cover scale-110"
              />
            </div>

            {/* Снимка 2 - СЕМЕНА */}
            <div
              className="
        absolute left-[24%] top-0
        w-[50%] h-[82%]
        overflow-hidden
        rounded-[2rem]
        rotate-[2deg]
        shadow-2xl
        z-10
      "
              style={{
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%), linear-gradient(to right, transparent 0%, black 8%, black 94%, transparent 100%)",
                WebkitMaskComposite: "source-in",
                maskImage:
                  "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%), linear-gradient(to right, transparent 0%, black 8%, black 94%, transparent 100%)",
                maskComposite: "intersect",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1000"
                alt="Семена"
                className="h-full w-full object-cover scale-110"
              />
            </div>

            {/* Снимка 3 - ГОТОВИ ПРОДУКТИ */}
            <div
              className="
        absolute right-0 bottom-0
        w-[54%] h-[72%]
        overflow-hidden
        rounded-[2rem]
        rotate-[4deg]
        shadow-2xl
        z-20
      "
              style={{
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, black 8%, black 90%, transparent 100%), linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
                WebkitMaskComposite: "source-in",
                maskImage:
                  "linear-gradient(to bottom, transparent 0%, black 8%, black 90%, transparent 100%), linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
                maskComposite: "intersect",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000"
                alt="Готови продукти"
                className="h-full w-full object-cover scale-110"
              />
            </div>

            {/* допълнително преливане към фона */}
            <div className="pointer-events-none absolute inset-0 z-30">
              <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0f2e1f] to-transparent" />
              <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#0f2e1f] to-transparent" />
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0f2e1f] to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0f2e1f] to-transparent" />
            </div>
          </div>
        </div>
        ```
      </div>
      {/* PRODUCTS ON PROMO */}
      <div className="mt-6 rounded-2xl border border-black/10 bg-white p-5 sm:p-7">
        <div className="flex items-center justify-between">
          <h2 className="text- font-black uppercase tracking-widest text-[#0f2e1f]">
            Продукти на промо
          </h2>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-[#f6f9f5] px-3 py-1 text- font-bold text-[#0f2e1f]/60">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />{" "}
              12 продукта на -30%
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(products.slice(0, 8).length
            ? products.slice(0, 8)
            : Array.from({ length: 8 }).map((_, i) => ({
                id: i,
                name: `Продукт ${i + 1}`,
                price: 29.9,
                image:
                  "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400",
              }))
          ).map((item) => (
            <div
              key={item.id}
              className="group relative rounded-xl border border-black/10 bg-[#f6f9f5] p-2"
            >
              <div className="absolute left-2 top-2 z-10 rounded-full bg-[#1e4d2b] px-2 py-0.5 text- font-black text-white">
                -30%
              </div>
              <img
                src={item.image}
                alt={item.name}
                className="aspect-square w-full rounded-lg object-cover"
              />
              <div className="p-2">
                <p className="line-clamp-1 text- font-bold text-[#0f2e1f]">
                  {item.name}
                </p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text- font-black text-[#1e4d2b]">
                    € {(item.price * 0.7).toFixed(2)}
                  </span>
                  <span className="text- line-through text-black/30">
                    € {item.price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3 PROMO CARDS */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {[
          {
            title: "Безплатна доставка",
            desc: "За поръчки над € 100",
            color: "bg-[#f6f9f5]",
            badge: "Най-популярно",
          },
          {
            title: "2+1 подарък",
            desc: "За всички видове семена",
            color: "bg-white",
            badge: "До края на месеца",
          },
        ].map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className={`rounded-2xl border border-[#1e4d2b]/10 ${p.color} p-5`}
          >
            <span className="inline-block rounded-full bg-[#0f2e1f] px-2.5 py-1 text- font-black uppercase tracking-widest text-white">
              {p.badge}
            </span>
            <h3 className="mt-3 text- font-black leading-tight text-[#0f2e1f]">
              {p.title}
            </h3>
            <p className="mt-1 text- text-[#0f2e1f]/60">{p.desc}</p>
            <button className="mt-4 text- font-black uppercase tracking-wide text-[#1e4d2b]">
              Виж повече →
            </button>
          </motion.div>
        ))}
      </div>
      {/* COUPON */}

      <div className="rounded-2xl border border-[#1e4d2b]/10 bg-[#8fbc8f]/20 mt-6 p-6 flex flex-col justify-center">
        <p className="text- font-black uppercase tracking-wide text-[#0f2e1f]">
          Абонирай се и вземи -10%
        </p>
        <p className="mt-1 text- text-[#0f2e1f]/60">Само за нови абонати.</p>
        <div className="mt-4 flex gap-2">
          <input
            placeholder="твоя имейл"
            className="flex-1 rounded-full border border-[#1e4d2b]/10 bg-white px-4 py-2.5 text- focus:outline-none"
          />
          <button className="rounded-full cursor-pointer bg-[#0f2e1f] px-5 py-2.5 text- font-black uppercase text-white">
            ОК
          </button>
        </div>
      </div>
    </section>
  );
}
