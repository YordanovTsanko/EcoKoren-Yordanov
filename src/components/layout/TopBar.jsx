import { FiTruck } from 'react-icons/fi'
import { LuLeaf } from 'react-icons/lu'

export default function TopBar() {
  return (
    <div className="bg-[#0f2e1f] text-white/90 text-xs sm:text-[13px]">
      <div className="container-eco flex items-center justify-between py-2 gap-2">
        <div className="flex items-center gap-1.5">
          <LuLeaf className="shrink-0" />
          <span className="hidden sm:inline">Безплатна доставка над €100</span>
          <span className="sm:hidden">Над €100 безплатно</span>
        </div>
        <div className="hidden md:flex items-center gap-1.5">
          <FiTruck />
          <span>Бърза доставка в цялата страна</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>Обслужване: 0899 597 920</span>
        </div>
      </div>
    </div>
  )
}
