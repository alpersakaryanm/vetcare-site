"use client";

import { useState, startTransition } from "react";
import { useRouter } from "next/navigation";
import styles from "./gallery.module.css";

export default function GalleryDeleteButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  function handleDelete() {
    if (confirm("Bu resmi silmek istediğinize emin misiniz?")) {
      setIsDeleting(true);
      startTransition(async () => {
        try {
          const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
          const result = await res.json();
          
          if (!res.ok || result.error) {
            alert(result.error || "Silme işlemi başarısız oldu.");
          } else {
            router.refresh();
          }
        } catch (err: any) {
          console.error("Silme Hatası:", err);
          alert("Bağlantı hatası: " + (err.message || "Lütfen internet bağlantınızı kontrol edin."));
        } finally {
          setIsDeleting(false);
        }
      });
    }
  }

  return (
    <button 
      onClick={handleDelete} 
      disabled={isDeleting}
      className={styles.deleteBtn}
    >
      {isDeleting ? "..." : "Sil"}
    </button>
  );
}
