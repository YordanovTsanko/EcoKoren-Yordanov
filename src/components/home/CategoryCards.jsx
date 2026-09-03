import { FiArrowRight, FiPackage } from 'react-icons/fi'
import { LuSprout, LuFlower2 } from 'react-icons/lu'

const items = [
  {
    icon: LuSprout,
    title: 'СЕМЕНА',
    desc: 'Голям избор от качествени семена за вашата градина.',
    img: 'https://media-cldnry.s-nbcnews.com/image/upload/rockcms/2022-06/superseeds-te-220621-326456.jpg',
  },
  {
    icon: LuFlower2,
    title: 'РАЗСАД',
    desc: 'Здрав и силен разсад за богата и плодородна реколта.',
    img: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=600',
  },
  {
    icon: FiPackage,
    title: 'ЗАРЕЖДАЙ ОТ НАС',
    desc: 'Индивидуални решения и поръчки за вашия бизнес.',
    img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600',
  }
]

export default function CategoryCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {items.map(it => (
        <div key={it.title} className="group relative overflow-hidden rounded-2xl bg-[#f2f7f0] border border-[#dde9d7] hover:shadow-md transition">
          <div className="p-5 sm:p-6 relative z-10">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-full bg-white border-2 border-[#1e4d2b]/20 grid place-items-center shrink-0">
                <it.icon className="text-[#1e4d2b]" size={22} />
              </div>
              <div className="pr-28 sm:pr-32">
                <h3 className="font-extrabold text-[#123123] leading-tight">{it.title}</h3>
                <p className="mt-1.5 text-[13px] sm:text-[14px] text-[#4b5f52] leading-snug">{it.desc}</p>
                <button className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#1e4d2b] group-hover:gap-2.5 transition-all">
                  РАЗГЛЕДАЙ <FiArrowRight />
                </button>
              </div>
            </div>
          </div>
          <img src={it.img} alt="" className="absolute right-0 top-0 h-full w-[110px] sm:w-[140px] object-cover opacity-90 group-hover:scale-105 transition duration-500" />
        </div>
      ))}
    </div>
  )
}
