import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=1920" alt="hero" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f7fbf5]/95 via-[#f7fbf5]/85 to-[#f7fbf5]/40 sm:to-transparent" />
      </div>

      <div className="container-eco relative">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[460px] sm:min-h-[520px] py-12 sm:py-16">
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.6}}>
            <h1 className="text-[34px] sm:text-[48px] lg:text-[58px] font-extrabold leading-[1.05] tracking-tight text-[#123123]">
              Гарантирано качество – за разкошна градина и успешен бизнес.
            </h1>
            <p className="mt-4 sm:mt-5 text-[15px] sm:text-[17px] text-[#334e3e] max-w-[520px] leading-relaxed">
              Семена, разсад и продукти с гарантирано качество за Вашите магазини.
            </p>
            <div className="mt-7 flex gap-3">
              <button className="bg-[#1e4d2b] hover:bg-[#163a20] text-white font-semibold px-6 sm:px-7 py-3 sm:py-3.5 rounded-lg shadow-sm transition text-[14px] sm:text-[15px]">
                ПАЗАРУВАЙ СЕГА
              </button>
              <button className="hidden sm:inline-flex bg-white/80 backdrop-blur border border-[#1e4d2b]/20 text-[#1e4d2b] font-semibold px-6 py-3.5 rounded-lg hover:bg-white transition">
                Виж категории
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
