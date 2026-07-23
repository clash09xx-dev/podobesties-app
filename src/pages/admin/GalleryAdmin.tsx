import React, { useState, useEffect, useRef } from "react";
import { X, UploadCloud, Loader2, ImagePlus, Trash2 } from "lucide-react";
import { auth } from "../../lib/firebase";

interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  description?: string;
  orderIndex: number;
}

export default function GalleryAdmin() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileTitle, setFileTitle] = useState("");
  const [fileDescription, setFileDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const imagesRef = useRef(images);

  useEffect(() => {
    fetchGallery();
  }, []);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  const fetchGallery = async () => {
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      if (Array.isArray(data)) {
        setImages(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("caption", fileTitle);
      formData.append("description", fileDescription);
      
      let currentToken = localStorage.getItem("adminToken");
      if (auth.currentUser) {
        currentToken = await auth.currentUser.getIdToken();
        localStorage.setItem("adminToken", currentToken);
      }
      
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { Authorization: `Bearer ${currentToken}` },
        body: formData
      });
      if (res.ok) {
        await fetchGallery();
        setSelectedFile(null);
        setFileTitle("");
        setFileDescription("");
      } else {
        alert("Błąd podczas przesyłania.");
      }
    } catch(err) {
      console.error(err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setSelectedFile(e.target.files[0]);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (uploading) return;
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
    setSelectedFile(e.dataTransfer.files[0]);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Na pewno chcesz usunąć to zdjęcie?")) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      if (res.ok) {
        setImages(images.filter(img => img.id !== id));
      } else {
        alert("Błąd podczas usuwania");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleItemDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
    setTimeout(() => {
      const el = document.getElementById(`gallery-img-${id}`);
      if (el) el.style.opacity = '0.5';
    }, 0);
  };

  const handleItemDragEnter = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === id) return;
    setImages(prev => {
      const draggedIdx = prev.findIndex(img => img.id === draggedId);
      const targetIdx = prev.findIndex(img => img.id === id);
      if (draggedIdx === -1 || targetIdx === -1) return prev;
      const newImages = [...prev];
      const [removed] = newImages.splice(draggedIdx, 1);
      newImages.splice(targetIdx, 0, removed);
      return newImages;
    });
  };

  const handleItemDragEnd = (id: string) => {
    const el = document.getElementById(`gallery-img-${id}`);
    if (el) el.style.opacity = '1';
    if (draggedId) {
      handleReorder(imagesRef.current);
      setDraggedId(null);
    }
  };

  const handleReorder = async (newOrder: GalleryImage[]) => {
    setImages(newOrder);
    try {
      await fetch("/api/gallery/reorder", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({ items: newOrder }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="animate-in fade-in duration-700">
      <header className="mb-10">
        <h1 className="text-4xl font-serif text-white tracking-tight mb-2">Galeria</h1>
        <p className="text-white/50 font-sans text-sm font-light">Zarządzaj zdjęciami na stronie głównej</p>
      </header>

      {selectedFile ? (
        <div className="bg-[#111111] rounded-[32px] border border-white/5 p-8 mb-8 flex flex-col max-w-md mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white text-lg font-serif">Nowe zdjęcie</h3>
            <button onClick={() => setSelectedFile(null)} className="text-white/50 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="bg-black/20 p-4 rounded-xl mb-6 truncate text-sm text-white/70">
            {selectedFile.name}
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-white/50 text-xs uppercase tracking-widest font-bold mb-2 block">Tytuł zdjęcia</label>
              <input 
                type="text" 
                value={fileTitle}
                onChange={e => setFileTitle(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-white/30" 
                placeholder="Np. Gabinet podologiczny"
              />
            </div>
            <div>
              <label className="text-white/50 text-xs uppercase tracking-widest font-bold mb-2 block">Krótki opis</label>
              <textarea 
                value={fileDescription}
                onChange={e => setFileDescription(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-white/30" 
                rows={3}
                placeholder="Dodaj krótki opis zdjęcia..."
              ></textarea>
            </div>
            <button 
              onClick={handleFileUpload}
              disabled={uploading}
              className="w-full bg-white text-black font-medium py-3 rounded-xl mt-4 flex justify-center items-center gap-2 hover:bg-white/90 disabled:opacity-50"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Dodaj zdjęcie do galerii"}
            </button>
          </div>
        </div>
      ) : (
        <div 
          onClick={() => !uploading && fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
          onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); }}
          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); }}
          onDrop={(e) => { e.preventDefault(); e.stopPropagation(); onDrop(e); }}
          className={`bg-[#111111] rounded-[32px] border ${uploading ? 'border-brand-text/50' : 'border-white/5 cursor-pointer hover:bg-white/5'} p-8 text-center mb-8 border-dashed flex flex-col items-center justify-center min-h-[400px] transition-colors relative overflow-hidden`}
        >
           <input 
               type="file" 
               ref={fileInputRef} 
               className="hidden" 
               accept="image/jpeg, image/png, image/webp" 
               onChange={handleFileChange} 
           />
           <>
             <UploadCloud className="w-10 h-10 text-white/30 mb-4" />
             <p className="text-white/70 font-medium text-sm">Przeciągnij i upuść lub kliknij, aby wybrać zdjęcie</p>
             <p className="text-white/40 text-xs mt-2 mb-6">Dozwolone formaty: JPG, PNG, WEBP (max 5MB)</p>
             <div className="bg-white/5 px-4 py-2 rounded-full border border-white/10">
               <p className="text-white/60 text-xs font-medium">Zalecane proporcje: 3:2 (np. 1800x1200px) lub poziome</p>
             </div>
           </>
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="p-10 flex justify-center">
             <Loader2 className="w-8 h-8 text-white/20 animate-spin" />
          </div>
        ) : images.length === 0 ? (
          <div className="bg-[#111111] border border-white/5 border-dashed p-10 rounded-[24px] flex flex-col items-center justify-center text-center mt-4">
            <ImagePlus className="w-8 h-8 text-white/20 mb-3" />
            <p className="text-white/50 font-sans text-sm font-medium">Brak zdjęć w galerii</p>
            <p className="text-white/30 text-xs mt-2">Prześlij pliki korzystając z formularza powyżej.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map(img => (
              <div 
                key={img.id} 
                id={`gallery-img-${img.id}`}
                draggable
                onDragStart={(e) => handleItemDragStart(e, img.id)}
                onDragEnter={(e) => handleItemDragEnter(e, img.id)}
                onDragOver={(e) => e.preventDefault()}
                onDragEnd={() => handleItemDragEnd(img.id)}
                className={`group relative aspect-square bg-[#111111] rounded-2xl overflow-hidden border border-white/5 cursor-grab active:cursor-grabbing transition-all duration-300 ${draggedId === img.id ? 'scale-95 shadow-2xl z-10' : 'hover:scale-[1.02]'}`}
              >
                <img src={img.url} alt={img.caption} className={`w-full h-full object-cover transition-transform duration-500 pointer-events-none ${draggedId ? '' : 'group-hover:scale-105'}`} />
                <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 pointer-events-none ${draggedId ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`} />
                <div className="absolute bottom-4 left-4 right-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white font-serif text-lg leading-tight truncate drop-shadow-md">{img.caption}</p>
                </div>
                <button 
                  onDragStart={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onClick={(e) => { e.stopPropagation(); handleDelete(img.id); }}
                  className={`absolute top-4 right-4 w-10 h-10 bg-red-500/80 hover:bg-red-500 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all duration-300 cursor-pointer ${draggedId ? 'opacity-0 pointer-events-none' : 'opacity-0 group-hover:opacity-100'}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
