import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

export function useGlobalSettings() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "global"), (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      } else {
        setSettings({
          navLinks: [
            { name: "Usługi", href: "/#services" },
            { name: "Szkolenia", href: "/szkolenia" },
            { name: "Blog", href: "/blog" },
            { name: "Sklep", href: "/sklep" },
            { name: "Opinie", href: "/#reviews" },
            { name: "Kontakt", href: "/#contact" },
          ],
          bookingText: "Umów wizytę"
        });
      }
      setLoading(false);
    }, (err) => { console.error("onSnapshot error:", err); setLoading(false); });

    return () => unsub();
  }, []);

  return { settings, loading };
}
