"use client";

import { useState } from "react";
import { updateBlogPost } from "@/actions/blog";
import styles from "./blog.module.css";
import { compressImageClientSide } from "@/lib/imageCompressor";

type BlogPostItem = {
  id: string;
  title: string;
  content: string;
  category: string | null;
  author: string | null;
  cover_image: string | null;
};

export default function BlogEditModal({ item }: { item: BlogPostItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setMessage("");
    
    const formData = new FormData(e.currentTarget);
    const file = formData.get("cover_image") as File;
    
    if (file && file.size > 0) {
      const compressedFile = await compressImageClientSide(file);
      formData.set("cover_image", compressedFile);
    }
    
    const result = await updateBlogPost(item.id, formData);
    
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
        <div className={styles.modalOverlay} onClick={() => setIsOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Yazıyı Düzenle</h3>
              <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              {message && (
                <div className={message.includes("hata") ? styles.errorMsg : styles.successMsg}>
                  {message}
                </div>
              )}

              <div className={styles.inputGroup}>
                <label htmlFor={`title-${item.id}`}>Başlık *</label>
                <input type="text" id={`title-${item.id}`} name="title" defaultValue={item.title} required />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor={`category-${item.id}`}>Kategori</label>
                <input type="text" id={`category-${item.id}`} name="category" defaultValue={item.category || ""} />
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor={`author-${item.id}`}>Yazar</label>
                <input type="text" id={`author-${item.id}`} name="author" defaultValue={item.author || ""} />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor={`content-${item.id}`}>İçerik *</label>
                <textarea id={`content-${item.id}`} name="content" rows={8} defaultValue={item.content} required></textarea>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor={`cover_image-${item.id}`}>Yeni Kapak Görseli (Değiştirmek için)</label>
                <input type="file" id={`cover_image-${item.id}`} name="cover_image" accept="image/*" />
                <small>Fotoğraf yüklemezseniz eski fotoğraf korunur.</small>
              </div>

              {item.cover_image && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "10px", padding: "10px", background: "#fee2e2", borderRadius: "8px" }}>
                  <input type="checkbox" id={`remove_image_${item.id}`} name="remove_image" />
                  <label htmlFor={`remove_image_${item.id}`} style={{ color: "#991b1b", margin: 0, cursor: "pointer", fontWeight: "bold" }}>
                    Bu yazıya ait görseli kalıcı olarak sil
                  </label>
                </div>
              )}

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
