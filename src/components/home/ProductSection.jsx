import ProductCard from '../ui/ProductCard.jsx'
import { Link } from 'react-router-dom'

export default function ProductSection({ title, products, category }) {
  const visibleProducts = products.slice(0, 6)
  const cat = category || products[0]?.category

  return (
    <section>
      <div className="flex items-center gap-3 mb-4 sm:mb-5">
        <h2 className="text-lg sm:text-xl font-extrabold tracking-wide text-[#123123] whitespace-nowrap">{title}</h2>
        <div className="h-px bg-[#e3ece0] flex-1" />
        <Link to={`/category/${cat}`} className="text- font-bold text-[#1e4d2b] hover:underline whitespace-nowrap">
          ВИЖ ВСИЧКИ
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {visibleProducts.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  )
}