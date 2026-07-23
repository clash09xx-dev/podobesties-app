import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  GraduationCap,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  LogOut,
  Globe,
  PenTool,
  Film
} from "lucide-react";
import { auth, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "../lib/firebase";
import AdminDashboard from "./admin/AdminDashboard";
import SiteEditor from "./admin/SiteEditor";
import TrainingAdmin from "./admin/TrainingAdmin";
import GalleryAdmin from "./admin/GalleryAdmin";
import FormsAdmin from "./admin/FormsAdmin";
import SettingsAdmin from "./admin/SettingsAdmin";
import BlogAdmin from "./admin/BlogAdmin";

export const IS_DEMO_MODE = true;

const DemoLocked = ({ feature, onBack }: { feature: string, onBack?: () => void }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-center">
    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
      <Settings className="w-8 h-8 text-white/30" />
    </div>
    <h3 className="text-2xl font-serif text-white mb-2">{feature} zablokowana</h3>
    <p className="text-white/40 max-w-md mx-auto">
      Ta sekcja jest zablokowana w wersji demonstracyjnej, aby zapobiec niepożądanym zmianom.
    </p>
    {onBack && (
      <button onClick={onBack} className="mt-8 px-6 py-3 bg-white text-black font-medium rounded-full hover:bg-white/90 transition-colors text-sm">
        Wróć
      </button>
    )}
  </div>
);

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem("adminToken"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [editorUnlocked, setEditorUnlocked] = useState(false);
  const [editorPassword, setEditorPassword] = useState("");

  const [activeTab, setActiveTab] = useState<
    "dashboard" | "editor" | "training" | "gallery" | "forms" | "settings" | "blog"
  >("dashboard");

  useEffect(() => {
    // Demo bypass
    const demoToken = localStorage.getItem("demoToken");
    if (demoToken === "admin-demo") {
      setToken("demo-admin-token");
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setLoading(true);

    try {
      if ((email === "demo@podobesties.pl" && password === "demo123") || 
          (email === "kontakt@podobesties.pl" && password === "test123")) {
        localStorage.setItem("adminToken", "demo-admin-token");
        setToken("demo-admin-token");
        setLoading(false);
        return;
      }
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: idToken })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      localStorage.setItem("adminToken", data.token);
      setToken(data.token);
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setAuthError("Nieprawidłowy e-mail lub hasło.");
      setLoading(false);
    }
  };

  

  const handleResetPassword = async () => {
    setAuthError("");
    setAuthSuccess("");
    if (!email) {
      setAuthError("Aby zresetować hasło, wpisz adres e-mail powyżej i kliknij link.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setAuthSuccess("Wysłano link do zresetowania hasła na podany adres.");
    } catch (error: any) {
      setAuthSuccess("Wysłano link do zresetowania hasła na podany adres.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("adminToken");
    setToken(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center font-sans">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6 font-sans">
        <form
          onSubmit={handleLogin}
          className="bg-[#111111] border border-white/5 p-10 rounded-[40px] w-full max-w-sm space-y-6 shadow-2xl"
        >
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-serif text-white tracking-tight mb-2">Workspace</h2>
            <p className="text-white/40 text-sm">Zaloguj się do panelu PODOBESTIES</p>
          </div>
          
          {authError && (
            <div className="text-red-400 text-sm bg-red-400/10 p-4 rounded-xl text-center">
              {authError}
            </div>
          )}
          {authSuccess && (
            <div className="text-green-400 text-sm bg-green-400/10 p-4 rounded-xl text-center">
              {authSuccess}
            </div>
          )}
          
          <div className="space-y-4">
            <input
              type="email"
              required
              placeholder="kontakt@podobesties.pl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-white/10 p-4 rounded-2xl text-white text-sm focus:outline-none focus:border-white/30 transition-colors"
            />
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-white/10 p-4 rounded-2xl text-white text-sm focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
          </div>
          
          <button type="submit" className="w-full bg-white text-black font-medium py-4 rounded-2xl hover:bg-white/90 transition-colors text-sm mt-4 shadow-xl">
            Zaloguj się
          </button>
        </form>
      </div>
    );
  }

  if (activeTab === "editor") {
    if (!editorUnlocked) {
      return (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col font-sans items-center justify-center">
          <div className="bg-[#111] border border-white/10 p-8 rounded-2xl max-w-sm w-full">
             <h3 className="text-xl text-white font-serif mb-4 text-center">Wymagane hasło</h3>
             <input type="password" value={editorPassword} onChange={e => setEditorPassword(e.target.value)} placeholder="Wprowadź hasło" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white mb-4 outline-none focus:border-brand-accent transition-colors" />
             <button onClick={() => { if (editorPassword === "Vibex123") setEditorUnlocked(true); else alert("Błędne hasło"); }} className="w-full bg-white text-black font-medium py-3 rounded-lg mb-2 hover:bg-white/90">Odblokuj</button>
             <button onClick={() => setActiveTab("dashboard")} className="w-full text-white/50 py-3 rounded-lg hover:text-white text-sm">Anuluj</button>
          </div>
        </div>
      );
    }
    return (
      <div className="fixed inset-0 bg-black z-[100] flex flex-col font-sans">
         <div className="absolute top-6 left-6 z-[200]">
            <button onClick={() => { setActiveTab("dashboard"); setEditorUnlocked(false); setEditorPassword(""); }} className="bg-black/50 backdrop-blur-md text-white border border-white/10 px-4 py-2 rounded-full text-xs font-medium hover:bg-black transition-colors flex items-center gap-2">
              <LogOut className="w-3 h-3 rotate-180" /> Powrót do Workspace
            </button>
         </div>
         <SiteEditor />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col md:flex-row font-sans selection:bg-brand-accent selection:text-white">
      <div className="md:hidden flex items-center justify-between p-6 bg-[#111111] border-b border-white/5 sticky top-0 z-50">
         <h2 className="text-xl font-serif text-white tracking-wide">PODOBESTIES</h2>
         <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
         </button>
      </div>
      <aside className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex fixed md:sticky top-0 z-40 w-full md:w-72 bg-[#111111] border-r border-white/5 p-8 flex-col h-screen overflow-y-auto`}>
        <div className="mb-14 hidden md:block">
          <h2 className="text-xl font-serif text-white tracking-wide">
            PODOBESTIES <span className="text-brand-accent text-sm ml-2 font-sans font-bold uppercase tracking-widest hidden lg:inline">Workspace</span>
          </h2>
        </div>
        
        <nav className="flex-1 space-y-1">
          <button
            onClick={() => { setActiveTab("dashboard"); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all ${activeTab === "dashboard" ? "bg-white/10 text-white font-medium" : "text-white/40 hover:text-white hover:bg-white/5"}`}
          >
            <LayoutDashboard className="w-4 h-4" /> 
            <span className="text-sm">Dashboard</span>
          </button>
          <a
            href="/"
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all text-white/40 hover:text-white hover:bg-white/5`}
          >
            <Globe className="w-4 h-4" /> 
            <span className="text-sm">Strona główna</span>
          </a>
          
          <div className="my-6 border-t border-white/5 px-4 pt-6 pb-2">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/20">Zarządzanie</span>
          </div>
          <button
            onClick={() => { setActiveTab("training"); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all ${activeTab === "training" ? "bg-white/10 text-white font-medium" : "text-white/40 hover:text-white hover:bg-white/5"}`}
          >
            <GraduationCap className="w-4 h-4" /> 
            <span className="text-sm">Szkolenia</span>
          </button>
          <button
            onClick={() => { setActiveTab("gallery"); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all ${activeTab === "gallery" ? "bg-white/10 text-white font-medium" : "text-white/40 hover:text-white hover:bg-white/5"}`}
          >
            <ImageIcon className="w-4 h-4" /> 
            <span className="text-sm">Galeria</span>
          </button>
          <button
            onClick={() => { setActiveTab("blog"); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all ${activeTab === "blog" ? "bg-white/10 text-white font-medium" : "text-white/40 hover:text-white hover:bg-white/5"}`}
          >
            <PenTool className="w-4 h-4" /> 
            <span className="text-sm">Blog</span>
          </button>
          
          <button
            onClick={() => { setActiveTab("forms"); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all ${activeTab === "forms" ? "bg-white/10 text-white font-medium" : "text-white/40 hover:text-white hover:bg-white/5"}`}
          >
            <MessageSquare className="w-4 h-4" /> 
            <span className="text-sm">Formularze kon.</span>
          </button>
          
          <div className="my-6 border-t border-white/5 px-4 pt-6 pb-2">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/20">System</span>
          </div>
          <button
            onClick={() => { setActiveTab("settings"); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all ${activeTab === "settings" ? "bg-white/10 text-white font-medium" : "text-white/40 hover:text-white hover:bg-white/5"}`}
          >
            <Settings className="w-4 h-4" /> 
            <span className="text-sm">Ustawienia</span>
          </button>
        </nav>
        
        <div className="mt-auto pt-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-text flex items-center justify-center text-white text-xs font-serif shadow-xl">
              P
            </div>
            <div className="flex flex-col">
               <span className="text-xs text-white font-medium">Administrator</span>
               <span className="text-[10px] text-white/30">Podobesties</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/30 hover:text-red-400 hover:border-red-400/30 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>
      <main className={`flex-1 p-6 md:p-12 overflow-y-auto ${mobileMenuOpen ? 'hidden md:block' : ''}`}>
        <div className="max-w-[1200px] mx-auto">
          {activeTab === "dashboard" && <AdminDashboard />}
          {activeTab === "training" && <TrainingAdmin />}
          {activeTab === "gallery" && <GalleryAdmin />}
          {activeTab === "blog" && <BlogAdmin />}
                    {activeTab === "forms" && <FormsAdmin />}
          {activeTab === "settings" && <SettingsAdmin />}
        </div>
      </main>
    </div>
  );
}
