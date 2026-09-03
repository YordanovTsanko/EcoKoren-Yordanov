import { useSelector, useDispatch } from "react-redux";

export default function Cart() {
  const dispatch = useDispatch();
  const cartRaw = useSelector((s) => s.cart?.items || s.cart?.cart || []);
  const products = useSelector((s) => s.products?.products || []);

  const cart = cartRaw.map((item) => {
    if (item.product) return item;
    const full = products.find((p) => p.id === (item.id || item.productId));
    return full? {...full, quantity: item.quantity || 1 } : item;
  }).filter(Boolean);

  const total = cart.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 1), 0);

  if (cart.length === 0) {
    return (
      <section className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-md rounded-2xl border border-[#1e4d2b]/10 bg-[#f6f9f5] px-6 py-12 text-center">
          <p className="text- font-black uppercase tracking-wide text-[#0f2e1f]">Количката е празна</p>
          <p className="mt-2 text- text-[#0f2e1f]/60">Нямаш добавени продукти</p>
          <a href="/" className="mt-6 inline-block rounded-full bg-[#1e4d2b] px-6 py-2.5 text- font-black uppercase text-white">Към магазина</a>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-12">
      {/* HEADER */}
      <div className="mb-6 sm:mb-7 relative overflow-hidden rounded-xl border border-[#1e4d2b]/10 bg-[#f6f9f5] px-4 py-3.5">
        <div className="absolute left-0 top-0 h-full w- bg-[#1e4d2b]" />
        <div className="flex items-center justify-between gap-3 pl-3">
          <h1 className="text- sm:text- font-black uppercase tracking-[0.14em] text-[#0f2e1f]">Количка</h1>
          <span className="shrink-0 rounded-full bg-[#0f2e1f] px-3 py-1 text- sm:text- font-bold text-white">{cart.length} БР.</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        {/* ITEMS */}
        <div className="flex flex-col gap-3">
          {cart.map((item) => (
            <div key={item.id} className="flex gap-3 sm:gap-4 rounded-xl border border-black/10 bg-white p-3 sm:p-4">
              <img src={item.image} alt={item.name} className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-lg bg-[#f6f9f5] object-cover" />

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start gap-2">
                  <h3 className="line-clamp-2 flex-1 text- sm:text- font-bold leading-snug text-[#0f2e1f]">{item.name}</h3>
                  <button onClick={() => dispatch({ type: "cart/removeFromCart", payload: item.id })} className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black/5 text- leading-none text-black/40 hover:bg-black/10">×</button>
                </div>

                <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                  <span className="text- sm:text- font-black text-[#1e4d2b]">€ {(item.price || 0).toFixed(2)}</span>

                  <div className="flex items-center gap-1 rounded-full bg-[#eef4ec] p-1">
                    <button onClick={() => dispatch({ type: "cart/decrement", payload: item.id })} className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white text- font-black shadow-sm active:scale-95">−</button>
                    <span className="min-w- text-center text- sm:text- font-bold">{item.quantity || 1}</span>
                    <button onClick={() => dispatch({ type: "cart/increment", payload: item.id })} className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-[#0f2e1f] text- font-black text-white shadow-sm active:scale-95">+</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SUMMARY */}
        <div className="h-fit rounded-xl border border-[#1e4d2b]/10 bg-[#f6f9f5] p-4 sm:p-5 lg:sticky lg:top-24">
          <h2 className="text- sm:text- font-black uppercase tracking-[0.15em] text-[#0f2e1f]">Обобщение</h2>

          <div className="mt-4 flex flex-col gap-2.5">
            <div className="flex justify-between text-"><span className="text-[#0f2e1f]/50">Продукти</span><span className="font-bold text-[#0f2e1f]">€ {total.toFixed(2)}</span></div>
            <div className="flex justify-between text-"><span className="text-[#0f2e1f]/50">Доставка</span><span className="font-bold text-[#1e4d2b]">Безплатна</span></div>
            <div className="mt-1 h-px w-full bg-[#1e4d2b]/10" />
            <div className="flex justify-between pt-1 text- sm:text- font-black"><span className="text-[#0f2e1f]">Общо</span><span className="text-[#1e4d2b]">€ {total.toFixed(2)}</span></div>
          </div>

          <button className="mt-5 w-full rounded-full bg-[#1e4d2b] py-3 sm:py-3.5 text- sm:text- font-black uppercase tracking-wide text-white transition hover:bg-[#0f2e1f] active:scale-[0.98]">
            Поръчай
          </button>
          <button onClick={() => dispatch({ type: "cart/clearCart" })} className="mt-3 w-full text-center text- font-bold uppercase tracking-wide text-[#0f2e1f]/40 hover:text-[#0f2e1f]/70">
            Изчисти количката
          </button>
        </div>
      </div>
    </section>
  );
}