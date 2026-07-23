import React, { useEffect, useState } from "react";
import { format } from "date-fns";

export default function AdminDashboard() {
  const [googleStatus, setGoogleStatus] = useState({ id: false, key: false });

  useEffect(() => {
    fetch("/api/system/status", {
      headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
    })
      .then(r => r.json())
      .then(data => {
        if(data && typeof data.googlePlaceId === 'boolean') {
          setGoogleStatus({ id: data.googlePlaceId, key: data.googleApiKey });
        }
      })
      .catch(console.error);
  }, []);

  const googleText = (googleStatus.id && googleStatus.key) ? "Aktywna" : (googleStatus.id ? "Brak klucza API" : "Brak podłączenia");
  const googleColor = (googleStatus.id && googleStatus.key) ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]" : "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]";

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="mb-10">
        <h1 className="text-4xl font-serif text-white tracking-tight mb-2">Dashboard</h1>
        <p className="text-white/50 font-sans text-sm font-light">Przegląd statusu serwisu PODOBESTIES</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Strona Główna", status: "Działa w chmurze", color: "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]" },
          { title: "Instagram", status: "Połączony (Link)", color: "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]" },
          { title: "Wizytówka Google", status: googleText, color: googleColor },
        ].map(item => (
          <div key={item.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex flex-col items-start gap-4">
            <h3 className="text-white/60 font-sans text-sm uppercase tracking-widest font-bold">{item.title}</h3>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${item.color}`}></span>
              <span className="text-white font-medium">{item.status}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between">
           <h3 className="text-white/60 font-sans text-sm uppercase tracking-widest font-bold mb-4">Ostatnie Logowanie</h3>
           <div className="text-xl font-medium text-white">{format(new Date(), "dd.MM.yyyy, HH:mm")}</div>
        </div>
      </div>
    </div>
  );
}
