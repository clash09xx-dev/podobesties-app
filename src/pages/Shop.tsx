import React from "react";
import { motion } from "motion/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EditableSection from "../components/EditableSection";

export default function Shop() {
  return (
    <div className="bg-brand-cream min-h-screen font-sans selection:bg-brand-accent selection:text-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24 px-6 lg:px-16 max-w-[1400px] mx-auto w-full">
        <EditableSection id="shop_page" name="Nagłówek Sklepu">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-20"
          >
            <h1 className="font-serif text-5xl md:text-7xl text-brand-dark font-light mb-8">
              Sklep PODOBESTIES
            </h1>
            <p className="font-sans text-brand-text/70 text-lg md:text-xl leading-relaxed mb-8 max-w-xl mx-auto">
              Już wkrótce znajdziesz tutaj starannie wybrane produkty do profesjonalnej pielęgnacji stóp.
            </p>
            
            <div className="inline-block border border-black/10 rounded-full px-6 py-3 bg-white/50 backdrop-blur-sm">
              <p className="font-sans text-sm text-brand-text/60">
                Pracujemy nad ofertą. Zapraszamy ponownie wkrótce.
              </p>
            </div>
          </motion.div>
        </EditableSection>
      </main>
      
      <Footer />
    </div>
  );
}
