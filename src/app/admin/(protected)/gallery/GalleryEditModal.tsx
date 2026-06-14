"use client";

import { useState } from "react";
import { updateGalleryItem } from "@/actions/gallery";
import styles from "./gallery.module.css";

type GalleryItem = {
  id: string;
  image: string;
  title: string | null;
  category: string | null;
};

import { compressImageClientSide } from "@/lib/imageCompressor";

export default function GalleryEditModal({ item, existingCategories = [] }: { item: GalleryItem, existingCategories?: string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");

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
    
    const result = await updateGalleryItem(item.id, formData);
    
    if (result.error) {
      setMessage(result.error);
      setIsPending(false);
    } else {
      setMessage("Başarıyla güncellendi!");
      setIsPending(false);
      setTimeout(() => setIsOpen(false), 1000);
    }
  }

  return (
    <>
      <button className={styles.editBtn} onClick={() => setIsOpen(true)}>
        Düzenle
      </button>

      {isOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Resmi Düzenle</h3>
              <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.modalBody}>
              {message && (
                <div className={message.includes("hata") ? styles.errorMsg : styles.successMsg}>
                  {message}
                </div>
              )}

              <div className={styles.inputGroup}>
                <label htmlFor={`title-${item.id}`}>Başlık</label>
                <input type="text" id={`title-${item.id}`} name="title" defaultValue={item.title || ""} placeholder="Örn: Mutlu Hastamız" />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor={`category-${item.id}`}>Kategori (Seçin veya Yazın)</label>
                <input type="text" id={`category-${item.id}`} name="category" list="editCategoryList" defaultValue={item.category || "Kediler"} required />
                <datalist id="editCategoryList">
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
                <label htmlFor={`image-${item.id}`}>Yeni Fotoğraf (Değiştirmek isterseniz)</label>
                <input type="file" id={`image-${item.id}`} name="image" accept="image/*" />
                <small>Fotoğraf yüklemezseniz eski fotoğraf korunur.</small>
              </div>

              <button type="submit" disabled={isPending} className={styles.submitBtn}>
                {isPending ? "Güncelleniyor..." : "Kaydet"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
