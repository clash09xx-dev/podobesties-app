import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { Menu, X, Facebook, Instagram } from "lucide-react";
import { useGlobalSettings } from "../lib/useGlobalSettings";
import EditableSection from "./EditableSection";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const { settings, loading } = useGlobalSettings();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const defaultLinks = [
    { name: "Usługi", href: "/#services" },
    { name: "Galeria", href: "/galeria" },
    { name: "Szkolenia", href: "/szkolenia" },
    { name: "Blog", href: "/blog" },
    { name: "Sklep", href: "/sklep" },
    { name: "Opinie", href: "/#reviews" },
    { name: "Kontakt", href: "/#contact" },
  ];

  let navLinks = Array.isArray(settings?.navLinks) ? settings.navLinks : defaultLinks;
  
  // Ensure Galeria is always present if missing
  if (!navLinks.some((l: any) => l.name.toLowerCase() === "galeria" || l.href === "/galeria")) {
    navLinks = [
      navLinks[0] || { name: "Usługi", href: "/#services" },
      { name: "Galeria", href: "/galeria" },
      ...navLinks.slice(1)
    ];
  }

  const bookingText = settings?.bookingText || "Umów wizytę";
  const brandName = settings?.brandName || "PODOBESTIES";

  const insta = settings?.instagramUrl || "https://www.instagram.com/podobesties?igsh=NndiMG9rcHdweGg0";
  const fb = settings?.facebookUrl || "https://www.facebook.com/share/1Ji65Jpucg/?mibextid=wwXIfr";

  return (
    <>
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 w-full"
      >
        <div className={`
          w-full px-6 lg:px-16 flex items-center justify-between
          transition-all duration-700 ease-[0.16,1,0.3,1]
          ${scrolled || menuOpen
            ? "bg-brand-bg/60 backdrop-blur-2xl shadow-[0_2px_20px_rgba(0,0,0,0.02)] py-4" 
            : "bg-transparent py-6"
          }
        `}>
          <EditableSection id="global" name="Nawigacja">
            <a href="/" className="font-serif font-medium text-xl md:text-2xl tracking-wide text-brand-text select-none z-50 flex items-center gap-3">
              
              <span className="mt-1 md:mt-1.5">{brandName}</span>
            </a>
          </EditableSection>
          
          <div className="hidden lg:flex items-center gap-12 text-[13px] font-sans font-medium text-brand-text/70">
            <EditableSection id="global" name="Linki menu">
              <div className="flex items-center gap-12">
                {navLinks.map((item: any, i: number) => (
                  <a 
                    key={i} 
                    href={item.href} 
                    className="hover:text-brand-text transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </EditableSection>
          </div>

          <div className="flex items-center gap-4 z-50">
            <EditableSection id="global" name="Social Media">
              <div className="hidden md:flex items-center gap-4 mr-4 text-brand-text/80">
                <a href={fb} target="_blank" rel="noopener noreferrer" className="hover:text-brand-text transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href={insta} target="_blank" rel="noopener noreferrer" className="hover:text-brand-text transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </EditableSection>

            <EditableSection id="global" name="Przycisk">
              <a 
                href="/#booking"
                className="hidden md:inline-flex text-[13px] font-sans font-medium bg-brand-text text-brand-bg px-6 py-2.5 rounded-full hover:bg-brand-text/80 transition-colors"
              >
                {bookingText}
              </a>
            </EditableSection>

            <button 
              className="lg:hidden p-2 -mr-2 text-brand-text"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-brand-bg/95 backdrop-blur-3xl pt-24 px-6 flex flex-col"
          >
            <div className="flex flex-col gap-6 text-2xl font-serif text-brand-text mt-10">
              {navLinks.map((item: any, i: number) => (
                <a 
                  key={i} 
                  href={item.href} 
                  onClick={() => setMenuOpen(false)}
                  className="hover:opacity-60 transition-opacity"
                >
                  {item.name}
                </a>
              ))}
              
              <div className="flex items-center gap-6 mt-4">
                <a href={fb} target="_blank" rel="noopener noreferrer" className="hover:opacity-60 transition-opacity">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href={insta} target="_blank" rel="noopener noreferrer" className="hover:opacity-60 transition-opacity">
                  <Instagram className="w-6 h-6" />
                </a>
              </div>

              <div className="h-px w-full bg-brand-text/10 my-4" />
              
              <a 
                href="/#booking"
                onClick={() => setMenuOpen(false)}
                className="inline-flex text-lg justify-center font-sans font-medium bg-brand-text text-brand-bg px-8 py-4 rounded-full hover:bg-brand-text/80 transition-colors"
              >
                {bookingText}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
