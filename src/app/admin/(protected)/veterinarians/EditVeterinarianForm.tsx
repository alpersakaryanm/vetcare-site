"use client";

import { useRef, useState } from "react";
import { updateVeterinarian } from "@/actions/veterinarians";
import styles from "./veterinarians.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Veterinarian = {
  id: string;
  name: string;
  title: string;
  specialization: string | null;
  university: string | null;
  graduationYear: string | null;
  biography: string | null;
  photo: string | null;
};

export default function EditVeterinarianForm({ vet }: { vet: Veterinarian }) {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setMessage("");
    
    const result = await updateVeterinarian(vet.id, formData);
    
    if (result.error) {
      setMessage(result.error);
    } else {
      setMessage("Ekip üyesi başarıyla güncellendi! Yönetim sayfasına dönülüyor...");
      setTimeout(() => {
        router.push("/admin/veterinarians");
      }, 1500);
    }
    
    setIsPending(false);
  }

  return (
    <form action={handleSubmit} className={styles.formCard}>
      <h3>Ekip Üyesini Düzenle</h3>
      
      {message && (
        <div className={message.includes("hata") ? styles.errorMsg : styles.successMsg}>
          {message}
        </div>
      )}

      {vet.photo && (
        <div style={{ marginBottom: "16px" }}>
          <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "8px" }}>Mevcut Fotoğraf</p>
          <div style={{ position: "relative", width: "100px", height: "100px", borderRadius: "8px", overflow: "hidden" }}>
            <Image src={vet.photo} alt={vet.name} fill style={{ objectFit: "cover" }} />
          </div>
        </div>
      )}

      <div className={styles.inputGroup}>
        <label htmlFor="photo">Yeni Fotoğraf (Değiştirmek istemiyorsanız boş bırakın)</label>
        <input type="file" id="photo" name="photo" accept="image/*" />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="name">İsim Soyisim *</label>
        <input type="text" id="name" name="name" required defaultValue={vet.name} />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="title">Ünvan *</label>
        <input type="text" id="title" name="title" required placeholder="Örn: Veteriner Hekim" defaultValue={vet.title} />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="specialization">Uzmanlık Alanı</label>
        <input type="text" id="specialization" name="specialization" placeholder="Örn: Cerrahi" defaultValue={vet.specialization || ""} />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="university">Mezun Olduğu Okul</label>
        <input type="text" id="university" name="university" placeholder="Örn: Ankara Üniversitesi Veteriner Fakültesi" defaultValue={vet.university || ""} />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="graduationYear">Mezuniyet Tarihi</label>
        <input type="text" id="graduationYear" name="graduationYear" placeholder="Örn: 2015" defaultValue={vet.graduationYear || ""} />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="biography">Biyografi / Hakkında</label>
        <textarea id="biography" name="biography" rows={5} defaultValue={vet.biography || ""}></textarea>
      </div>

      <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
        <button type="button" onClick={() => router.push("/admin/veterinarians")} className={styles.submitBtn} style={{ backgroundColor: "#6c757d", flex: 1 }}>
          İptal
        </button>
        <button type="submit" disabled={isPending} className={styles.submitBtn} style={{ flex: 1 }}>
          {isPending ? "Güncelleniyor..." : "Değişiklikleri Kaydet"}
        </button>
      </div>
    </form>
  );
}
