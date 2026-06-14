"use client";

import { useRef, useState } from "react";
import { addBlogPost } from "@/actions/blog";
import styles from "./blog.module.css";
import { compressImageClientSide } from "@/lib/imageCompressor";

export default function BlogForm() {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

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
    
    const result = await addBlogPost(formData);
    
    if (result.error) {
      setMessage(result.error);
    } else {
      setMessage("Blog yazısı başarıyla eklendi!");
      formRef.current?.reset();
    }
    
    setIsPending(false);
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className={styles.formCard}>
      <h3>Yeni Blog Yazısı Ekle</h3>
      
      {message && (
        <div className={message.includes("hata") ? styles.errorMsg : styles.successMsg}>
          {message}
        </div>
      )}

      <div className={styles.inputGroup}>
        <label htmlFor="title">Başlık *</label>
        <input type="text" id="title" name="title" required placeholder="Örn: Kedilerde Beslenme Alışkanlıkları" />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="category">Kategori</label>
        <input type="text" id="category" name="category" placeholder="Örn: Kedi Bakımı, Köpek Eğitimi..." />
      </div>
      
      <div className={styles.inputGroup}>
        <label htmlFor="author">Yazar</label>
        <input type="text" id="author" name="author" placeholder="Örn: Vet. Hekim Ali Yılmaz" />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="content">İçerik *</label>
        <textarea id="content" name="content" rows={8} required placeholder="Blog yazınızın içeriği..."></textarea>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="cover_image">Kapak Görseli</label>
        <input type="file" id="cover_image" name="cover_image" accept="image/*" />
      </div>

      <button type="submit" disabled={isPending} className={styles.submitBtn}>
        {isPending ? "Ekleniyor..." : "Yazıyı Yayınla"}
      </button>
    </form>
  );
}
