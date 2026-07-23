import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";

const defaultImages = [
  { url: "/gabinet.jpg", caption: "Gabinet podologiczny" },
  { url: "/recepcja1.jpg", caption: "Nasza przestrzeń" },
];

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = defaultImages;

  const nextImage = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <section className="py-32 px-6 lg:px-16 overflow-hidden bg-brand-bg border-y border-black/5">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex justify-between items-end mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-5xl md:text-6xl text-brand-text mb-4">Galeria</h2>
            <p className="font-sans text-brand-text/60 text-lg max-w-md">
              Zajrzyj do naszego gabinetu. Stworzyliśmy przestrzeń, w której poczujesz się komfortowo i bezpiecznie.
            </p>
          </motion.div>
          
          <div className="hidden md:flex gap-4">
            <button 
              onClick={prevImage}
              className="w-14 h-14 rounded-full border border-black/10 flex items-center justify-center hover:bg-brand-text hover:text-brand-bg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={nextImage}
              className="w-14 h-14 rounded-full border border-black/10 flex items-center justify-center hover:bg-brand-text hover:text-brand-bg transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-[40px] overflow-hidden bg-black/5">
          {images.map((image, i) => (
            <motion.div
              key={i}
              className="absolute inset-0"
              initial={false}
              animate={{ 
                opacity: activeIndex === i ? 1 : 0,
                scale: activeIndex === i ? 1 : 1.1,
                zIndex: activeIndex === i ? 10 : 0
              }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = Math.abs(offset.x) * velocity.x;
                if (swipe < -100 || offset.x < -50) {
                  nextImage();
                } else if (swipe > 100 || offset.x > 50) {
                  prevImage();
                }
              }}
            >
              <img 
                src={image.url} 
                alt={image.caption} 
                className="w-full h-full object-cover pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-8 left-8 text-white font-serif text-2xl md:text-3xl font-medium tracking-wide">
                {image.caption}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
