import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/gallery")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setImages(data);
      })
      .catch(console.error);
  }, []);

  const openLightbox = (index: number) => setSelectedImageIndex(index);
  const closeLightbox = () => setSelectedImageIndex(null);

  const prevImage = () => {
    setSelectedImageIndex(prev => prev !== null ? (prev === 0 ? images.length - 1 : prev - 1) : null);
  };

  const nextImage = () => {
    setSelectedImageIndex(prev => prev !== null ? (prev === images.length - 1 ? 0 : prev + 1) : null);
  };

  return (
    <div className="min-h-screen bg-brand-bg font-sans selection:bg-brand-accent selection:text-white flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-20 px-6 md:px-16">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <h1 className="font-serif text-5xl md:text-6xl text-brand-text mb-4">Nasza Galeria</h1>
            <p className="font-sans text-brand-text/60 text-lg max-w-md">
              Zajrzyj do naszego gabinetu. Zobacz efekty naszej pracy i poznaj przestrzeń, którą dla Ciebie stworzyliśmy.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {images.map((img, idx) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group cursor-pointer flex flex-col"
                onClick={() => openLightbox(idx)}
              >
                <div className="relative aspect-square overflow-hidden rounded-[24px] bg-black/5 mb-4">
                  <img src={img.url} alt={img.caption || "Galeria"} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <h3 className="font-serif text-xl text-brand-text mb-1">{img.caption || "Bez tytułu"}</h3>
                <p className="font-sans text-sm text-brand-text/60 line-clamp-2">{img.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />

      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-sm"
          >
            <button onClick={closeLightbox} className="absolute top-6 right-6 p-2 text-white/50 hover:text-white transition-colors">
              <X className="w-8 h-8" />
            </button>
            <button onClick={prevImage} className="absolute left-6 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white transition-colors">
              <ChevronLeft className="w-10 h-10" />
            </button>
            <button onClick={nextImage} className="absolute right-6 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white transition-colors">
              <ChevronRight className="w-10 h-10" />
            </button>
            <div className="w-full max-w-5xl max-h-[85vh] px-16 flex flex-col items-center">
              <img src={images[selectedImageIndex].url} alt={images[selectedImageIndex].caption} className="max-w-full max-h-[70vh] object-contain rounded-lg" />
              <div className="mt-8 text-center max-w-2xl">
                <h3 className="font-serif text-2xl text-white mb-2">{images[selectedImageIndex].caption}</h3>
                <p className="font-sans text-white/60">{images[selectedImageIndex].description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
