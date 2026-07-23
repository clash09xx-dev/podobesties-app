import React from "react";
import { useEditMode } from "../context/EditModeContext";
import { Pencil } from "lucide-react";

export default function EditableSection({ id, name, children }: { id: string; name: string; children: React.ReactNode }) {
  const { isEditing, onEditSection } = useEditMode();

  if (!isEditing) {
    return <>{children}</>;
  }

  return (
    <div 
      className="relative group/edit outline outline-0 hover:outline-2 outline-brand-text/50 transition-all cursor-pointer"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onEditSection(id);
      }}
    >
      <div className="pointer-events-none">
        {children}
      </div>
      <div className="absolute inset-0 bg-brand-text/5 opacity-0 group-hover/edit:opacity-100 transition-opacity z-40 pointer-events-none"></div>
      <div className="absolute top-4 left-4 z-50 opacity-0 group-hover/edit:opacity-100 bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-full font-sans text-sm font-medium flex items-center gap-2 transform -translate-y-2 group-hover/edit:translate-y-0 transition-all shadow-xl pointer-events-none">
        <Pencil className="w-4 h-4" /> Edytuj {name}
      </div>
    </div>
  );
}
