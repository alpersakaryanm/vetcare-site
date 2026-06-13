"use client";

import { useRef, useState } from "react";
import { addService } from "@/actions/services";
import styles from "./services.module.css";

export default function ServiceForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setMessage("");
    
    const result = await addService(formData);
    
    if (result.error) {
      setMessage(result.error);
    } else {
      setMessage("Hizmet başarıyla eklendi!");
      formRef.current?.reset();
    }
    
    setIsPending(false);
  }

  return (
    <form ref={formRef} action={handleSubmit} className={styles.formCard}>
      <h3>Yeni Hizmet Ekle</h3>
      
      {message && (
        <div className={message.includes("hata") ? styles.errorMsg : styles.successMsg}>
          {message}
        </div>
      )}

      <div className={styles.inputGroup}>
        <label htmlFor="title">Hizmet Adı *</label>
        <input type="text" id="title" name="title" required placeholder="Örn: Cerrahi Müdahaleler" />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="price">Fiyat Bilgisi (Opsiyonel)</label>
        <input type="number" step="0.01" id="price" name="price" placeholder="Örn: 500" />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="icon">İkon Adı (FontAwesome veya Lucide)</label>
        <input type="text" id="icon" name="icon" placeholder="Örn: fa-solid fa-stethoscope" />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="description">Hizmet Açıklaması *</label>
        <textarea id="description" name="description" required rows={4} placeholder="Bu hizmet hakkında detaylı bilgi..."></textarea>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="image">Hizmet Görseli (Opsiyonel)</label>
        <input type="file" id="image" name="image" accept="image/*" />
      </div>

      <button type="submit" disabled={isPending} className={styles.submitBtn}>
        {isPending ? "Ekleniyor..." : "Hizmeti Kaydet"}
      </button>
    </form>
  );
}
