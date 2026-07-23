import { motion } from "motion/react";
import EditableSection from "../components/EditableSection";
import { doc, onSnapshot, collection, query, orderBy, getDocs, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import { db } from "../lib/firebase";
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import { Check } from "lucide-react";

export default function Training() {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    phone: "",
    email: "",
    topic: "",
    message: ""
  });
  
  const [settings, setSettings] = useState<any>({});

  const [trainings, setTrainings] = useState<any[]>([]);

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const q = query(collection(db, "trainings"), where("status", "==", "published"), orderBy("order", "asc"));
        const snapshot = await getDocs(q);
        setTrainings(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch(err) {
        console.error(err);
      }
    };
    fetchTrainings();
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    
    const unsub = onSnapshot(doc(db, "settings", "training"), (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      }
    }, (err) => console.error(err));
    return () => unsub();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error("Failed");
      setIsSubmitted(true);
    } catch (err) {
      alert("Wystąpił błąd podczas wysyłania zapytania.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const topics = [
    "Wrastające paznokcie",
    "Klamry ortonyksyjne",
    "Brodawki wirusowe",
    "Hiperkeratozy",
    "Odciski i modzele",
    "Diagnostyka",
    "Inne"
  ];

  return (
    <div className="bg-brand-bg min-h-screen font-sans selection:bg-brand-accent selection:text-white">
      <Navbar />
      
      <main>
        {/* Hero */}
        <section className="relative pt-24 pb-8 px-6 lg:px-16 overflow-hidden">
          <div className="max-w-[1400px] mx-auto text-center relative z-10">
            <EditableSection id="training_page" name="Nagłówek Szkoleń">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block border border-black/10 rounded-full px-4 py-1.5 mb-6 bg-white/50 backdrop-blur-sm"
              >
                <span className="font-sans text-[11px] uppercase tracking-widest font-bold text-brand-text/60">
                  {settings.tag || "Akademia PODOBESTIES"}
                </span>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-3xl md:text-4xl lg:text-[44px] text-brand-dark font-light mb-16 max-w-2xl mx-auto whitespace-pre-line leading-[1.15]"
              >
                {settings.headline || "Dzielimy się\nnaszą wiedzą"}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="font-sans text-brand-text/70 text-base md:text-lg leading-relaxed max-w-xl mx-auto whitespace-pre-line"
              >
                {settings.description || "PODOBESTIES to nie tylko gabinet podologiczny, to także miejsce, w którym praktyczna wiedza spotyka się z pasją do nauczania. Dzielimy się sprawdzonymi procedurami."}
              </motion.p>
            </EditableSection>
          </div>
        </section>

        {/* Dla Kogo & Dlaczego */}
        <section className="py-32 px-6 lg:px-16">
          <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1 }}
            >
              <h2 className="font-serif text-4xl text-brand-text mb-12">Dla kogo są nasze szkolenia?</h2>
              <div className="grid gap-6">
                {["Początkujący podolodzy", "Kosmetolodzy", "Osoby rozwijające swój gabinet", "Specjaliści chcący poszerzyć praktykę"].map((item, i) => (
                  <div key={i} className="bg-brand-cream border border-black/5 p-8 rounded-3xl flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-brand-accent/10 flex items-center justify-center shrink-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-brand-accent" />
                    </div>
                    <span className="font-sans font-medium text-brand-text">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1 }}
            >
              <h2 className="font-serif text-4xl text-brand-text mb-12">Dlaczego PODOBESTIES?</h2> 
              <div className="grid gap-6">
                {["Praktyczne podejście", "Realne przypadki gabinetowe", "Małe grupy i indywidualna opieka", "Nacisk na bezpieczeństwo i higienę", "Zajęcia prowadzone przez praktyków z wieloletnim stażem"].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <Check className="w-6 h-6 text-brand-accent shrink-0 mt-0.5" />
                    <span className="font-sans text-brand-text leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Zakres Szkoleń */}
        <section className="py-32 bg-brand-cream px-6 lg:px-16 border-y border-black/5">
          <div className="max-w-[1400px] mx-auto">
            <h2 className="font-serif text-4xl lg:text-5xl text-brand-text mb-6 text-center">Zakres Szkoleń</h2>
            <EditableSection id="training_page" name="Opis zakresu szkoleń">
              <p className="font-sans text-brand-text/70 text-center max-w-3xl mx-auto mb-16 text-lg whitespace-pre-line">
                {settings.zakresOpis || "Poznaj naszą ofertę szkoleniową stworzoną z myślą o profesjonalistach. Przekazujemy kompleksową wiedzę opartą na wieloletnim doświadczeniu gabinetowym."}
              </p>
            </EditableSection>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trainings.map((item, i) => (
                <Link to={`/szkolenia/${item.slug}`} key={item.id}>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-brand-bg border border-black/5 p-8 rounded-[32px] h-full flex flex-col hover:border-brand-accent/50 transition-colors group cursor-pointer"
                  >
                    {item.image && (
                       <div className="w-full h-48 bg-brand-cream rounded-2xl mb-6 overflow-hidden">
                         <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                       </div>
                    )}
                    <h3 className="font-serif text-2xl text-brand-text mb-4 group-hover:text-brand-accent transition-colors">{item.title}</h3>
                    <p className="font-sans text-brand-text/60 line-clamp-3 mb-6 flex-grow text-sm">{item.description}</p>
                    <div className="mt-auto flex items-center text-brand-accent font-sans font-medium text-sm gap-2">
                       <span>Czytaj więcej</span>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Formularz Zapytania */}
        <section id="training-form" className="py-32 px-6 lg:px-16">
          <div className="max-w-[800px] mx-auto bg-brand-cream border border-black/5 p-12 lg:p-16 rounded-[40px]">
            <h2 className="font-serif text-4xl text-brand-text mb-10 text-center">Zapytaj o szkolenie</h2>
            
            {isSubmitted ? (
               <div className="bg-brand-bg border border-brand-accent/20 rounded-3xl p-12 text-center">
                  <div className="w-16 h-16 bg-brand-cream text-brand-accent rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-2xl text-brand-text mb-3">Zapytanie wysłane</h3>
                  <p className="font-sans text-brand-text/60">Dziękujemy za kontakt. Odpowiemy najszybciej jak to możliwe.</p>
               </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <input required name="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} type="text" placeholder="Imię" className="w-full bg-transparent border-b border-black/10 py-3 outline-none font-sans placeholder:text-brand-text/40 text-brand-text focus:border-brand-accent transition-colors" />
                  <input required name="lastName" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} type="text" placeholder="Nazwisko" className="w-full bg-transparent border-b border-black/10 py-3 outline-none font-sans placeholder:text-brand-text/40 text-brand-text focus:border-brand-accent transition-colors" />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <input required name="phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} type="tel" placeholder="Telefon" className="w-full bg-transparent border-b border-black/10 py-3 outline-none font-sans placeholder:text-brand-text/40 text-brand-text focus:border-brand-accent transition-colors" />
                  <input required name="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} type="email" placeholder="Email" className="w-full bg-transparent border-b border-black/10 py-3 outline-none font-sans placeholder:text-brand-text/40 text-brand-text focus:border-brand-accent transition-colors" />
                </div>
                
                <select required name="topic" value={formData.topic} onChange={e => setFormData({ ...formData, topic: e.target.value })} className="w-full bg-transparent border-b border-black/10 py-3 outline-none font-sans text-brand-text cursor-pointer appearance-none focus:border-brand-accent transition-colors">
                  <option value="" disabled className="text-brand-text/40">Wybierz temat szkolenia</option>
                  {trainings.map((t) => <option key={t.id} value={t.title}>{t.title}</option>)}
                </select>
                <textarea required name="message" value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} placeholder="Wiadomość / Zapytanie" className="w-full bg-transparent border-b border-black/10 py-3 outline-none font-sans placeholder:text-brand-text/40 text-brand-text resize-none focus:border-brand-accent transition-colors" rows={4} />
                <button type="submit" disabled={isSubmitting} className="w-full bg-brand-text text-brand-bg py-5 rounded-full font-sans font-medium mt-8 hover:bg-brand-text/90 transition-colors disabled:opacity-50">
                  {isSubmitting ? "Wysyłanie..." : "Wyślij zapytanie"}
                </button>
              </form>
            )}
            
          </div>
        </section>
      </main>
      <Contact />
      <Footer />
    </div>
  );
}
