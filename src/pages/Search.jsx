import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiX } from "react-icons/fi";

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const categoryLabels = {
  readyToUse: "Зареждай от нас",
  seeds: "Семена",
  seedlings: "Разсад",
};

const categoryOrder = ["readyToUse", "seeds", "seedlings"];

export default function Search() {
  const dispatch = useDispatch();
  const query = useSelector((state) => state.search.query);
  const products = useSelector((state) => state.products.products);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length === 0) return products;
    return products.filter((product) => product.name.toLowerCase().includes(q));
  }, [products, query]);

  const grouped = useMemo(() => {
    const groups = {};
    results.forEach((p) => {
      const cat = p.category || "readyToUse";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(p);
    });
    return groups;
  }, [results]);

  const sortedCategories = useMemo(() => {
    return Object.keys(grouped).sort((a, b) => {
      const ia = categoryOrder.indexOf(a);
      const ib = categoryOrder.indexOf(b);
      if (ia === -1 && ib === -1) return a.localeCompare(b);
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });
  }, [grouped]);

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-soil">
        Търсене в продуктите
      </h1>

      <div className="my-6 flex items-center gap-3 rounded-md border border-soil/20 bg-paper-dark/40 px-4 py-3">
        <FiSearch className="text-lg text-soil/50" />
        <input
          type="text"
          placeholder="Търси по име, напр. „домат“ или „ягода“…"
          className="w-full bg-transparent text-sm text-soil placeholder:text-soil/40 focus:outline-none"
        />
        {query && (
          <button
            type="button"
            aria-label="Изчисти търсенето"
            className="text-soil/40 hover:text-soil"
          >
            <FiX />
          </button>
        )}
      </div>

      <p className="mb-6 text-sm text-soil/50">
        {results.length} {results.length === 1 ? "резултат" : "резултата"}
      </p>

      <AnimatePresence mode="wait">
        {results.length > 0 ? (
          <motion.div
            key={query}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-10"
          >
            {sortedCategories.map((cat) => (
              <div key={cat}>
                <div className="mb-7 relative overflow-hidden rounded-xl border border-[#1e4d2b]/10 bg-[#f6f9f5] px-4 py-3.5 sm:px-5">
                  <div className="absolute left-0 top-0 h-full w- bg-[#1e4d2b]" />
                  <div className="absolute top-0 left-5 right-0 h-px bg-[#1e4d2b]/10" />
                  <div className="absolute bottom-0 left-5 right-0 h-px bg-[#1e4d2b]/10" />
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <h2 className="text- sm:text- font-black uppercase tracking-[0.14em] text-[#0f2e1f]">
                        {categoryLabels[cat] || cat}
                      </h2>
                    </div>
                    <div className="flex h-7 items-center rounded-full bg-[#0f2e1f] px-3.5 text- font-bold tracking-wide text-white">
                      {grouped[cat].length} БР.
                    </div>
                  </div>
                </div>

                <motion.div
                  variants={listVariants}
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {grouped[cat].map((product) => {
                    const isDiscount =
                      product.discount === "yes" || product.discount === true;
                    const isNew =
                      product.newProduct === "yes" ||
                      product.newProduct === true;

                    return (
                      <motion.article
                        key={product.id}
                        variants={cardVariants}
                        className="flex flex-col overflow-hidden rounded-md border border-soil/15 bg-paper"
                      >
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-paper-dark">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute top-2 left-2 flex flex-col gap-1">
                            {isDiscount && product.discountPercent && (
                              <span className="bg-[#c81e1e] text-white text- font-bold px-2 py-0.5 rounded-md shadow">
                                -{product.discountPercent}%
                              </span>
                            )}
                            {isNew && (
                              <span className="bg-[#1e4d2b] text-white text- font-bold px-2 py-0.5 rounded-md shadow">
                                НОВО
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-1 flex-col gap-2 p-4">
                          <h3 className="line-clamp-2 font-display text-base font-medium text-soil">
                            {product.name}
                          </h3>
                          <div className="mt-auto flex items-center gap-2">
                            <span className="font-display text-base font-semibold text-humus">
                             € {product.price.toFixed(2)}
                            </span>
                            {isDiscount && product.oldPrice && (
                              <span className="text-sm text-soil/40 line-through">
                                € {product.oldPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </motion.div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-md border border-dashed border-soil/20 px-6 py-12 text-center"
          >
            <p className="font-display text-lg text-soil/70">
              Нищо не открихме.
            </p>
            <p className="mt-1 text-sm text-soil/50">
              Опитай с друга дума за търсене.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
