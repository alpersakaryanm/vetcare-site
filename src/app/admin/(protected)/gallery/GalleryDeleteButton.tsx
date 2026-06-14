"use client";

import { deleteGalleryItem } from "@/actions/gallery";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./gallery.module.css";

export default function GalleryDeleteButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (confirm("Bu resmi silmek istediğinize emin misiniz?")) {
      setIsDeleting(true);
      try {
        const result = await deleteGalleryItem(id);
        if (result && result.error) {
          alert(result.error);
        } else {
          router.refresh();
        }
      } catch (err) {
        alert("Beklenmeyen bir hata oluştu.");
      }
      setIsDeleting(false);
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
