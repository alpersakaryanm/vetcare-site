"use client";

import { useRef, useState } from "react";
import { addGalleryItem } from "@/actions/gallery";
import styles from "./gallery.module.css";

import { compressImageClientSide } from "@/lib/imageCompressor";

export default function GalleryForm({ existingCategories = [] }: { existingCategories?: string[] }) {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setMessage("");
    
    const formData = new FormData(e.currentTarget);
    const file = formData.get("image") as File;
    
    if (file && file.size > 0) {
      const compressedFile = await compressImageClientSide(file);
      formData.set("image", compressedFile);
    }
    
    const result = await addGalleryItem(formData);
    
    if (result.error) {
      setMessage(result.error);
    } else {
      setMessage("Resim başarıyla eklendi!");
      formRef.current?.reset();
    }
    
    setIsPending(false);
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className={styles.formCard}>
      <h3>Yeni Fotoğraf Ekle</h3>
      
      {message && (
        <div className={message.includes("hata") ? styles.errorMsg : styles.successMsg}>
          {message}
        </div>
      )}

      <div className={styles.inputGroup}>
        <label htmlFor="title">Başlık (Opsiyonel)</label>
        <input type="text" id="title" name="title" placeholder="Örn: Mutlu Hastamız" />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="category">Kategori (Seçin veya Yazın)</label>
        <input type="text" id="category" name="category" list="categoryList" required placeholder="Örn: Kediler, Köpekler..." />
        <datalist id="categoryList">
          <option value="Kediler" />
          <option value="Köpekler" />
          <option value="Kuşlar" />
          <option value="Tavşanlar" />
          <option value="Klinik" />
          {existingCategories
            .filter(cat => !["Kediler", "Köpekler", "Kuşlar", "Tavşanlar", "Klinik"].includes(cat))
            .map(cat => (
              <option key={cat} value={cat} />
          ))}
        </datalist>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="image">Fotoğraf</label>
        <input type="file" id="image" name="image" accept="image/*" required />
      </div>

      <button type="submit" disabled={isPending} className={styles.submitBtn}>
        {isPending ? "Yükleniyor..." : "Galeriye Ekle"}
      </button>
    </form>
  );
}
