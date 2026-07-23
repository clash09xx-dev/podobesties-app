import { auth } from "../../lib/firebase";
import React, { useState, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2, ArrowLeft, Globe, AlertCircle, CheckCircle2, FileText, Search, UploadCloud, Loader2, ExternalLink } from "lucide-react";
import { collection, onSnapshot, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import TinyMCEEditor from "../../components/admin/TinyMCEEditor";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  shortDesc: string;
  contentHtml: string;
  author: string;
  publishDate: string;
  thumbnail: string;
  headerImage: string;
  status: 'draft' | 'published';
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
          if (!ctx) {
            resolve(file);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() }));
            } else {
              resolve(file);
            }
          }, 'image/jpeg', 0.8);
        };
        img.onerror = () => resolve(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
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
      if (res.ok && data.url) {
        onChange(data.url);
      } else {
        alert("Błąd: " + (data.error || "Nie udało się przesłać zdjęcia."));
      }
    } catch (error) {
      console.error(error);
      alert("Błąd: " + (error.message || error));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (uploading) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await handleFileUpload(file); // allow all files to try uploading, server/canvas will handle rejection
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col"><label className="text-white/50 text-xs uppercase tracking-widest font-bold">{label}</label>{hint && <span className="text-[10px] text-white/40 mt-1">{hint}</span>}</div>
      <div 
        onClick={() => !uploading && fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onDrop={onDrop}
        className={`bg-[#1A1A1A] border ${uploading ? 'border-brand-text/50' : 'border-white/10 hover:border-white/30 cursor-pointer'} rounded-xl p-4 min-h-[160px] flex flex-col items-center justify-center transition-all relative overflow-hidden`}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/jpeg, image/png, image/webp" 
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFileUpload(e.target.files[0]);
            }
          }}
        />
        {uploading ? (
          <div className="flex flex-col items-center justify-center w-full h-full p-4">
            <Loader2 className="w-8 h-8 text-white/50 animate-spin mb-2" />
            <p className="text-xs text-white/50">Przesyłanie...</p>
          </div>
        ) : value ? (
          <div className="absolute inset-0 w-full h-full p-2 flex items-center justify-center">
            <img src={value} alt="Preview" className="w-full h-full object-contain rounded-lg" />
            <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
              <span className="text-sm font-medium text-white bg-black/80 px-4 py-2 rounded-full">Zmień zdjęcie</span>
            </div>
          </div>
        ) : (
          <div className="text-center p-4">
            <UploadCloud className="w-8 h-8 text-white/20 mx-auto mb-2" />
            <p className="text-sm text-white/60">Kliknij lub przeciągnij zdjęcie</p>
          </div>
        )}
      </div>
      {value && (
        <button onClick={() => onChange("")} className="text-xs text-red-400 hover:text-red-300">Usuń zdjęcie</button>
      )}
    </div>
  );
};

export default function BlogAdmin() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  
  const [saveStatus, setSaveStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "blog_posts"), (snapshot) => {
      const loaded = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as BlogPost[];
      loaded.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
      setPosts(loaded);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleCreate = () => {
    setEditingPost({
      id: Date.now().toString(),
      title: "",
      slug: "",
      shortDesc: "",
      contentHtml: "",
      author: "Podobesties",
      publishDate: new Date().toISOString().split('T')[0],
      thumbnail: "",
      headerImage: "",
      status: "draft"
    });
    setSaveStatus("idle");
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleSave = async (status: 'draft' | 'published') => {
    if (!editingPost) return;
    if (!editingPost.title) {
      setSaveStatus("error");
      setMessage("Tytuł jest wymagany.");
      return;
    }

    setSaveStatus("loading");
    try {
      const slug = editingPost.slug || generateSlug(editingPost.title);
      // Auto-fallback headerImage to thumbnail if not set
      const headerImage = editingPost.headerImage || editingPost.thumbnail;
      const postToSave = { ...editingPost, slug, status, headerImage };
      
      await setDoc(doc(db, "blog_posts", postToSave.id), postToSave);
      
      setSaveStatus("success");
      setMessage(status === 'published' ? "Wpis opublikowany!" : "Szkic zapisany.");
      setEditingPost(postToSave);
      
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err: any) {
      setSaveStatus("error");
      setMessage(err.message || "Błąd zapisu.");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Na pewno usunąć ten wpis? Ta operacja jest nieodwracalna.")) {
      try {
        await deleteDoc(doc(db, "blog_posts", id));
      } catch (err) {
        alert("Błąd podczas usuwania.");
      }
    }
  };

  const filteredPosts = posts.filter(post => {
    if (statusFilter !== "all" && post.status !== statusFilter) return false;
    if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  if (editingPost) {
    return (
      <div className="animate-in fade-in duration-700 max-w-5xl">
        <header className="mb-8 flex items-center justify-between bg-[#111111] p-6 rounded-[24px] border border-white/5">
          <div className="flex items-center gap-4">
            <button onClick={() => setEditingPost(null)} className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-2xl font-serif text-white tracking-tight">{editingPost.id === editingPost.id && editingPost.title ? 'Edytuj wpis' : 'Nowy wpis'}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button disabled={saveStatus === 'loading'} onClick={() => handleSave('draft')} className="px-6 py-3 bg-[#1A1A1A] text-white border border-white/10 rounded-full font-medium hover:bg-white/5 transition-colors disabled:opacity-50 text-sm">
              Zapisz jako szkic
            </button>
            <button disabled={saveStatus === 'loading'} onClick={() => handleSave('published')} className="px-6 py-3 bg-brand-text text-white rounded-full font-medium hover:bg-black transition-colors flex items-center gap-2 disabled:opacity-50 text-sm">
              <Globe className="w-4 h-4" /> Opublikuj
            </button>
          </div>
        </header>

        {saveStatus !== "idle" && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm ${saveStatus === 'error' ? 'bg-red-500/10 text-red-400' : saveStatus === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-white/70'}`}>
            {saveStatus === 'error' ? <AlertCircle className="w-4 h-4" /> : saveStatus === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-4 h-4 border-2 border-white/50 border-t-transparent rounded-full animate-spin" />}
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#111111] border border-white/5 p-8 rounded-[32px] space-y-6">
              <div className="space-y-2">
                <label className="text-white/50 text-xs uppercase tracking-widest font-bold">Tytuł wpisu</label>
                <input 
                  type="text" 
                  value={editingPost.title} 
                  onChange={e => setEditingPost({ ...editingPost, title: e.target.value })} 
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl p-4 text-white font-serif text-xl focus:outline-none focus:border-brand-text" 
                  placeholder="Wprowadź chwytliwy tytuł..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-white/50 text-xs uppercase tracking-widest font-bold">Krótki opis (zajawka)</label>
                <textarea 
                  value={editingPost.shortDesc} 
                  onChange={e => setEditingPost({ ...editingPost, shortDesc: e.target.value })} 
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-brand-text" 
                  rows={3}
                  placeholder="Zachęć czytelników do przeczytania..."
                ></textarea>
              </div>

              <div className="pt-2">
                <label className="block text-sm text-white/50 mb-4 uppercase tracking-wider text-xs font-bold">Treść wpisu</label>
                <div className="text-black">
                  <TinyMCEEditor 
                    value={editingPost.contentHtml || ''}
                    onChange={content => setEditingPost({ ...editingPost, contentHtml: content })}
                    height={600}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#111111] border border-white/5 p-6 rounded-[32px] space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-white/50 text-xs uppercase tracking-widest font-bold">Autor</label>
                  <input type="text" value={editingPost.author} onChange={e => setEditingPost({ ...editingPost, author: e.target.value })} className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-text" />
                </div>
                <div className="space-y-2">
                  <label className="text-white/50 text-xs uppercase tracking-widest font-bold">Data publikacji</label>
                  <input type="date" value={editingPost.publishDate} onChange={e => setEditingPost({ ...editingPost, publishDate: e.target.value })} className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-text" />
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <ImageUploader 
                  label="Miniaturka wpisu (Lista wpisów)"
                  hint="Sugerowany rozmiar: 800x600px (proporcje 4:3)"
                  value={editingPost.thumbnail} 
                  onChange={url => setEditingPost({ ...editingPost, thumbnail: url })} 
                />
              </div>

              <div className="pt-4 border-t border-white/5">
                <ImageUploader 
                  label="Zdjęcie w nagłówku (Opcjonalnie)"
                  hint="Sugerowany rozmiar: 1920x1080px (proporcje 16:9)"
                  value={editingPost.headerImage} 
                  onChange={url => setEditingPost({ ...editingPost, headerImage: url })} 
                />
                <p className="text-[10px] text-white/40 mt-2">Zostaw puste, aby użyć miniaturki w nagłówku wpisu.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700 max-w-6xl mx-auto">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif text-white tracking-tight mb-2">Blog</h1>
          <p className="text-white/50 font-sans text-sm font-light">Zarządzaj wpisami na blogu</p>
        </div>
        <button onClick={handleCreate} className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full text-sm font-medium hover:bg-white/90 shadow-xl transition-all hover:scale-105 active:scale-95">
          <Plus className="w-4 h-4" /> Nowy wpis
        </button>
      </header>

      <div className="bg-[#111111] border border-white/5 rounded-[32px] overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row gap-4 justify-between items-center bg-white/5">
          <div className="flex gap-2 p-1 bg-black/40 rounded-full border border-white/10">
            {(['all', 'published', 'draft'] as const).map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${statusFilter === status ? 'bg-white text-black shadow-md' : 'text-white/60 hover:text-white'}`}
              >
                {status === 'all' ? 'Wszystkie' : status === 'published' ? 'Opublikowane' : 'Szkice'}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Szukaj wpisów..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-brand-text transition-colors"
            />
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredPosts.length === 0 ? (
           <div className="p-16 text-center">
              <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/50 text-lg">Brak wpisów pasujących do kryteriów.</p>
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-white/40 text-xs uppercase tracking-widest">
                  <th className="px-6 py-4 font-medium">Wpis</th>
                  <th className="px-6 py-4 font-medium">Data</th>
                  <th className="px-6 py-4 font-medium">Autor</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Akcje</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPosts.map(post => (
                  <tr key={post.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {post.thumbnail ? (
                          <img src={post.thumbnail} alt="" className="w-12 h-12 rounded-lg object-cover bg-black/50" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                            <FileText className="w-5 h-5 text-white/30" />
                          </div>
                        )}
                        <div>
                          <div className="font-serif text-white text-lg line-clamp-1">{post.title}</div>
                          <div className="text-white/40 text-xs font-sans line-clamp-1 max-w-xs">{post.shortDesc || 'Brak opisu'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/70 whitespace-nowrap">
                      {post.publishDate}
                    </td>
                    <td className="px-6 py-4 text-sm text-white/70 whitespace-nowrap">
                      {post.author}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${post.status === 'published' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-white/5 text-white/50 border-white/10'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${post.status === 'published' ? 'bg-green-400' : 'bg-white/40'}`} />
                        {post.status === 'published' ? 'Opublikowany' : 'Szkic'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <a 
                          href={`/blog/${post.slug || post.id}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
                          title="Podgląd wpisu na żywo"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button 
                          onClick={() => setEditingPost(post)} 
                          className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
                          title="Edytuj wpis"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(post.id)} 
                          className="p-2 bg-red-500/10 hover:bg-red-500 rounded-lg text-red-400 hover:text-white transition-colors"
                          title="Usuń wpis"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
