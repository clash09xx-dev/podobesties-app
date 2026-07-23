import { auth } from "../../lib/firebase";
import React, { useState, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2, ArrowLeft, Globe, EyeOff, CheckCircle2, Search, UploadCloud, Loader2 } from "lucide-react";
import { collection, onSnapshot, doc, setDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { db } from "../../lib/firebase";
import TinyMCEEditor from "../../components/admin/TinyMCEEditor";

interface Training {
  id: string;
  title: string;
  slug: string;
  description: string;
  program: string;
  image: string;
  status: 'published' | 'hidden';
  order: number;
}

const ImageUploader = ({ label, hint, value, onChange }: { label: string, hint?: string, value: string, onChange: (url: string) => void }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const compressedFile = await new Promise<File>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          const MAX_WIDTH = 1920;
          const MAX_HEIGHT = 1920;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            if (blob) resolve(new File([blob], file.name, { type: 'image/webp' }));
            else reject(new Error('Compression failed'));
          }, 'image/webp', 0.85);
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
      });

      const formData = new FormData();
      formData.append("image", compressedFile);
      
      let currentToken = localStorage.getItem("adminToken");
      if (auth.currentUser) {
        currentToken = await auth.currentUser.getIdToken();
        localStorage.setItem("adminToken", currentToken);
      }
      
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${currentToken}` },
        body: formData
      });
      const data = await res.json();
      onChange(data.url);
    } catch (err) {
      console.error(err);
      alert("Błąd podczas przesyłania zdjęcia");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-[#111111] p-6 rounded-2xl border border-white/5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-medium text-sm">{label}</h3>
          {hint && <p className="text-white/40 text-xs mt-1">{hint}</p>}
        </div>
      </div>
      
      {value ? (
        <div className="relative rounded-xl overflow-hidden group bg-black aspect-video border border-white/10">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                fileInputRef.current?.click();
              }}
              className="bg-white text-black px-4 py-2 rounded-full text-xs font-medium"
            >
              Zmień zdjęcie
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                onChange("");
              }}
              className="bg-red-500/20 text-red-400 px-4 py-2 rounded-full text-xs font-medium"
            >
              Usuń
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-white/20 hover:bg-white/[0.02] transition-colors aspect-video"
        >
          {uploading ? (
            <Loader2 className="w-8 h-8 text-white/50 animate-spin mb-4" />
          ) : (
            <UploadCloud className="w-8 h-8 text-white/50 mb-4" />
          )}
          <p className="text-white/50 text-sm font-medium">
            {uploading ? "Przesyłanie..." : "Kliknij, aby wgrać zdjęcie"}
          </p>
        </div>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
        }}
      />
    </div>
  );
};

export default function TrainingAdmin() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [editing, setEditing] = useState<Training | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const q = query(collection(db, "trainings"), orderBy("order", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      setTrainings(snap.docs.map(d => ({ id: d.id, ...d.data() } as Training)));
    });
    return unsub;
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    
    try {
      const slug = editing.slug || editing.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const id = editing.id || slug;
      const t = { ...editing, id, slug };
      await setDoc(doc(db, "trainings", id), t);
      setEditing(null);
    } catch (err) {
      console.error(err);
      alert("Wystąpił błąd podczas zapisywania");
    }
  };

  const handleDelete = async (id: string) => {
    if(confirm("Czy na pewno chcesz usunąć to szkolenie?")) {
      await deleteDoc(doc(db, "trainings", id));
    }
  };
  
  const moveItem = async (index: number, direction: 1 | -1) => {
    const newItems = [...trainings];
    const item = newItems[index];
    const swap = newItems[index + direction];
    
    if (!item || !swap) return;
    
    // Swap orders
    const itemOrder = item.order;
    item.order = swap.order;
    swap.order = itemOrder;
    
    newItems[index] = swap;
    newItems[index + direction] = item;
    
    setTrainings(newItems);
    
    // Save to DB
    await setDoc(doc(db, "trainings", item.id), { order: item.order }, { merge: true });
    await setDoc(doc(db, "trainings", swap.id), { order: swap.order }, { merge: true });
  };

  if (editing) {
    return (
      <div className="animate-in fade-in duration-700">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setEditing(null)}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-serif text-white tracking-tight">
                {editing.id ? 'Edytuj szkolenie' : 'Nowe szkolenie'}
              </h1>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setEditing({ ...editing, status: editing.status === 'published' ? 'hidden' : 'published' })}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${
                editing.status === 'published' 
                  ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/10' 
                  : 'border-amber-500/20 text-amber-400 bg-amber-500/10'
              }`}
            >
              {editing.status === 'published' ? <Globe className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              {editing.status === 'published' ? 'Opublikowane' : 'Ukryte'}
            </button>
            <button 
              onClick={handleSave}
              className="bg-white text-black px-6 py-2 rounded-full text-sm font-medium hover:bg-white/90 shadow-xl flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Zapisz zmiany
            </button>
          </div>
        </header>

        <form onSubmit={handleSave} className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#111111] p-8 rounded-3xl border border-white/5 space-y-6">
              <div>
                <label className="block text-white/50 text-xs font-medium uppercase tracking-wider mb-2">Tytuł szkolenia</label>
                <input 
                  required
                  type="text" 
                  value={editing.title}
                  onChange={e => setEditing({...editing, title: e.target.value})}
                  className="w-full bg-transparent border-b border-white/10 py-3 text-xl text-white outline-none focus:border-white/40 transition-colors"
                  placeholder="Np. Podstawowy Zabieg Podologiczny"
                />
              </div>
              
              <div>
                <label className="block text-white/50 text-xs font-medium uppercase tracking-wider mb-2">Opis krótki / Wprowadzenie (Markdown)</label>
                <textarea 
                  value={editing.description}
                  onChange={e => setEditing({...editing, description: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-xl p-4 text-white/80 outline-none focus:border-white/40 transition-colors resize-none h-32"
                  placeholder="Opis szkolenia w Markdown..."
                />
              </div>

              <div>
                <label className="block text-white/50 text-xs font-medium uppercase tracking-wider mb-2">Program szkolenia (Markdown)</label>
                <textarea 
                  value={editing.program}
                  onChange={e => setEditing({...editing, program: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-xl p-4 text-white/80 outline-none focus:border-white/40 transition-colors resize-none h-96"
                  placeholder="Program szkolenia w Markdown..."
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <ImageUploader 
              label="Zdjęcie wyróżniające"
              hint="Optymalny rozmiar: 1920x1080px (16:9)"
              value={editing.image}
              onChange={(url) => setEditing({...editing, image: url})}
            />
          </div>
        </form>
      </div>
    );
  }

  const filteredTrainings = trainings.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-700">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif text-white tracking-tight mb-2">Szkolenia</h1>
          <p className="text-white/50 font-sans text-sm font-light">Zarządzaj ofertą szkoleniową</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-white/30 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Szukaj szkolenia..."
              className="bg-[#111111] border border-white/10 text-white text-sm rounded-full pl-11 pr-6 py-2.5 outline-none focus:border-white/30 transition-colors w-64"
            />
          </div>
          <button 
            onClick={() => setEditing({
              id: "",
              title: "",
              slug: "",
              description: "",
              program: "",
              image: "",
              status: "published",
              order: trainings.length > 0 ? Math.max(...trainings.map(t => t.order || 0)) + 1 : 1
            })}
            className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-medium hover:bg-white/90 shadow-xl flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Dodaj szkolenie
          </button>
        </div>
      </header>
      
      {trainings.length === 0 ? (
        <div className="bg-[#111111] border border-white/5 border-dashed p-16 rounded-[32px] flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <Plus className="w-8 h-8 text-white/30" />
          </div>
          <p className="text-white font-serif text-xl mb-2">Brak szkoleń</p>
          <p className="text-white/40 text-sm max-w-sm">Dodaj pierwsze szkolenie, aby zaczęło wyświetlać się na stronie.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTrainings.map((t, i) => (
            <div key={t.id} className="bg-[#111111] border border-white/5 rounded-2xl p-4 flex items-center gap-6 group hover:border-white/10 transition-colors">
              <div className="w-24 h-16 rounded-lg bg-black overflow-hidden flex-shrink-0 border border-white/5">
                {t.image ? (
                  <img src={t.image} alt={t.title} className="w-full h-full object-cover opacity-80" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white/5">
                    <Globe className="w-6 h-6 text-white/20" />
                  </div>
                )}
              </div>
              
              <div className="flex-grow min-w-0">
                <h3 className="text-white font-medium text-lg truncate mb-1">{t.title}</h3>
                <div className="flex items-center gap-4 text-xs text-white/40">
                  <span className={`px-2 py-0.5 rounded-full ${
                    t.status === 'published' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {t.status === 'published' ? 'Opublikowane' : 'Ukryte'}
                  </span>
                  <span>Kolejność: {t.order}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => moveItem(i, -1)}
                  disabled={i === 0}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 transition-colors disabled:opacity-30"
                >
                  ↑
                </button>
                <button 
                  onClick={() => moveItem(i, 1)}
                  disabled={i === filteredTrainings.length - 1}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 transition-colors disabled:opacity-30"
                >
                  ↓
                </button>
                <button 
                  onClick={() => setEditing(t)}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(t.id)}
                  className="w-10 h-10 rounded-full bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
