import { useState } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'

export default function Contacts() {
  const [policy, setPolicy] = useState(false)

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      {/* HERO */}
      <div className="relative overflow-hidden rounded- sm:rounded- bg-[#0f2e1f] p-6 sm:p-10 lg:p-12">
        <div className="absolute -right-20 -top-20 h- w- rounded-full bg-[#1e4d2b] blur- opacity-60" />
        <div className="absolute -left-20 -bottom-20 h- w- rounded-full bg-[#1e4d2b] blur- opacity-30" />

        <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text- font-bold uppercase tracking-widest text-white/80">
              <span className="h-2 w-2 rounded-full bg-[#8fbc8f] animate-pulse" /> Отговаряме до 2 часа
            </div>
            <h1 className="mt-4 text-[44px] md:text-[72px] font-black leading-[0.9] tracking-tight text-white">
              ПИШИ НИ.<br />
              <span className="text-[#8fbc8f]">ИДВАМЕ</span><br />
              НА ПОМОЩ.
            </h1>
            <p className="mt-5 max-w- text- leading-relaxed text-white/60">
              Имаш въпрос за продукт, поръчка или просто искаш съвет? Пиши ни. Реален човек чете всяко съобщение.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {[
              { label: "Адрес", value: "София, ул. Цар Асен 12", sub: "Пн-Пт 10:00-19:00", icon: "📍" },
              { label: "Телефон", value: "+359 88 123 4567", sub: "Отговаряме веднага", icon: "📞" },
              { label: "Имейл", value: "hello@brand.bg", sub: "Отговор до 2ч", icon: "✉️" },
            ].map((c, i) => (
              <div key={i} className="rounded-2xl bg-white/10 backdrop-blur border border-white/10 p-4 flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-">{c.icon}</div>
                <div>
                  <p className="text- font-black uppercase tracking-widest text-white/40">{c.label}</p>
                  <p className="text- font-bold text-white">{c.value}</p>
                  <p className="text- text-white/50">{c.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FORM + INFO */}
      <div className="mt-6 grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
        {/* FORM */}
        <motion.div initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text- font-black uppercase tracking-widest text-[#0f2e1f]">Изпрати съобщение</h2>
            <span className="text- font-bold uppercase tracking-wide text-black/30">Средно 47 мин отговор</span>
          </div>

          <div className="mt-6 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text- font-bold uppercase tracking-wide text-[#0f2e1f]/50">Име</label>
                <input placeholder="Как да ти казваме?" className="w-full rounded-xl border border-black/10 bg-[#f6f9f5] px-4 py-3 text- focus:outline-none focus:border-[#1e4d2b]" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text- font-bold uppercase tracking-wide text-[#0f2e1f]/50">Имейл</label>
                <input placeholder="you@email.com" className="w-full rounded-xl border border-black/10 bg-[#f6f9f5] px-4 py-3 text- focus:outline-none focus:border-[#1e4d2b]" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text- font-bold uppercase tracking-wide text-[#0f2e1f]/50">Относно</label>
              <div className="flex flex-wrap gap-2">
                {["Поръчка","Продукт","Връщане","Друго"].map((t) => (
                  <button key={t} className="rounded-full bg-[#eef4ec] px-4 py-1.5 text- font-bold text-[#0f2e1f]/70 hover:bg-[#0f2e1f] hover:text-white transition">{t}</button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text- font-bold uppercase tracking-wide text-[#0f2e1f]/50">Съобщение</label>
              <textarea rows={4} placeholder="Разкажи ни..." className="w-full resize-none rounded-xl border border-black/10 bg-[#f6f9f5] px-4 py-3 text- focus:outline-none focus:border-[#1e4d2b]" />
            </div>

            <div onClick={() => setPolicy(!policy)} className="flex items-start gap-2 cursor-pointer select-none">
              <div style={{ width:'20px', height:'20px', minWidth:'20px', borderRadius:'6px', border:'2px solid #1e4d2b', backgroundColor: policy? '#1e4d2b' : '#fff', display:'flex', alignItems:'center', justifyContent:'center', marginTop:'2px' }}>
                {policy && <span style={{color:'white', fontSize:'12px', fontWeight:900, lineHeight:1}}>✓</span>}
              </div>
              <span className="text- leading- text-[#0f2e1f]/70">Съгласен съм данните ми да бъдат обработени според <a href="/privacy-policy" onClick={(e)=>e.stopPropagation()} className="font-bold text-[#1e4d2b] underline">Политиката за поверителност</a></span>
            </div>

            <button disabled={!policy} className={`mt-2 w-full rounded-full py-3.5 text- font-black uppercase tracking-wide text-white transition ${policy? "bg-[#1e4d2b] hover:bg-[#0f2e1f]" : "bg-[#1e4d2b]/40 cursor-not-allowed"}`}>
              Изпрати съобщение
            </button>
          </div>
        </motion.div>

        {/* MAP + HOURS */}
        <div className="flex flex-col gap-3">
          <div className="relative overflow-hidden rounded-2xl border border-[#1e4d2b]/10 bg-[#f6f9f5] p-1.5">
            <div className="relative aspect-[4/3] lg:aspect-[4/2.8] overflow-hidden rounded- bg-[#0f2e1f]">
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800" className="h-full w-full object-cover opacity-60" alt="map" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-2xl bg-white px-5 py-4 shadow-xl">
                  <p className="text- font-black uppercase tracking-widest text-black/40">Ние сме тук</p>
                  <p className="mt-1 text- font-bold text-[#0f2e1f]">ул. Цар Асен 12, София</p>
                  <a href="https://maps.google.com" target="_blank" className="mt-2 inline-block rounded-full bg-[#0f2e1f] px-3 py-1 text- font-bold uppercase text-white">Отвори в Maps</a>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-black/10 bg-white p-5">
              <p className="text- font-black uppercase tracking-widest text-black/30">Работно време</p>
              <div className="mt-3 flex flex-col gap-1.5 text-">
                <div className="flex justify-between"><span className="text-black/50">Пн-Пт</span><span className="font-bold text-[#0f2e1f]">10:00-19:00</span></div>
                <div className="flex justify-between"><span className="text-black/50">Събота</span><span className="font-bold text-[#0f2e1f]">11:00-17:00</span></div>
                <div className="flex justify-between"><span className="text-black/50">Неделя</span><span className="font-bold text-[#1e4d2b]">Затворено</span></div>
              </div>
            </div>
            <div className="rounded-2xl bg-[#0f2e1f] p-5 text-white">
              <p className="text- font-black uppercase tracking-widest text-white/40">Последвай ни</p>
              <div className="mt-3 flex flex-col gap-2">
                <a href="#" className="flex items-center justify-between rounded-full bg-white/10 px-3 py-2 text- font-bold hover:bg-white hover:text-[#0f2e1f] transition"><span>Instagram</span><span>↗</span></a>
                <a href="#" className="flex items-center justify-between rounded-full bg-white/10 px-3 py-2 text- font-bold hover:bg-white hover:text-[#0f2e1f] transition"><span>Facebook</span><span>↗</span></a>
                <a href="#" className="flex items-center justify-between rounded-full bg-white/10 px-3 py-2 text- font-bold hover:bg-white hover:text-[#0f2e1f] transition"><span>TikTok</span><span>↗</span></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}