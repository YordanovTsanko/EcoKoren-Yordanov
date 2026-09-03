import { LuBadgeCheck, LuTruck, LuCreditCard, LuHeadset } from 'react-icons/lu'

const items = [
  { Icon: LuBadgeCheck, title: '100% КАЧЕСТВО', text: 'Гарантирано качество на всички продукти' },
  { Icon: LuTruck, title: 'БЪРЗА ДОСТАВКА', text: 'Доставка до 1-2 работни дни в цялата страна' },
  { Icon: LuCreditCard, title: 'СИГУРНО ПЛАЩАНЕ', text: 'Сигурни плащания с карта или наложен платеж' },
  { Icon: LuHeadset, title: 'ПОДДРЪЖКА', text: 'Винаги насреща при въпроси и нужда' },
]

export default function Features() {
  return (
    <div className="mt-12 sm:mt-16 bg-[#f2f7f0] border border-[#dde9d7] rounded-2xl p-5 sm:p-7">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {items.map(({Icon, title, text}) => (
          <div key={title} className="flex gap-3.5">
            <Icon className="text-[#1e4d2b] shrink-0 mt-0.5" size={30} strokeWidth={1.6} />
            <div>
              <div className="font-extrabold text-[13px] tracking-wide text-[#123123]">{title}</div>
              <div className="text-[13px] text-[#4b5f52] mt-1 leading-snug">{text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
