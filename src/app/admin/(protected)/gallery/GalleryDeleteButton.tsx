"use client";

import { deleteGalleryItem } from "@/actions/gallery";
import { useState } from "react";
import styles from "./gallery.module.css";

export default function GalleryDeleteButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (confirm("Bu resmi silmek istediğinize emin misiniz?")) {
      setIsDeleting(true);
      await deleteGalleryItem(id);
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
