import React from "react";
import { useGlobalSettings } from "../lib/useGlobalSettings";
import EditableSection from "./EditableSection";

export default function Footer() {
  const { settings } = useGlobalSettings();
  
  const insta = settings?.instagramUrl || "https://www.instagram.com/podobesties?igsh=NndiMG9rcHdweGg0";
  const fb = settings?.facebookUrl || "https://www.facebook.com/share/1Ji65Jpucg/?mibextid=wwXIfr";

  return (
    <footer className="w-full bg-brand-bg border-t border-brand-text/5 py-8 px-6 lg:px-16 text-center text-sm font-sans text-brand-text/40">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <EditableSection id="global" name="Stopka">
          <p>© {new Date().getFullYear()} PODOBESTIES. Wszelkie prawa zastrzeżone.</p>
        </EditableSection>
        <div className="flex gap-6 items-center">
          <EditableSection id="global" name="Social Media">
            <div className="flex gap-6">
              <a href={insta} target="_blank" rel="noopener noreferrer" className="hover:text-brand-text transition-colors">Instagram</a>
              <a href={fb} target="_blank" rel="noopener noreferrer" className="hover:text-brand-text transition-colors">Facebook</a>
            </div>
          </EditableSection>
          <a href="/admin" className="hover:text-brand-text transition-colors text-xs opacity-50 ml-2">Panel</a>
        </div>
      </div>
      <div className="mt-8 text-center text-xs text-brand-text/30 font-serif">
        Made by Jakub Bujak
      </div>
    </footer>
  );
}
