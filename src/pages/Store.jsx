import { useState, useMemo, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORY_LABELS = {
  all: "Всички",
  readyToUse: "Готови за употреба",
  seeds: "Семена",
  seedlings: "Разсад",
  tools: "Инструменти",
  soil: "Почви и субстрати",
  fertilizers: "Торове",
  pots: "Саксии",
  decor: "Декорация",
};
const t = (key) => CATEGORY_LABELS[key] || CATEGORY_LABELS[key?.toLowerCase()] || key;

function CustomDropdown({ value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current &&!ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} className="relative w-">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between gap-3 rounded-full border border-black/10 bg-white px-4 py-2.5 text- font-black uppercase tracking-wide text-[#0f2e1f]">
        <span className="truncate">{selected?.label}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" className={`shrink-0 transition-transform ${open? "rotate-180":""}`} fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:6}} className="absolute left-0 right-0 top-[calc(100%+8px)] z-[100] overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_20px_40px_rgba(0,0,0,0.15)]">
            {options.map(o => (
              <button key={o.value} onClick={() => { onChange(o.value); setOpen(false); }} className={`flex w-full items-center justify-between px-4 py-3 text-left text- font-bold ${value===o.value? "bg-[#0f2e1f] text-white" : "text-[#0f2e1f]/70 hover:bg-[#f6f9f5]"}`}>
                <span>{o.label}</span>{value===o.value && <span>✓</span>}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Store() {
  const productsRaw = useSelector((s) => s.products?.products || []);
  const products = productsRaw.length? productsRaw : Array.from({length:12}).map((_,i)=>({
    id:i, name:`Ritual ${i+1}`, category: ["readyToUse","seeds","tools"][i%3], price: 9.9 + i*3.5, image:"https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500", inStock: true
  }));

  const [cat, setCat] = useState("all");
  const [maxPrice, setMaxPrice] = useState(60);
  const [sort, setSort] = useState("new");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const categories = ["all",...Array.from(new Set(products.map(p=>p.category)))];
  const filtered = useMemo(()=>{
    let f=[...products];
    if(cat!=="all") f=f.filter(p=>p.category===cat);
    f=f.filter(p=>Number(p.price)<=maxPrice);
    if(inStockOnly) f=f.filter(p=>p.inStock!==false);
    if(sort==="low") f.sort((a,b)=>a.price-b.price);
    if(sort==="high") f.sort((a,b)=>b.price-a.price);
    return f;
  },[products,cat,maxPrice,sort,inStockOnly]);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-10">
      {/* HEADER - без overflow-hidden за да не реже dropdown-a */}
      <div className="relative rounded- border border-[#1e4d2b]/10 bg-[#f6f9f5] px-5 py-6 sm:px-8 sm:py-7">
        <div className="absolute left-0 top-0 h-full w- bg-[#1e4d2b] rounded-l-" />
        <div className="flex flex-wrap items-center justify-between gap-4 pl-3">
          <h1 className="text- sm:text- font-black uppercase tracking-[0.14em] text-[#0f2e1f]">Магазин</h1>
          <div className="flex items-center gap-2">
            <CustomDropdown value={sort} onChange={setSort} options={[
              {value:"new", label:"Най-нови"},
              {value:"low", label:"Цена: Ниска → Висока"},
              {value:"high", label:"Цена: Висока → Ниска"},
            ]} />
            <button onClick={()=>setShowFilters(!showFilters)} className="lg:hidden rounded-full bg-[#0f2e1f] px-4 py-2.5 text- font-black uppercase text-white">Филтри</button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr] lg:items-start">
        {/* ЛЯВ ФИЛТЪР - НЕ Е ПИПАН */}
        <div className={`${showFilters? "block" : "hidden"} lg:block space-y-3 lg:sticky lg:top-24`}>
          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <h3 className="text- font-black uppercase tracking-widest text-[#0f2e1f]">Категория</h3>
            <div className="mt-3 flex flex-col gap-1.5">
              {categories.map((c)=>(
                <button key={c} onClick={()=>setCat(c)} className={`flex items-center justify-between rounded-full px-3 py-2 text- font-bold transition ${cat===c? "bg-[#0f2e1f] text-white" : "bg-[#f6f9f5] text-[#0f2e1f]/60 hover:bg-[#0f2e1f]/10"}`}>
                  <span>{t(c)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <h3 className="text- font-black uppercase tracking-widest text-[#0f2e1f]">Цена до €{maxPrice}</h3>
            <input type="range" min={10} max={60} value={maxPrice} onChange={(e)=>setMaxPrice(Number(e.target.value))} className="mt-4 w-full accent-[#1e4d2b]" />
            <div className="mt-2 flex justify-between text- font-bold text-black/40"><span>€10</span><span>€60</span></div>

            <div className="mt-5 flex items-center gap-2 cursor-pointer select-none" onClick={()=>setInStockOnly(!inStockOnly)}>
              <div style={{ width:'20px', height:'20px', borderRadius:'6px', border:'2px solid #1e4d2b', backgroundColor: inStockOnly? '#1e4d2b' : '#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>
                {inStockOnly && <span style={{color:'white', fontSize:'12px', fontWeight:900, lineHeight:1}}>✓</span>}
              </div>
              <span className="text- font-medium text-[#0f2e1f]">Само налични</span>
            </div>
          </div>

          <div className="rounded-2xl bg-[#0f2e1f] p-5 text-white">
            <p className="text- font-black uppercase tracking-widest text-white/40">Промо код</p>
            <p className="mt-2 text- font-black tracking-widest">RITUAL10</p>
            <p className="mt-1 text- text-white/50">-10% на първа поръчка над €25</p>
          </div>
        </div>

        {/* ПРОДУКТИ - фикс за баджа */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {filtered.map((item,i)=>(
            <motion.div key={item.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.02}} className="group relative rounded-2xl border border-black/10 bg-white p-2.5">
              <div className="relative overflow-hidden rounded-xl bg-[#f6f9f5]">
                <div className="absolute left-2 top-2 z-10 rounded-full bg-[#0f2e1f] px-2.5 py-1 text- font-black uppercase tracking-widest text-white leading-none">
                  {t(item.category)}
                </div>
                <img src={item.image} alt={item.name} className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-2.5">
                <p className="line-clamp-1 text- font-bold text-[#0f2e1f]">{item.name}</p>
                <div className="mt-1.5 flex items-end justify-between">
                  <p className="text- font-black leading-none text-[#1e4d2b]">€{Number(item.price).toFixed(2)}</p>
                  <button className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0f2e1f] text-white">+</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}