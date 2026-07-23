import { motion } from 'motion/react';

export default function Contact({ data = {} }: { data?: any }) {
  return (
    <section id="contact" className="relative w-full py-32 lg:py-48 px-6 lg:px-16 bg-brand-bg border-t border-brand-text/5 overflow-hidden">
      <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-20">
        
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-50px" }}
           transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-serif text-5xl lg:text-7xl text-brand-text mb-16 whitespace-pre-line">{data.headline || "Kontakt"}</h2>
          
          <div className="space-y-12">
            <div>
              <p className="font-ui uppercase tracking-widest text-[11px] font-bold text-brand-text/40 mb-3">Lokalizacja</p>
              <p className="font-serif text-3xl text-brand-text leading-tight whitespace-pre-line">{data.address || "Lipska 16\n30-721 Kraków"}</p>
            </div>
            <div>
              <p className="font-ui uppercase tracking-widest text-[11px] font-bold text-brand-text/40 mb-3">Telefon</p>
              <a href={`tel:${data.phone || "530195525"}`} className="font-serif text-3xl text-brand-text hover:text-brand-text/60 transition-colors">{data.phone || "530 195 525"}</a>
            </div>
            <div>
              <p className="font-ui uppercase tracking-widest text-[11px] font-bold text-brand-text/40 mb-3">E-mail</p>
              <a href={`mailto:${data.email || "kontakt@podobesties.pl"}`} className="font-serif text-3xl text-brand-text hover:text-brand-text/60 transition-colors">{data.email || "kontakt@podobesties.pl"}</a>
            </div>
          </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
           className="aspect-[4/3] rounded-[40px] overflow-hidden bg-brand-cream relative"
        >
           <iframe 
             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2562.336496695371!2d19.98671827670732!3d50.04026857152066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4716456ef4897ba5%3A0xa0c8b0391c00e5a3!2sPodoBesties%20-%20Gabinet%20Podologiczny!5e0!3m2!1sen!2spl!4v1703273180!5m2!1sen!2spl" 
             width="100%" 
             height="100%" 
             style={{ border: 0 }} 
             allowFullScreen 
             loading="lazy" 
             referrerPolicy="no-referrer-when-downgrade"
           />
        </motion.div>
      </div>
    </section>
  );
}