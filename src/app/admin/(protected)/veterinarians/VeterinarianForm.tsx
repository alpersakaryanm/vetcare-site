"use client";

import { useRef, useState } from "react";
import { addVeterinarian } from "@/actions/veterinarians";
import styles from "./veterinarians.module.css";

export default function VeterinarianForm() {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setMessage("");
    
    const result = await addVeterinarian(formData);
    
    if (result.error) {
      setMessage(result.error);
    } else {
      setMessage("Ekip üyesi başarıyla eklendi!");
      formRef.current?.reset();
    }
    
    setIsPending(false);
  }

  return (
    <form ref={formRef} action={handleSubmit} className={styles.formCard}>
      <h3>Yeni Ekip Üyesi Ekle</h3>
      
      {message && (
        <div className={message.includes("hata") ? styles.errorMsg : styles.successMsg}>
          {message}
        </div>
      )}

      <div className={styles.inputGroup}>
        <label htmlFor="name">Ad Soyad</label>
        <input type="text" id="name" name="name" required placeholder="Örn: Dr. Ayşe Yılmaz" />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="title">Ünvan</label>
        <input type="text" id="title" name="title" required placeholder="Örn: Başhekim / Uzman Veteriner" />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="specialization">Uzmanlık Alanı</label>
        <input type="text" id="specialization" name="specialization" placeholder="Örn: Cerrahi" />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="university">Mezun Olduğu Okul</label>
        <input type="text" id="university" name="university" placeholder="Örn: Ankara Üniversitesi Veteriner Fakültesi" />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="graduationYear">Mezuniyet Tarihi</label>
        <input type="text" id="graduationYear" name="graduationYear" placeholder="Örn: 2015" />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="biography">Biyografi / Hakkında</label>
        <textarea id="biography" name="biography" rows={4} placeholder="Hekim hakkında kısa bilgi..."></textarea>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="photo">Fotoğraf (Opsiyonel)</label>
        <input type="file" id="photo" name="photo" accept="image/*" />
      </div>

      <button type="submit" disabled={isPending} className={styles.submitBtn}>
        {isPending ? "Ekleniyor..." : "Ekip Üyesini Kaydet"}
      </button>
    </form>
  );
}
