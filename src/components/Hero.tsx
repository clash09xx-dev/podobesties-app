import { motion, useScroll, useTransform } from "motion/react";
import { Star } from "lucide-react";
import { useRef, useState, useEffect } from "react";

export default function Hero({ data = {} }: { data?: any }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const yImage = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const scaleImage = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const opacityText = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const [reviewsStats, setReviewsStats] = useState({ totalCount: 56, averageRating: "5.0" });

  useEffect(() => {
    fetch('/api/reviews-all').then(res => res.json()).then(data => {
      setReviewsStats({
        totalCount: data.totalCount || 56,
        averageRating: data.averageRating || "5.0"
      });
    }).catch(err => console.error("Could not load reviews", err));
  }, []);

  return (
    <section ref={containerRef} id="hero" className="relative w-full pt-32 lg:pt-40 pb-20 px-6 lg:px-16 overflow-hidden min-h-screen flex flex-col justify-between">
      <div className="w-full max-w-[1400px] mx-auto grid lg:grid-cols-[45fr_55fr] gap-12 lg:gap-20 items-center grow">
        
        {/* Left Content */}
        <motion.div 
          style={{ opacity: opacityText }}
          className="flex flex-col justify-center max-w-xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <span className="font-ui uppercase tracking-widest text-[11px] font-bold text-brand-text/60 leading-relaxed block whitespace-pre-line">
              {data.topSubtitle || "PODOBESTIES\nPodologia i Fizjoterapia"}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[3.5rem] md:text-[5rem] lg:text-[5.5rem] leading-[0.95] tracking-tight text-brand-text mb-8 whitespace-pre-line"
          >
            {data.headline || "Nowoczesna, profesjonalna podologia\ni fizjoterapia"}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg text-brand-text/70 leading-relaxed font-sans font-light max-w-md mb-12 whitespace-pre-line"
          >
            {data.description || "Wyjątkowe miejsce na mapie Krakowa, gdzie zdrowie łączy się z profesjonalizmem w atmosferze premium."}
          </motion.p>

          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
             className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 mb-16"
          >
            <a 
              href="#booking"
              className="bg-brand-text text-brand-bg px-8 py-4 rounded-full font-sans text-sm font-medium hover:bg-brand-text/80 transition-colors text-center shadow-lg shadow-black/5 hover:shadow-black/10"
            >
              {data.ctaText || "Umów wizytę"}
            </a>
            <a 
              href="#services"
              className="px-8 py-4 rounded-full font-sans text-sm font-medium border border-brand-text/10 text-brand-text hover:border-brand-text/30 transition-colors text-center"
            >
              Poznaj usługi
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="flex items-center gap-4"
          >
            <div className="flex gap-1">
               {[...Array(Math.round(parseFloat(reviewsStats.averageRating)))].map((_, i) => (
                 <Star key={i} className="w-4 h-4 fill-brand-accent text-brand-accent" />
               ))}
            </div>
            <div className="font-sans text-xs flex items-center text-brand-text/60 font-medium">
              <span className="text-brand-text mr-1">{reviewsStats.averageRating}</span>
              <span className="w-1 h-1 rounded-full bg-brand-text/20 mx-2" />
              {reviewsStats.totalCount} opinii
            </div>
          </motion.div>
        </motion.div>

        {/* Right Artwork */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full aspect-[4/5] lg:aspect-auto lg:h-[80vh] rounded-[40px] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.05)] bg-brand-cream border border-black/5 flex items-center justify-center"
        >
          <img src={data.bgImage || "/recepcja1.jpg"} alt="Recepcja Podobesties" className="w-full h-full object-cover" />
        </motion.div>
      </div>

      {/* 4 Stats Cards Below Hero */}
      <div className="w-full max-w-[1400px] mx-auto mt-24">
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16 border-t border-brand-text/10 pt-10">
           
           <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0 }}
              className="flex flex-col"
           >
             <div className="flex gap-0.5 mb-2 mt-4 lg:mt-6">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} className="w-4 h-4 fill-brand-accent text-brand-accent" />
                ))}
             </div>
             <div className="font-serif text-3xl text-brand-text mb-1">5.0</div>
           </motion.div>

           <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="flex flex-col"
           >
             <div className="font-serif text-3xl text-brand-text mb-1 mt-6">1000+</div>
             <div className="font-sans text-xs text-brand-text/50 uppercase tracking-widest font-medium">Zadowolonych klientów</div>
           </motion.div>

           <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col"
           >
             <div className="font-serif text-3xl text-brand-text mb-1 mt-6">100%</div>
             <div className="font-sans text-xs text-brand-text/50 uppercase tracking-widest font-medium">Sterylność</div>
           </motion.div>

           <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col"
           >
             <div className="font-sans text-sm text-brand-text mb-1 mt-7 font-medium">Centrum Szkoleniowe</div>
             <div className="font-sans text-xs text-brand-text/50 font-medium">Lipska 16</div>
           </motion.div>

         </div>
      </div>
    </section>
  );
}
