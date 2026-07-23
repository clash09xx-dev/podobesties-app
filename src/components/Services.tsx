import { motion } from "motion/react";
import { ArrowRight, Clock } from "lucide-react";
import { useState } from "react";

import { services } from "../data/servicesData";

export default function Services({ data = {} }: { data?: any }) {
  const categories = Array.from(new Set(services.map(s => s.category)));
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  return (
    <section id="services" className="relative w-full py-32 lg:py-48 bg-brand-dark text-brand-bg px-6 lg:px-16 selection:bg-brand-bg selection:text-brand-dark overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[1000px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,rgba(0,0,0,0)_60%)] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
           className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8"
        >
          <div>
            <h2 className="font-serif text-5xl lg:text-7xl font-light mb-6 leading-tight whitespace-pre-line">
              {data.headline || "Nasze Usługi"}
            </h2>
            <div className="h-px w-full max-w-[200px] bg-white/20" />
          </div>
          <p className="font-sans text-white/40 max-w-sm text-lg font-light whitespace-pre-line">
            {data.subtitle || "Kompleksowa opieka łącząca nowoczesne technologie z wieloletnim doświadczeniem."}
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Categories Sidebar */}
          <div className="lg:w-1/3 flex flex-col gap-2">
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => setActiveCategory(cat)}
                className={`text-left px-6 py-4 rounded-2xl font-sans text-sm transition-all duration-300 ${
                  activeCategory === cat 
                    ? "bg-white/10 text-white font-medium" 
                    : "text-white/40 hover:text-white/80 hover:bg-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Services List */}
          <div className="lg:w-2/3 flex flex-col gap-4">
            {services.filter(s => s.category === activeCategory).map((svc, i) => (
              <motion.div
                key={svc.title + i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group relative bg-[#1A1A1A]/80 backdrop-blur-xl border border-white/5 hover:border-white/20 rounded-[24px] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-500 ease-out"
              >
                <div className="flex-1">
                  <h3 className="font-serif text-xl md:text-2xl text-brand-bg mb-3 group-hover:text-white transition-colors">{svc.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-sans text-brand-bg/40 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {svc.duration}
                    </div>
                    {svc.desc && (
                      <span className="hidden md:inline line-clamp-1 flex-1">{svc.desc}</span>
                    )}
                  </div>
                  {svc.desc && (
                    <p className="md:hidden font-sans text-brand-bg/50 text-sm leading-relaxed mb-4">
                      {svc.desc}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-none border-white/5 pt-4 md:pt-0">
                  <div className="font-sans font-medium text-lg text-brand-bg whitespace-nowrap">
                    {svc.price}
                  </div>
                  <a 
                    href="#booking"
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-500 flex-shrink-0"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 1, delay: 0.5 }}
           className="mt-20 text-center"
        >
          <a href="#booking" className="inline-flex items-center gap-3 border border-white/20 px-8 py-4 rounded-full font-sans text-sm hover:bg-white hover:text-brand-dark transition-colors">
            Zarezerwuj wizytę <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
