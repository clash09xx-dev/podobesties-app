import { useState } from "react";

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const openWidget = (onSuccess: (url: string) => void) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg, image/png, image/webp";
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      setIsUploading(true);
      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`
          },
          body: formData
        });

        const data = await res.json();
        if (res.ok && data.url) {
          onSuccess(data.url);
        } else {
          alert("Błąd podczas przesyłania zdjęcia.");
        }
      } catch (err) {
        console.error(err);
        alert("Błąd połączenia.");
      } finally {
        setIsUploading(false);
      }
    };
    input.click();
  };

  return { openWidget, isReady: true, isUploading };
}
