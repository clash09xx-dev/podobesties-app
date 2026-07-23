import React, { createContext, useContext, useState } from "react";

export const EditModeContext = createContext<{
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  onEditSection: (section: string) => void;
}>({ isEditing: false, setIsEditing: () => {}, onEditSection: () => {} });

export const useEditMode = () => useContext(EditModeContext);

export const EditModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isEditing, setIsEditing] = useState(false);
  const onEditSection = (section: string) => {
    // Custom event to dispatch to admin container so we can open drawer
    const event = new CustomEvent('edit-section', { detail: section });
    window.dispatchEvent(event);
  };
  return (
    <EditModeContext.Provider value={{ isEditing, setIsEditing, onEditSection }}>
      {children}
    </EditModeContext.Provider>
  );
};

