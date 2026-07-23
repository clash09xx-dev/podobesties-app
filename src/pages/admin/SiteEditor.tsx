import React, { useEffect, useState } from "react";
import Landing from "../Landing";
import Blog from "../Blog";
import Shop from "../Shop";
import Training from "../Training";
import { useEditMode } from "../../context/EditModeContext";
import { X, ChevronRight, Save, Image as ImageIcon, AlertCircle, CheckCircle2 } from "lucide-react";
import { useImageUpload } from "../../components/admin/ImageUploadWidget";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function SiteEditor() {
  const { setIsEditing } = useEditMode();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  const [settings, setSettings] = useState<any>({});
  const [globalSettings, setGlobalSettings] = useState<any>({});
  const [blogSettings, setBlogSettings] = useState<any>({});
  const [shopSettings, setShopSettings] = useState<any>({});
  const [trainingSettings, setTrainingSettings] = useState<any>({});
  
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  
  const [activePage, setActivePage] = useState("landing");
  
  const { openWidget } = useImageUpload();

  useEffect(() => {
    const timeout = new Promise((resolve) => setTimeout(() => resolve({}), 3000));
    Promise.all([
      Promise.race([getDoc(doc(db, "settings", "landing")).then(d => d.exists() ? d.data() : {}).catch(() => ({})), timeout]),
      Promise.race([getDoc(doc(db, "settings", "global")).then(d => d.exists() ? d.data() : {}).catch(() => ({})), timeout]),
      Promise.race([getDoc(doc(db, "settings", "blog")).then(d => d.exists() ? d.data() : {}).catch(() => ({})), timeout]),
      Promise.race([getDoc(doc(db, "settings", "shop")).then(d => d.exists() ? d.data() : {}).catch(() => ({})), timeout]),
      Promise.race([getDoc(doc(db, "settings", "training")).then(d => d.exists() ? d.data() : {}).catch(() => ({})), timeout]),
    ]).then(([landingData, globalData, blogData, shopData, trainingData]) => {
      setSettings(landingData || {});
      setGlobalSettings(globalData || {});
      setBlogSettings(blogData || {});
      setShopSettings(shopData || {});
      setTrainingSettings(trainingData || {});
      setLoading(false);
    });
  }, []);

  
  useEffect(() => {
    setTimeout(() => {
      fetch('/api/log-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dom: document.body.innerHTML.substring(0, 5000), loading: loading, settings: settings })
      }).catch(() => {});
    }, 5000);
  }, [loading]);

  useEffect(() => {
    setIsEditing(true);
    const handleEditSection = (e: any) => {
      setActiveSection(e.detail);
      setDrawerOpen(true);
    };
    window.addEventListener('edit-section', handleEditSection);
    
    return () => {
      setIsEditing(false);
      window.removeEventListener('edit-section', handleEditSection);
    };
  }, [setIsEditing]);

  const handleFieldChange = (section: string, field: string, value: any) => {
    if (section === "global") {
      setGlobalSettings(prev => ({ ...prev, [field]: value }));
    } else if (section === "blog_page") {
      setBlogSettings(prev => ({ ...prev, [field]: value }));
    } else if (section === "shop_page") {
      setShopSettings(prev => ({ ...prev, [field]: value }));
    } else if (section === "training_page") {
      setTrainingSettings(prev => ({ ...prev, [field]: value }));
    } else {
      setSettings(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    }
  };

  const handleSave = async () => {
    setSaveStatus("loading");
    try {
      // Save landing
      await setDoc(doc(db, "settings", "landing"), settings);
      // Save global, blog, shop, training
      await setDoc(doc(db, "settings", "global"), globalSettings);
      await setDoc(doc(db, "settings", "blog"), blogSettings);
      await setDoc(doc(db, "settings", "shop"), shopSettings);
      await setDoc(doc(db, "settings", "training"), trainingSettings);
      
      setSaveStatus("success");
      setMessage("Zmiany zostały zapisane");
      setTimeout(() => setDrawerOpen(false), 1500);
    } catch (err) {
      setSaveStatus("error");
      setMessage("Wystąpił błąd podczas zapisu");
    }
  };

  const heroSettings = settings.hero || {};
  const aboutSettings = settings.about || {};
  const servicesSettings = settings.services || {};
  const contactSettings = settings.contact || {};

  return (
    <div className="relative w-full h-full bg-brand-bg overflow-x-hidden">
      {/* Editor Navigation */}
      <div className="fixed top-6 right-6 z-[200] flex gap-2">
        <select 
          value={activePage}
          onChange={(e) => setActivePage(e.target.value)}
          className="bg-black/80 backdrop-blur-md text-white border border-white/10 px-4 py-2 rounded-full text-sm font-medium hover:bg-black transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <option value="landing">Strona Główna</option>
          <option value="szkolenia">Szkolenia</option>
          <option value="blog">Blog</option>
          <option value="sklep">Sklep</option>
        </select>
      </div>

      <div className="w-full h-full overflow-y-auto">
        {!loading && (
          <div className="pointer-events-auto">
            {activePage === "landing" && <Landing landingData={settings} />}
            {activePage === "blog" && <Blog />}
            {activePage === "sklep" && <Shop />}
            {activePage === "szkolenia" && <Training />}
          </div>
        )}
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[300]" onClick={() => setDrawerOpen(false)} />
      )}
      
      <aside className={`fixed top-0 right-0 h-full w-[400px] bg-[#0A0A0A] border-l border-white/10 z-[400] transform transition-transform duration-500 ease-[0.16,1,0.3,1] ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <h2 className="text-white font-serif text-xl flex items-center gap-2">
              <ChevronRight className="w-5 h-5 text-white/50" />
              Edycja: <span className="capitalize">{activeSection?.replace('_page', '')}</span>
            </h2>
            <button onClick={() => setDrawerOpen(false)} className="text-white/50 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeSection === "global" && (
              <div className="space-y-4">
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-widest font-bold mb-2 block">Logo / Nazwa firmy</label>
                  <input value={globalSettings.brandName ?? "PODOBESTIES"} onChange={e => handleFieldChange("global", "brandName", e.target.value)} className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg p-3 text-sm text-white" />
                </div>
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-widest font-bold mb-2 block">Link do Instagrama</label>
                  <input value={globalSettings.instagramUrl ?? ""} onChange={e => handleFieldChange("global", "instagramUrl", e.target.value)} className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg p-3 text-sm text-white" />
                </div>
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-widest font-bold mb-2 block">Link do Facebooka</label>
                  <input value={globalSettings.facebookUrl ?? ""} onChange={e => handleFieldChange("global", "facebookUrl", e.target.value)} className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg p-3 text-sm text-white" />
                </div>
                <div className="pt-4 border-t border-white/10">
                  <label className="text-white text-sm font-medium mb-4 block">Teksty przycisków w menu</label>
                  {(Array.isArray(globalSettings.navLinks) ? globalSettings.navLinks : [
                    { name: "Usługi", href: "/#services" },
                    { name: "Szkolenia", href: "/szkolenia" },
                    { name: "Blog", href: "/blog" },
                    { name: "Sklep", href: "/sklep" },
                    { name: "Opinie", href: "/#reviews" },
                    { name: "Kontakt", href: "/#contact" }
                  ]).map((link: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 mb-2">
                      <span className="text-white/40 text-xs w-16">{link.href}:</span>
                      <input value={link.name} onChange={e => {
                        const newLinks = [...(globalSettings.navLinks || [
                          { name: "Usługi", href: "/#services" },
                          { name: "Szkolenia", href: "/szkolenia" },
                          { name: "Blog", href: "/blog" },
                          { name: "Sklep", href: "/sklep" },
                          { name: "Opinie", href: "/#reviews" },
                          { name: "Kontakt", href: "/#contact" }
                        ])];
                        newLinks[idx] = { ...newLinks[idx], name: e.target.value };
                        handleFieldChange("global", "navLinks", newLinks);
                      }} className="flex-1 bg-[#1A1A1A] border border-white/10 rounded-lg p-2 text-xs text-white" />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-widest font-bold mb-2 block">Tekst Przycisku "Umów Wizytę"</label>
                  <input value={globalSettings.bookingText ?? "Umów wizytę"} onChange={e => handleFieldChange("global", "bookingText", e.target.value)} className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg p-3 text-sm text-white" />
                </div>
              </div>
            )}
                        {activeSection === "blog_page" && (
              <div className="space-y-4">
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-widest font-bold mb-2 block">Nagłówek strony Blog</label>
                  <input value={blogSettings.headline ?? "Blog PODOBESTIES"} onChange={e => handleFieldChange("blog_page", "headline", e.target.value)} className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg p-3 text-sm text-white" />
                </div>
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-widest font-bold mb-2 block">Opis</label>
                  <textarea value={blogSettings.description ?? "Wkrótce pojawią się tutaj edukacyjne wpisy dotyczące zdrowia stóp, podologii, profilaktyki i profesjonalnej pielęgnacji."} onChange={e => handleFieldChange("blog_page", "description", e.target.value)} className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg p-3 text-sm text-white" rows={5}></textarea>
                </div>
              </div>
            )}
            
            {activeSection === "training_page" && (
              <div className="space-y-4">
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-widest font-bold mb-2 block">Etykieta (Tag)</label>
                  <input value={trainingSettings.tag ?? "Akademia PODOBESTIES"} onChange={e => handleFieldChange("training_page", "tag", e.target.value)} className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg p-3 text-sm text-white" />
                </div>
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-widest font-bold mb-2 block">Nagłówek szkoleń</label>
                  <input value={trainingSettings.headline ?? "Dzielimy się\nnaszą wiedzą"} onChange={e => handleFieldChange("training_page", "headline", e.target.value)} className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg p-3 text-sm text-white" />
                </div>
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-widest font-bold mb-2 block">Opis</label>
                  <textarea value={trainingSettings.description ?? "PODOBESTIES to nie tylko gabinet podologiczny, to także miejsce, w którym praktyczna wiedza spotyka się z pasją do nauczania. Dzielimy się sprawdzonymi procedurami."} onChange={e => handleFieldChange("training_page", "description", e.target.value)} className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg p-3 text-sm text-white" rows={5}></textarea>
                </div>
              </div>
            )}

            {activeSection === "shop_page" && (
              <div className="space-y-4">
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-widest font-bold mb-2 block">Nagłówek sklepu</label>
                  <input value={shopSettings.headline ?? "Sklep PODOBESTIES"} onChange={e => handleFieldChange("shop_page", "headline", e.target.value)} className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg p-3 text-sm text-white" />
                </div>
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-widest font-bold mb-2 block">Opis sklepu</label>
                  <textarea value={shopSettings.description ?? "Już wkrótce znajdziesz tutaj starannie wybrane produkty do profesjonalnej pielęgnacji stóp."} onChange={e => handleFieldChange("shop_page", "description", e.target.value)} className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg p-3 text-sm text-white" rows={4}></textarea>
                </div>
                <p className="text-white/40 text-xs italic mt-4">Pamiętaj, że pozostałe ustawienia sklepu znajdziesz w panelu administratora zakładka "Sklep".</p>
              </div>
            )}

{activeSection === "hero" && (
              <div className="space-y-4">
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-widest font-bold mb-2 block">Etykieta (Tag)</label>
                  <input value={heroSettings.topSubtitle ?? "PODOBESTIES\nSpecjalistyczna Podologia"} onChange={e => handleFieldChange("hero", "topSubtitle", e.target.value)} className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg p-3 text-sm text-white" />
                </div>
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-widest font-bold mb-2 block">Główny nagłówek</label>
                  <textarea value={heroSettings.headline ?? "Nowoczesna podologia\ni fizjoterapia."} onChange={e => handleFieldChange("hero", "headline", e.target.value)} className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg p-3 text-sm text-white" rows={3}></textarea>
                  <p className="text-white/30 text-[10px] mt-1">Użyj \n aby przejść do nowej linii</p>
                </div>
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-widest font-bold mb-2 block">Opis</label>
                  <textarea value={heroSettings.description ?? "Wyjątkowe miejsce na mapie Krakowa, gdzie zdrowie łączy się z profesjonalizmem w atmosferze premium."} onChange={e => handleFieldChange("hero", "description", e.target.value)} className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg p-3 text-sm text-white" rows={3}></textarea>
                </div>
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-widest font-bold mb-2 block">Tekst przycisku CTA</label>
                  <input value={heroSettings.ctaText ?? "Umów wizytę"} onChange={e => handleFieldChange("hero", "ctaText", e.target.value)} className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg p-3 text-sm text-white" />
                </div>
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-widest font-bold mb-2 block">Zdjęcie w tle</label>
                  <div className="flex gap-2 items-center">
                    {heroSettings.bgImage && (
                      <img src={heroSettings.bgImage} alt="Hero" className="w-12 h-12 rounded object-cover border border-white/10" />
                    )}
                    <button onClick={() => openWidget(url => handleFieldChange("hero", "bgImage", url))} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-3 py-2 rounded-lg text-xs transition-colors">
                      <ImageIcon className="w-4 h-4" /> Zmień
                    </button>
                  </div>
                </div>
              </div>
            )}
            {activeSection === "about" && (
              <div className="space-y-4">
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-widest font-bold mb-2 block">Nagłówek sekcji</label>
                  <input value={aboutSettings.headline ?? "Podologia na najwyższym poziomie.\nW centrum Krakowa."} onChange={e => handleFieldChange("about", "headline", e.target.value)} className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg p-3 text-sm text-white" />
                </div>
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-widest font-bold mb-2 block">Treść</label>
                  <textarea value={aboutSettings.text ?? "Łączymy wieloletnie doświadczenie z nowoczesnym sprzętem medycznym. Skupiamy się na indywidualnym planie terapii dla każdego pacjenta, by leczenie było skuteczne, a efekty długotrwałe."} onChange={e => handleFieldChange("about", "text", e.target.value)} className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg p-3 text-sm text-white" rows={6}></textarea>
                </div>
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-widest font-bold mb-2 block">Zdjęcie</label>
                  <div className="flex gap-2 items-center">
                    {aboutSettings.image && (
                      <img src={aboutSettings.image} alt="About" className="w-12 h-12 rounded object-cover border border-white/10" />
                    )}
                    <button onClick={() => openWidget(url => handleFieldChange("about", "image", url))} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-3 py-2 rounded-lg text-xs transition-colors">
                      <ImageIcon className="w-4 h-4" /> Zmień
                    </button>
                  </div>
                </div>
              </div>
            )}
            {activeSection === "services" && (
              <div className="space-y-4">
                <p className="text-white text-sm mb-4">Ustawienia sekcji "Usługi"</p>
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-widest font-bold mb-2 block">Nagłówek</label>
                  <input value={servicesSettings.headline ?? "Nasze Usługi"} onChange={e => handleFieldChange("services", "headline", e.target.value)} className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg p-3 text-sm text-white" />
                </div>
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-widest font-bold mb-2 block">Podtytuł</label>
                  <textarea value={servicesSettings.subtitle ?? "Kompleksowa opieka łącząca nowoczesne technologie z wieloletnim doświadczeniem."} onChange={e => handleFieldChange("services", "subtitle", e.target.value)} className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg p-3 text-sm text-white" rows={3}></textarea>
                </div>
              </div>
            )}

            {activeSection === "contact" && (
              <div className="space-y-4">
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-widest font-bold mb-2 block">Nagłówek sekcji</label>
                  <input value={contactSettings.headline ?? "Jesteśmy tu dla Ciebie."} onChange={e => handleFieldChange("contact", "headline", e.target.value)} className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg p-3 text-sm text-white" />
                </div>
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-widest font-bold mb-2 block">Adres</label>
                  <textarea value={contactSettings.address ?? "PodoBesties\nul. Długa 12/3\n31-146 Kraków"} onChange={e => handleFieldChange("contact", "address", e.target.value)} className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg p-3 text-sm text-white" rows={3}></textarea>
                </div>
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-widest font-bold mb-2 block">Telefon</label>
                  <input value={contactSettings.phone ?? "+48 123 456 789"} onChange={e => handleFieldChange("contact", "phone", e.target.value)} className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg p-3 text-sm text-white" />
                </div>
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-widest font-bold mb-2 block">E-mail</label>
                  <input value={contactSettings.email ?? "kontakt@podobesties.pl"} onChange={e => handleFieldChange("contact", "email", e.target.value)} className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg p-3 text-sm text-white" />
                </div>
              </div>
            )}
          </div>
          
          <div className="p-6 border-t border-white/5 bg-[#0A0A0A] shrink-0">

            {saveStatus !== "idle" && (
              <div className={`mb-4 p-3 rounded-xl flex items-center gap-2 text-sm ${saveStatus === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                {saveStatus === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                {message}
              </div>
            )}
            <div className="flex flex-col gap-3">
              <button onClick={handleSave} className="w-full bg-brand-text text-white py-3 rounded-xl text-sm font-medium hover:bg-black transition-colors flex items-center justify-center gap-2">
                <Save className="w-4 h-4" /> Zapisz zmiany
              </button>
              <button onClick={() => setDrawerOpen(false)} className="w-full bg-transparent border border-white/10 text-white/50 py-3 rounded-xl text-sm hover:bg-white/5 hover:text-white transition-colors">
                Anuluj
              </button>
            </div>
        
        </div>
        </div>
      </aside>
    </div>
  );
}