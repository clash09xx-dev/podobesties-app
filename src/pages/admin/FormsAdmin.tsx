import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Search, Trash2, X } from "lucide-react";
import { auth } from "../../lib/firebase";

export default function FormsAdmin() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch("/api/inquiries", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) setInquiries(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInquiries();
  }, []);

  const deleteInquiry = async (id: string) => {
    if (!window.confirm("Usunąć to zapytanie?")) return;
    const token = localStorage.getItem("adminToken");
    await fetch(`/api/inquiries/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setInquiries(inquiries.filter(i => i.id !== id));
  };

  return (
    <div className="animate-in fade-in duration-700">
      <header className="mb-10">
        <h1 className="text-4xl font-serif text-white tracking-tight mb-2">Formularze kontaktowe</h1>
        <p className="text-white/50 font-sans text-sm font-light">Zapytania ze strony internetowej</p>
      </header>

      {loading ? (
        <div className="text-white/50">Ładowanie...</div>
      ) : (
        <div className="bg-[#111111] rounded-[32px] border border-white/5 overflow-hidden">
          <table className="w-full text-left text-sm text-white/70">
            <thead className="bg-[#1A1A1A] border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-medium text-white/50">Data</th>
                <th className="px-6 py-4 font-medium text-white/50">Osoba</th>
                <th className="px-6 py-4 font-medium text-white/50">Wiadomość</th>
                <th className="px-6 py-4 font-medium text-white/50 text-right">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {inquiries.map((inq) => (
                <tr key={inq.id} onClick={() => setSelectedInquiry(inq)} className="hover:bg-white/[0.02] cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">{format(new Date(inq.createdAt || new Date()), "dd.MM.yyyy HH:mm")}</td>
                  <td className="px-6 py-4 font-medium text-white/90">{inq.name} {inq.lastName} <br/><span className="text-xs text-white/40">{inq.email}</span><br/><span className="text-xs text-white/40">{inq.phone}</span></td>
                  <td className="px-6 py-4"><div className="text-xs max-w-sm truncate">{inq.topic} - {inq.message}</div></td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={(e) => { e.stopPropagation(); deleteInquiry(inq.id); }} className="text-white/30 hover:text-red-400 p-2"><Trash2 className="w-4 h-4 inline-block" /></button>
                  </td>
                </tr>
              ))}
              {inquiries.length === 0 && <tr><td colSpan={4} className="px-6 py-12 text-center text-white/30">Brak nowych zapytań</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => setSelectedInquiry(null)}>
          <div className="bg-[#111111] border border-white/10 rounded-[32px] p-8 max-w-lg w-full relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedInquiry(null)} className="absolute top-6 right-6 text-white/50 hover:text-white">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-serif text-white mb-6">Szczegóły zapytania</h2>
            
            <div className="space-y-4 font-sans text-sm text-white/70">
              <div>
                <span className="text-white/40 block text-xs uppercase tracking-widest mb-1">Data</span>
                <p className="text-white">{format(new Date(selectedInquiry.createdAt || new Date()), "dd.MM.yyyy HH:mm")}</p>
              </div>
              <div>
                <span className="text-white/40 block text-xs uppercase tracking-widest mb-1">Nadawca</span>
                <p className="text-white">{selectedInquiry.name} {selectedInquiry.lastName}</p>
              </div>
              <div>
                <span className="text-white/40 block text-xs uppercase tracking-widest mb-1">Kontakt</span>
                <p className="text-white">{selectedInquiry.email} | {selectedInquiry.phone}</p>
              </div>
              <div>
                <span className="text-white/40 block text-xs uppercase tracking-widest mb-1">Szkolenie</span>
                <p className="text-white font-medium">{selectedInquiry.topic}</p>
              </div>
              <div>
                <span className="text-white/40 block text-xs uppercase tracking-widest mb-1">Wiadomość</span>
                <div className="bg-white/5 p-4 rounded-xl mt-1 text-white whitespace-pre-wrap">
                  {selectedInquiry.message || "Brak wiadomości"}
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button onClick={() => { deleteInquiry(selectedInquiry.id); setSelectedInquiry(null); }} className="px-6 py-3 rounded-full bg-red-500/10 text-red-400 font-medium hover:bg-red-500/20 transition-colors">
                Usuń zapytanie
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
