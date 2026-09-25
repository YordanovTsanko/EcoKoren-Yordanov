import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FiPlusSquare,
  FiCheckCircle,
  FiPackage,
  FiXCircle,
  FiAlertCircle,
  FiSearch,
} from "react-icons/fi";
import {
  fetchProducts,
  setProductFilters,
  resetProductFilters,
  setProductsPage,
} from "../../store/slices/productsSlice";
import ProductModal from "../../components/modals/ProductModal";
import FilterDropDown from "../../components/ui/FilterDropDown";

const PRODUCT_TYPE_OPTIONS = [
  { value: "fruits", label: "Плод" },
  { value: "vegetables", label: "Зеленчук" },
  { value: "other", label: "Друго" },
];

const QUANTITY_TYPE_OPTIONS = [
  { value: "kg", label: "кг." },
  { value: "l", label: "л." },
  { value: "piece", label: "бр." },
];

const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Най-нови" },
  { value: "createdAt:asc", label: "Най-стари" },
  { value: "name:asc", label: "Име (А-Я)" },
  { value: "name:desc", label: "Име (Я-А)" },
  { value: "price:asc", label: "Цена: ниска → висока" },
  { value: "price:desc", label: "Цена: висока → ниска" },
  { value: "quantity:asc", label: "Количество: малко → много" },
  { value: "quantity:desc", label: "Количество: много → малко" },
];

const labelCls =
  "mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#102f20]/45";
const inputCls =
  "w-full rounded-xl border border-[#102f20]/10 px-3.5 py-2.5 text-sm text-[#102f20] outline-none placeholder:text-[#102f20]/30 focus:border-[#1e4d2b] focus:ring-2 focus:ring-[#1e4d2b]/15";

function useDebouncedField(initialValue, onCommit, delay = 5000) {
  const [draft, setDraft] = useState(initialValue);
  const timeoutRef = useRef(null);
  const lastCommittedRef = useRef(initialValue);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const clearPending = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const commit = (value) => {
    clearPending();
    if (value === lastCommittedRef.current) return;
    lastCommittedRef.current = value;
    onCommit(value);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setDraft(value);
    clearPending();
    timeoutRef.current = setTimeout(() => commit(value), delay);
  };

  const handleBlur = (e) => commit(e.target.value);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") commit(e.target.value);
  };

  const reset = (value = "") => {
    clearPending();
    setDraft(value);
    lastCommittedRef.current = value;
  };

  return { draft, handleChange, handleBlur, handleKeyDown, reset };
}

function StatCard({ title, value, icon }) {
  return (
    <div className="rounded-[22px] border border-[#102f20]/8 bg-white p-5 shadow-[0_10px_30px_rgba(15,46,31,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#102f20]/45">{title}</p>
          <p className="mt-2 text-2xl font-black text-[#102f20]">{value}</p>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#eef4ec] text-[#1e4d2b]">
          {icon}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ active }) {
  return active ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eef4ec] px-2.5 py-1 text-[11px] font-bold text-[#1e4d2b]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#1e4d2b]" />
      Активен
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-600">
      <FiXCircle size={11} />
      Неактивен
    </span>
  );
}

function formatDate(date) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("bg-BG", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export default function AdminProductTab() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    items: products,
    status,
    error,
    pagination,
    filters,
  } = useSelector((state) => state.products);
  const [modalOpen, setModalOpen] = useState(false);

  const loading = status === "loading";
  const sortValue = `${filters.sort}:${filters.order}`;

  const search = useDebouncedField(filters.search, (val) =>
    dispatch(setProductFilters({ search: val.trim() })),
  );
  const minPrice = useDebouncedField(filters.minPrice, (val) =>
    dispatch(setProductFilters({ minPrice: val })),
  );
  const maxPrice = useDebouncedField(filters.maxPrice, (val) =>
    dispatch(setProductFilters({ maxPrice: val })),
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [
    dispatch,
    pagination.page,
    filters.isActive,
    filters.type,
    filters.quantityType,
    filters.sort,
    filters.order,
    filters.search,
    filters.minPrice,
    filters.maxPrice,
  ]);

  const goToProduct = (id) => navigate(`/admin/products/${id}`);

  const handleSortChange = (val) => {
    const [sort, order] = val.split(":");
    dispatch(setProductFilters({ sort, order }));
  };

  const handleResetFilters = () => {
    dispatch(resetProductFilters());
    search.reset("");
    minPrice.reset("");
    maxPrice.reset("");
  };

  const activeLabel =
    filters.isActive === false
      ? "Неактивни продукти"
      : filters.isActive === true
        ? "Активни продукти"
        : "Продукти";

  return (
    <section className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-black tracking-tight text-[#102f20] sm:text-3xl">
            Продукти
          </h1>
          <p className="mt-1 text-sm text-[#102f20]/45">
            Управление и преглед на продуктите.
          </p>
        </div>

        {error && (
          <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            <FiAlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STATS */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title={activeLabel}
            value={pagination.total}
            icon={<FiPackage size={19} />}
          />
          <StatCard
            title="На тази страница"
            value={products.length}
            icon={<FiCheckCircle size={19} />}
          />
          <StatCard
            title="Страница"
            value={`${pagination.page} / ${pagination.pages || 1}`}
            icon={<FiXCircle size={19} />}
          />
        </div>

        {/* FILTER BAR — веднага под картите, над таблицата */}
        <div className="mt-6 rounded-[22px] border border-[#102f20]/8 bg-white p-4 shadow-[0_10px_30px_rgba(15,46,31,0.05)] sm:p-5">
          <div className="flex flex-wrap items-end gap-3">
            <div className="w-full sm:w-56">
              <label className={labelCls}>Търсене</label>
              <div className="relative">
                <FiSearch
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#102f20]/30"
                />
                <input
                  value={search.draft}
                  onChange={search.handleChange}
                  onBlur={search.handleBlur}
                  onKeyDown={search.handleKeyDown}
                  placeholder="Име или описание..."
                  className={`${inputCls} pl-8`}
                />
              </div>
            </div>

            <FilterDropDown
              label="Тип"
              widthClass="w-full sm:w-40"
              options={PRODUCT_TYPE_OPTIONS}
              value={filters.type || undefined}
              onChange={(val) =>
                dispatch(setProductFilters({ type: val || "" }))
              }
              placeholder="Всички типове"
            />

            <FilterDropDown
              label="Мярка"
              widthClass="w-full sm:w-28"
              options={QUANTITY_TYPE_OPTIONS}
              value={filters.quantityType || undefined}
              onChange={(val) =>
                dispatch(setProductFilters({ quantityType: val || "" }))
              }
              placeholder="Всички"
            />

            <div className="w-full sm:w-44">
              <label className={labelCls}>Цена</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="0"
                  value={minPrice.draft}
                  onChange={minPrice.handleChange}
                  onBlur={minPrice.handleBlur}
                  onKeyDown={minPrice.handleKeyDown}
                  placeholder="От"
                  className={inputCls}
                />
                <span className="text-[#102f20]/30">–</span>
                <input
                  type="number"
                  min="0"
                  value={maxPrice.draft}
                  onChange={maxPrice.handleChange}
                  onBlur={maxPrice.handleBlur}
                  onKeyDown={maxPrice.handleKeyDown}
                  placeholder="До"
                  className={inputCls}
                />
              </div>
            </div>

            <FilterDropDown
              label="Подредба"
              widthClass="w-full sm:w-56"
              options={SORT_OPTIONS}
              value={sortValue}
              onChange={handleSortChange}
              clearable={false}
            />

            <div className="w-full sm:w-auto">
              <label className={labelCls}>Статус</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    dispatch(setProductFilters({ isActive: "all" }))
                  }
                  className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                    filters.isActive === "all"
                      ? "bg-[#1e4d2b] text-white"
                      : "border border-[#102f20]/10 text-[#102f20]/55 hover:bg-[#fafcf9]"
                  }`}
                >
                  Всички
                </button>
                <button
                  type="button"
                  onClick={() =>
                    dispatch(setProductFilters({ isActive: true }))
                  }
                  className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                    filters.isActive === true
                      ? "bg-[#1e4d2b] text-white"
                      : "border border-[#102f20]/10 text-[#102f20]/55 hover:bg-[#fafcf9]"
                  }`}
                >
                  Активни
                </button>
                <button
                  type="button"
                  onClick={() =>
                    dispatch(setProductFilters({ isActive: false }))
                  }
                  className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                    filters.isActive === false
                      ? "bg-[#1e4d2b] text-white"
                      : "border border-[#102f20]/10 text-[#102f20]/55 hover:bg-[#fafcf9]"
                  }`}
                >
                  Неактивни
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetFilters}
              className="rounded-xl border border-[#102f20]/10 cursor-pointer px-4 py-2.5 text-xs font-semibold text-[#102f20]/60 hover:bg-[#fafcf9] sm:ml-auto"
            >
              Изчисти филтрите
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="mt-6 overflow-hidden rounded-[24px] border border-[#102f20]/8 bg-white shadow-[0_10px_30px_rgba(15,46,31,0.05)]">
          <div className="flex items-center justify-between gap-3 border-b border-[#102f20]/8 px-5 py-5 sm:px-6">
            <h2 className="text-lg font-black text-[#102f20]">
              Всички продукти
            </h2>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="flex cursor-pointer items-center gap-3 rounded-xl bg-[#1e4d2b] p-2 text-xs font-semibold text-white shadow-[0_8px_20px_rgba(30,77,43,0.18)] transition-all hover:bg-[#173d22] sm:px-3.5 sm:py-3 sm:text-sm"
            >
              <FiPlusSquare size={18} />
              <span>Добави продукт</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead>
                <tr className="border-b border-[#102f20]/8 bg-[#fafcf9] text-left">
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#102f20]/40">
                    Продукт
                  </th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#102f20]/40">
                    Тип
                  </th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#102f20]/40">
                    Количество
                  </th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#102f20]/40">
                    Цена
                  </th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#102f20]/40">
                    Статус
                  </th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#102f20]/40">
                    Създаден
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading &&
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr
                      key={`skeleton-${i}`}
                      className="border-b border-[#102f20]/6 last:border-0"
                    >
                      <td className="px-5 py-4" colSpan={6}>
                        <div className="h-5 w-full max-w-sm animate-pulse rounded-lg bg-[#eef4ec]" />
                      </td>
                    </tr>
                  ))}

                {!loading &&
                  products.map((product) => (
                    <tr
                      key={product._id}
                      onClick={() => goToProduct(product._id)}
                      tabIndex={0}
                      onKeyDown={(e) =>
                        e.key === "Enter" && goToProduct(product._id)
                      }
                      className="cursor-pointer border-b border-[#102f20]/6 transition last:border-0 hover:bg-[#fafcf9]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-[#eef4ec]">
                            {product.images?.[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="grid h-full w-full place-items-center text-[#1e4d2b]">
                                <FiPackage size={17} />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="truncate text-sm font-bold text-[#102f20]">
                              {product.name}
                            </div>
                            <div className="mt-0.5 truncate text-xs text-[#102f20]/40">
                              {product._id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-[#102f20]/65">
                        {PRODUCT_TYPE_OPTIONS.find(
                          (opt) => opt.value === product.type,
                        )?.label || product.type}
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-bold text-[#102f20]">
                          {product.quantity}
                        </span>
                        <span className="ml-1 text-xs text-[#102f20]/40">
                          {QUANTITY_TYPE_OPTIONS.find(
                            (opt) => opt.value === product.quantityType,
                          )?.label || product.quantityType}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-[#102f20]">
                        € {Number(product.price).toFixed(2)}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge active={product.isActive} />
                      </td>
                      <td className="px-5 py-4 text-sm text-[#102f20]/55">
                        {formatDate(product.createdAt)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {!loading && products.length === 0 && (
            <div className="px-6 py-16 text-center">
              <FiPackage size={28} className="mx-auto text-[#102f20]/20" />
              <p className="mt-3 text-sm font-semibold text-[#102f20]/50">
                Няма намерени продукти.
              </p>
            </div>
          )}

          {!loading && pagination.pages > 1 && (
            <div className="flex items-center justify-between border-t border-[#102f20]/8 px-5 py-4 sm:px-6">
              <p className="text-xs text-[#102f20]/45">
                Страница{" "}
                <span className="font-bold text-[#102f20]">
                  {pagination.page}
                </span>{" "}
                от{" "}
                <span className="font-bold text-[#102f20]">
                  {pagination.pages}
                </span>{" "}
                · общо {pagination.total}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={pagination.page <= 1}
                  onClick={() => dispatch(setProductsPage(pagination.page - 1))}
                  className="rounded-xl border border-[#102f20]/10 px-3.5 py-2 text-xs font-bold text-[#102f20]/70 hover:bg-[#fafcf9] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Назад
                </button>
                <button
                  type="button"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => dispatch(setProductsPage(pagination.page + 1))}
                  className="rounded-xl border border-[#102f20]/10 px-3.5 py-2 text-xs font-bold text-[#102f20]/70 hover:bg-[#fafcf9] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Напред
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={() => dispatch(fetchProducts())}
      />
    </section>
  );
}
