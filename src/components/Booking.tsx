import { motion } from "motion/react";
import React from "react";

export default function Booking() {
  return (
    <section id="booking" className="relative w-full py-32 lg:py-48 px-6 lg:px-16 bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto grid xl:grid-cols-[1fr_1.2fr] gap-20 items-center">
        
        {/* Texts */}
        <motion.div
           initial={{ opacity: 0, x: -40 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-serif text-5xl lg:text-7xl text-brand-text leading-[1.1] mb-8">Umów wizytę</h2>
          <p className="font-sans text-lg text-brand-text/60 max-w-md font-light leading-relaxed mb-16">
            Wybierz interesującą Cię usługę i sprawne przejdź do systemu rezerwacji Booksy, aby wybrać najdogodniejszy dla Ciebie termin.
          </p>

          <div className="flex flex-col items-start p-8 lg:p-10 rounded-[32px] border border-brand-text/10 bg-white/40 backdrop-blur-sm transition-all mb-8 shadow-sm hover:shadow-xl hover:border-brand-text/20">
            <div className="font-ui text-xs font-bold uppercase tracking-widest text-brand-text/40 mb-4">PIERWSZA WIZYTA</div>
            <h3 className="font-serif text-3xl lg:text-4xl mb-4 text-brand-text leading-tight">Masz pytania przed pierwszą wizytą?</h3>
            <p className="font-sans text-base text-brand-text/60 font-light leading-relaxed mb-8">
              Chętnie pomożemy dobrać odpowiednią terapię, wyjaśnimy przebieg wizyty i odpowiemy na wszystkie pytania dotyczące leczenia oraz pielęgnacji stóp.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <a 
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-brand-text text-white font-sans text-sm font-medium hover:bg-black/80 transition-colors"
              >
                Skontaktuj się
              </a>
              <a 
                href="tel:+48535356311"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-brand-text/20 text-brand-text font-sans text-sm font-medium hover:border-brand-text/40 bg-white transition-colors"
              >
                Zadzwoń
              </a>
            </div>
          </div>
        </motion.div>

        {/* Booksy Widget */}
        <motion.div
           initial={{ opacity: 0, x: 40 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
           className="bg-white rounded-[40px] overflow-hidden border border-black/5 shadow-[0_20px_60px_rgba(0,0,0,0.03)] h-[700px]"
        >
          <iframe 
            src="https://booksy.com/widget/index.html?id=344243&businessId=&appointmentUid=&lang=pl&country=pl&mode=inline&theme=default" 
            className="w-full h-full border-none"
            title="Booksy Rezerwacja"
            allow="geolocation"
          />
        </motion.div>
      </div>
    </section>
  );
}
