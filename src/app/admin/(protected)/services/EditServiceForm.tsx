"use client";

import { useState } from "react";
import { updateService } from "@/actions/services";
import styles from "./services.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Service = {
  id: string;
  title: string;
  description: string;
  image: string | null;
  icon: string | null;
  price: number | null;
};

export default function EditServiceForm({ service }: { service: Service }) {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setMessage("");
    
    const result = await updateService(service.id, formData);
    
    if (result.error) {
      setMessage(result.error);
    } else {
      setMessage("Hizmet başarıyla güncellendi! Yönetim sayfasına dönülüyor...");
      setTimeout(() => {
        router.push("/admin/services");
      }, 1500);
    }
    
    setIsPending(false);
  }

  return (
    <form action={handleSubmit} className={styles.formCard}>
      <h3>Hizmeti Düzenle</h3>
      
      {message && (
        <div className={message.includes("hata") ? styles.errorMsg : styles.successMsg}>
          {message}
        </div>
      )}

      {service.image && (
        <div style={{ marginBottom: "16px" }}>
          <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "8px" }}>Mevcut Görsel</p>
          <div style={{ position: "relative", width: "120px", height: "80px", borderRadius: "8px", overflow: "hidden" }}>
            <Image src={service.image} alt={service.title} fill style={{ objectFit: "cover" }} />
          </div>
        </div>
      )}

      <div className={styles.inputGroup}>
        <label htmlFor="image">Yeni Görsel (Değiştirmek istemiyorsanız boş bırakın)</label>
        <input type="file" id="image" name="image" accept="image/*" />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="title">Hizmet Adı *</label>
        <input type="text" id="title" name="title" required defaultValue={service.title} />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="price">Fiyat Bilgisi (Opsiyonel)</label>
        <input type="number" step="0.01" id="price" name="price" defaultValue={service.price || ""} />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="icon">İkon Adı</label>
        <input type="text" id="icon" name="icon" defaultValue={service.icon || ""} />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="description">Hizmet Açıklaması *</label>
        <textarea id="description" name="description" required rows={5} defaultValue={service.description}></textarea>
      </div>

      <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
        <button type="button" onClick={() => router.push("/admin/services")} className={styles.submitBtn} style={{ backgroundColor: "#6c757d", flex: 1 }}>
          İptal
        </button>
        <button type="submit" disabled={isPending} className={styles.submitBtn} style={{ flex: 1 }}>
          {isPending ? "Güncelleniyor..." : "Değişiklikleri Kaydet"}
        </button>
      </div>
    </form>
  );
}
