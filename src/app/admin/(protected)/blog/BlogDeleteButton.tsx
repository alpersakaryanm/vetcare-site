"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./blog.module.css";

export default function BlogDeleteButton({ id, title }: { id: string, title: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`"${title}" başlıklı yazıyı silmek istediğinize emin misiniz?`)) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Silme başarısız oldu.");
        setIsDeleting(false);
      }
    } catch (error) {
      console.error(error);
      alert("Bir hata oluştu.");
      setIsDeleting(false);
    }
  }

  return (
    <button 
      onClick={handleDelete} 
      disabled={isDeleting} 
      className={styles.deleteBtn}
    >
      {isDeleting ? "Siliniyor..." : "Sil"}
    </button>
  );
}
