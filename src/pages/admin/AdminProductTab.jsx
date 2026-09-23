import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FiPlusSquare, FiCheckCircle, FiPackage, FiXCircle, FiAlertCircle } from 'react-icons/fi'
import { fetchProducts, setProductFilters, setProductsPage } from '../../store/slices/productsSlice'
import ProductModal from '../../components/modals/ProductModal'

function StatCard({ title, value, icon }) {
  return (
    <div className="rounded-[22px] border border-[#102f20]/8 bg-white p-5 shadow-[0_10px_30px_rgba(15,46,31,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#102f20]/45">{title}</p>
          <p className="mt-2 text-2xl font-black text-[#102f20]">{value}</p>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#eef4ec] text-[#1e4d2b]">{icon}</div>
      </div>
    </div>
  )
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
  )
}

function formatDate(date) {
  if (!date) return '—'
  return new Intl.DateTimeFormat('bg-BG', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(date))
}

export default function AdminProductTab() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { items: products, status, error, pagination, filters } = useSelector((state) => state.products)
  const [modalOpen, setModalOpen] = useState(false)

  const loading = status === 'loading'

  useEffect(() => {
    dispatch(fetchProducts())
    // презарежда при смяна на страница или на филтъра "активни/неактивни"
  }, [dispatch, pagination.page, filters.isActive])

  const goToProduct = (id) => navigate(`/products/${id}`)

  return (
    <section className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* HEADER */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#102f20] sm:text-3xl">Продукти</h1>
            <p className="mt-1 text-sm text-[#102f20]/45">Управление и преглед на продуктите.</p>
          </div>

          {/* isActive таб — бекендът връща само едно от двете наведнъж, няма "всички" в 1 заявка */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => dispatch(setProductFilters({ isActive: true }))}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                filters.isActive !== false ? 'bg-[#1e4d2b] text-white' : 'border border-[#102f20]/10 text-[#102f20]/55 hover:bg-[#fafcf9]'
              }`}
            >
              Активни
            </button>
            <button
              type="button"
              onClick={() => dispatch(setProductFilters({ isActive: false }))}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                filters.isActive === false ? 'bg-[#1e4d2b] text-white' : 'border border-[#102f20]/10 text-[#102f20]/55 hover:bg-[#fafcf9]'
              }`}
            >
              Неактивни
            </button>
          </div>
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
            title={filters.isActive === false ? 'Неактивни продукти' : 'Активни продукти'}
            value={pagination.total}
            icon={<FiPackage size={19} />}
          />
          <StatCard title="На тази страница" value={products.length} icon={<FiCheckCircle size={19} />} />
          <StatCard title="Страница" value={`${pagination.page} / ${pagination.pages || 1}`} icon={<FiXCircle size={19} />} />
        </div>

        {/* TABLE */}
        <div className="mt-6 overflow-hidden rounded-[24px] border border-[#102f20]/8 bg-white shadow-[0_10px_30px_rgba(15,46,31,0.05)]">
          <div className="flex items-center justify-between gap-3 border-b border-[#102f20]/8 px-5 py-5 sm:px-6">
            <h2 className="text-lg font-black text-[#102f20]">Всички продукти</h2>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="flex cursor-pointer items-center gap-3 rounded-xl bg-[#1e4d2b] px-3.5 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(30,77,43,0.18)] transition-all hover:bg-[#173d22]"
            >
              <FiPlusSquare size={18} />
              <span>Добави продукт</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead>
                <tr className="border-b border-[#102f20]/8 bg-[#fafcf9] text-left">
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#102f20]/40">Продукт</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#102f20]/40">Тип</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#102f20]/40">Количество</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#102f20]/40">Цена</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#102f20]/40">Статус</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#102f20]/40">Създаден</th>
                </tr>
              </thead>

              <tbody>
                {loading &&
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={`skeleton-${i}`} className="border-b border-[#102f20]/6 last:border-0">
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
                      onKeyDown={(e) => e.key === 'Enter' && goToProduct(product._id)}
                      className="cursor-pointer border-b border-[#102f20]/6 transition last:border-0 hover:bg-[#fafcf9]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-[#eef4ec]">
                            {product.images?.[0] ? (
                              <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="grid h-full w-full place-items-center text-[#1e4d2b]">
                                <FiPackage size={17} />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="truncate text-sm font-bold text-[#102f20]">{product.name}</div>
                            <div className="mt-0.5 truncate text-xs text-[#102f20]/40">{product._id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-[#102f20]/65">{product.type}</td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-bold text-[#102f20]">{product.quantity}</span>
                        <span className="ml-1 text-xs text-[#102f20]/40">{product.quantityType}</span>
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-[#102f20]">{Number(product.price).toFixed(2)} лв.</td>
                      <td className="px-5 py-4">
                        <StatusBadge active={product.isActive} />
                      </td>
                      <td className="px-5 py-4 text-sm text-[#102f20]/55">{formatDate(product.createdAt)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {!loading && products.length === 0 && (
            <div className="px-6 py-16 text-center">
              <FiPackage size={28} className="mx-auto text-[#102f20]/20" />
              <p className="mt-3 text-sm font-semibold text-[#102f20]/50">Няма намерени продукти.</p>
            </div>
          )}

          {!loading && pagination.pages > 1 && (
            <div className="flex items-center justify-between border-t border-[#102f20]/8 px-5 py-4 sm:px-6">
              <p className="text-xs text-[#102f20]/45">
                Страница <span className="font-bold text-[#102f20]">{pagination.page}</span> от{' '}
                <span className="font-bold text-[#102f20]">{pagination.pages}</span> · общо {pagination.total}
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
  )
}