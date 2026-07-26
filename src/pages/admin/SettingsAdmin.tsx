import React, { useState, useEffect } from "react";
import { Save, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

export default function SettingsAdmin() {
  const [apiKey, setApiKey] = useState("");
  const [placeId, setPlaceId] = useState("");
  
  const [instagramUrl, setInstagramUrl] = useState("https://www.instagram.com/podobesties?igsh=NndiMG9rcHdweGg0");
  const [facebookUrl, setFacebookUrl] = useState("https://www.facebook.com/share/1Ji65Jpucg/?mibextid=wwXIfr");
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [statusPassword, setStatusPassword] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [messagePassword, setMessagePassword] = useState("");
  
  const [statusGoogle, setStatusGoogle] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [messageGoogle, setMessageGoogle] = useState("");
  const [statusSocial, setStatusSocial] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [messageSocial, setMessageSocial] = useState("");
  const [lastSync, setLastSync] = useState("");

  useEffect(() => {
    fetch("/api/settings/google", {
      headers: { "Authorization": `Bearer ${localStorage.getItem("adminToken")}` }
    })
      .then(r => r.json())
      .then(data => {
        if (data.apiKey) setApiKey(data.apiKey);
        if (data.placeId) setPlaceId(data.placeId);
        if (data.lastSync) setLastSync(data.lastSync);
      }).catch(err => console.error(err));

    
    fetch("/api/settings/global", {
      headers: { "Authorization": `Bearer ${localStorage.getItem("adminToken")}` }
    })
      .then(r => r.json())
      .then(data => {
        if (data.instagramUrl) setInstagramUrl(data.instagramUrl);
        if (data.facebookUrl) setFacebookUrl(data.facebookUrl);
      }).catch(err => console.error(err));
  }, []);

  const handleSaveGoogle = async () => {
    setStatusGoogle("loading");
    try {
      const res = await fetch("/api/settings/google", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("adminToken")}`
        },
        body: JSON.stringify({ apiKey, placeId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatusGoogle("success");
      setMessageGoogle("Zapisano Google pomyślnie. Rozpoczynam pobieranie opinii...");
      await handleSync();
    } catch (err: any) {
      setStatusGoogle("error");
      setMessageGoogle(err.message || "Błąd zapisu.");
    }
  };

  
  const handleSaveSocial = async () => {
    setStatusSocial("loading");
    try {
      const res = await fetch("/api/settings/global", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("adminToken")}`
        },
        body: JSON.stringify({ instagramUrl, facebookUrl })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatusSocial("success");
      setMessageSocial("Zapisano ustawienia social media pomyślnie.");
    } catch (err: any) {
      setStatusSocial("error");
      setMessageSocial(err.message || "Błąd zapisu.");
    }
  };


  const handleSync = async () => {
    setStatusGoogle("loading");
    try {
      const res = await fetch("/api/settings/google/sync", {
        method: "POST",
        headers: { "Authorization": `Bearer ${localStorage.getItem("adminToken")}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatusGoogle("success");
      setMessageGoogle("Pobrano opinie.");
      if (data.lastSync) setLastSync(data.lastSync);
    } catch (err: any) {
      setStatusGoogle("error");
      setMessageGoogle(err.message || "Błąd synchronizacji.");
    }
  };

  const handleSavePassword = async () => {
    setStatusPassword("loading");
    setMessagePassword("");
    if (!newPassword || !confirmPassword) {
      setStatusPassword("error");
      setMessagePassword("Wypełnij oba pola hasła.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatusPassword("error");
      setMessagePassword("Hasła nie pasują do siebie.");
      return;
    }
    if (newPassword.length < 8) {
      setStatusPassword("error");
      setMessagePassword("Hasło musi mieć co najmniej 8 znaków.");
      return;
    }
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`
        },
        body: JSON.stringify({ newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setStatusPassword("success");
      setMessagePassword("Hasło zostało zmienione. Za chwilę zalogujesz się ponownie.");
      setNewPassword("");
      setConfirmPassword("");
      window.setTimeout(() => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("demoToken");
        window.location.assign("/admin");
      }, 1400);
    } catch (error: any) {
      setStatusPassword("error");
      setMessagePassword(error.message || "Błąd podczas zmiany hasła.");
    }
  };

  return (
    <div className="animate-in fade-in duration-700 max-w-2xl">
      <header className="mb-10">
        <h1 className="text-4xl font-serif text-white tracking-tight mb-2">Ustawienia</h1>
        <p className="text-white/50 font-sans text-sm font-light">Konfiguracja strony</p>
      </header>

      <div className="space-y-8">
        <div className="bg-[#111111] border border-white/5 p-8 rounded-[32px] space-y-6">
          <h2 className="text-xl font-serif text-white mb-4">Integracje: Google Reviews</h2>
          
          <div className="space-y-2">
            <label className="text-white/50 text-xs uppercase tracking-widest font-bold">Google Places API Key</label>
            <input 
              type="text" 
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/30" 
              placeholder="Wprowadź nowy klucz aby zmienić..." 
            />
            <p className="text-[10px] text-white/30">Klucz jest szyfrowany i przechowywany bezpiecznie. Jeśli widzisz zamaskowany ciąg, oznacza to, że klucz jest już ustawiony.</p>
          </div>

          <div className="space-y-2">
            <label className="text-white/50 text-xs uppercase tracking-widest font-bold">Google Place ID</label>
            <input 
              type="text" 
              value={placeId}
              onChange={e => setPlaceId(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/30" 
              placeholder="ChIJ..." 
            />
          </div>
          
          {statusGoogle !== "idle" && (
            <div className={`p-4 rounded-xl flex items-center gap-3 text-sm ${statusGoogle === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
              {statusGoogle === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              {messageGoogle}
            </div>
          )}

          <div className="flex items-center gap-4 pt-4 border-t border-white/5">
            <button onClick={handleSaveGoogle} className="flex items-center gap-2 bg-brand-text text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-black">
              <Save className="w-4 h-4" /> Zapisz
            </button>
            <button onClick={handleSync} className="flex items-center gap-2 bg-transparent border border-white/20 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-white/5">
              <RefreshCw className="w-4 h-4" /> Pobierz opinie teraz
            </button>
          </div>
          {lastSync && (
            <p className="text-white/40 text-xs">Ostatnia synchronizacja: {lastSync}</p>
          )}
        </div>

        
        <div className="bg-[#111111] border border-white/5 p-8 rounded-[32px] space-y-6">
          <h2 className="text-xl font-serif text-white mb-4">Social Media</h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-white/50 text-xs uppercase tracking-widest font-bold">Link Instagram</label>
              <input 
                type="text" 
                value={instagramUrl}
                onChange={e => setInstagramUrl(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/30" 
                placeholder="https://instagram.com/..." 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-white/50 text-xs uppercase tracking-widest font-bold">Link Facebook</label>
              <input 
                type="text" 
                value={facebookUrl}
                onChange={e => setFacebookUrl(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/30" 
                placeholder="https://facebook.com/..." 
              />
            </div>
          </div>
          
          {statusSocial !== "idle" && (
            <div className={`p-4 rounded-xl flex items-center gap-3 text-sm ${statusSocial === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
              {statusSocial === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              {messageSocial}
            </div>
          )}
          <div className="flex items-center gap-4 pt-4 border-t border-white/5">
            <button onClick={handleSaveSocial} className="flex items-center gap-2 bg-brand-text text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-black">
              <Save className="w-4 h-4" /> Zapisz social media
            </button>
          </div>
        </div>

        <div className="bg-[#111111] border border-white/5 p-8 rounded-[32px] space-y-6">
          <div>
            <h2 className="text-xl font-serif text-white mb-2">Zmiana Hasła</h2>
            <p className="text-white/40 text-sm">Zmień hasło logowania do panelu administratora.</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Nowe hasło</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-text" 
                placeholder="Wprowadź nowe hasło" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Potwierdź nowe hasło</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-text" 
                placeholder="Potwierdź nowe hasło" 
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-6">
            <div className="flex-1">
              {statusPassword === "success" && <div className="flex items-center gap-2 text-green-400 text-sm"><CheckCircle2 className="w-4 h-4"/> {messagePassword}</div>}
              {statusPassword === "error" && <div className="flex items-center gap-2 text-red-400 text-sm"><AlertCircle className="w-4 h-4"/> {messagePassword}</div>}
            </div>
            <button onClick={handleSavePassword} className="flex items-center gap-2 bg-brand-text text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-black">
              <Save className="w-4 h-4" /> Zmień hasło
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
