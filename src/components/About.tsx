import { motion } from "motion/react";

export default function About({ data = {} }: { data?: any }) {
  return (
    <section id="about" className="relative w-full py-32 lg:py-48 bg-brand-bg px-6 lg:px-16 overflow-hidden">
      <div className="max-w-[1400px] mx-auto grid lg:grid-cols-[1fr_1fr] gap-20 items-end">
        
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="font-ui uppercase tracking-widest text-[#171717]/40 text-xs font-bold mb-8">Podejście</div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.2] text-brand-text mb-8 whitespace-pre-line">
            {data.headline || "Podologia na najwyższym poziomie.\nW centrum Krakowa."}
          </h2>
          <p className="font-sans text-lg text-brand-text/60 font-light max-w-lg mb-12 whitespace-pre-line">
            {data.text || "Łączymy wieloletnie doświadczenie z nowoczesnym sprzętem medycznym. Skupiamy się na indywidualnym planie terapii dla każdego pacjenta, by leczenie było skuteczne, a efekty długotrwałe."}
          </p>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
           className="aspect-[4/3] rounded-[40px] overflow-hidden bg-brand-cream border border-black/5 flex items-center justify-center relative"
        >
          <img src={data.image || "/zespol.jpg"} alt="Zespół Podobesties" className="w-full h-full object-cover" />
        </motion.div>
        
      </div>
    </section>
  );
}
