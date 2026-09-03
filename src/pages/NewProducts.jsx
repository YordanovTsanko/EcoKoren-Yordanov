import { useSelector } from "react-redux";
import { motion } from "framer-motion";

export default function NewProducts() {
  const products = useSelector((s) => s.products?.products || []);

  const newItems = products.length
    ? products.slice(0, 8)
    : Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        name: `New Ritual ${i + 1}`,
        price: (12.9 + i * 3).toFixed(2),
        oldPrice: (18.9 + i * 3).toFixed(2),
        image:
          "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500",
        tag: i === 0 ? "NEW DROP" : i === 1 ? "LIMITED" : "NEW",
      }));

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      {/* HERO */}
      <div className="relative overflow-hidden rounded- sm:rounded- bg-[#f6f9f5] border border-[#1e4d2b]/10 p-6 sm:p-10">
        <div className="absolute -right-20 -top-20 h- w- rounded-full bg-[#8fbc8f]/30 blur-" />

        <div className="relative flex flex-col lg:flex-row justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#0f2e1f] px-3 py-1 text- font-black uppercase tracking-widest text-white">
              <span className="h-2 w-2 rounded-full bg-[#8fbc8f] animate-pulse" />{" "}
              8 Нови продукта тази седмица
            </div>
            <h1 className="mt-4 text-[44px] sm:text-[72px] font-black leading-[0.9] tracking-tight text-[#0f2e1f]">
              НОВО
              <br />
              <span className="text-[#1e4d2b]">ЗАРЕЖДАНЕ</span>
            </h1>
            <p className="mt-4 max-w- text- leading-relaxed text-[#0f2e1f]/60">
              Семена с висока кълняемост, здрав разсад и готови продукти за
              фирми.
            </p>
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white p-3">
        <div className="flex flex-wrap gap-2">
          {["Всички", "Семена", "Разсад", "Продукти"].map((f, i) => (
            <button
              key={f}
              className={`rounded-full cursor-pointer px-4 py-2 text- font-black uppercase tracking-wide transition ${i === 0 ? "bg-[#0f2e1f] text-white" : "bg-[#f6f9f5] text-[#0f2e1f]/60 hover:bg-[#0f2e1f] hover:text-white"}`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="text- font-bold text-black/30">
          {newItems.length} продукта
        </div>
      </div>

      {/* GRID */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {newItems.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white p-2.5"
          >
            <div className="absolute left-3 top-3 z-10 flex gap-1.5">
              <span className="rounded-full bg-[#0f2e1f] px-2.5 py-1 text- font-black uppercase tracking-widest text-white">
                {item.tag || "NEW"}
              </span>
              {i < 2 && (
                <span className="rounded-full bg-[#8fbc8f] px-2.5 py-1 text- font-black uppercase tracking-widest text-[#0f2e1f]">
                  -20%
                </span>
              )}
            </div>

            <div className="overflow-hidden rounded-xl bg-[#f6f9f5]">
              <img
                src={item.image}
                alt={item.name}
                className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>

            <div className="p-2.5">
              <p className="line-clamp-1 text- font-bold text-[#0f2e1f]">
                {item.name}
              </p>
              <p className="mt-0.5 text- uppercase tracking-wide text-black/40">
                250ml • Веган
              </p>

              <div className="mt-2.5 flex items-end justify-between">
                <div className="flex flex-col">
                  <span className="text- font-black leading-none text-[#1e4d2b]">
                    €{Number(item.price || 19.9).toFixed(2)}
                  </span>
                  <span className="mt-0.5 text- leading-none line-through text-black/30">
                    €{item.oldPrice || "24.90"}
                  </span>
                </div>
                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0f2e1f] text- font-black text-white transition hover:bg-[#1e4d2b] active:scale-95">
                  +
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* BOTTOM BANNER */}
      <div className="rounded-2xl border border-[#1e4d2b]/10 mt-6 bg-[#f6f9f5] p-5">
        <p className="text- font-black uppercase tracking-widest text-[#0f2e1f]/40">
          Защо новото е по-добро?
        </p>
        <div className="mt-3 flex flex-col gap-2.5 text-">
          <div className="flex gap-2">
            <span className="text-[#1e4d2b]">✓</span>
            <span className="text-[#0f2e1f]/70">
              <b>Старият разсад се къса при засаждане</b> - Новият не, засажда
              се директно в торфени саксии
            </span>
          </div>
          <div className="flex gap-2">
            <span className="text-[#1e4d2b]">✓</span>
            <span className="text-[#0f2e1f]/70">
              <b>Старото семе не пониква равномерно</b> - Новото е реколта 2026,
              95% кълняемост
            </span>
          </div>
          <div className="flex gap-2">
            <span className="text-[#1e4d2b]">✓</span>
            <span className="text-[#0f2e1f]/70">
              <b>Старите продукти искаха чистене</b> - Новите са сортирани и
              опаковани за директна продажба
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
