"use client";

import { useState } from "react";
import { updateSettings } from "@/actions/settings";
import styles from "../services/services.module.css"; // Reuse the forms CSS

type Settings = {
  id: string;
  clinic_name: string;
  services_page_title: string | null;
  services_page_desc: string | null;
  about_title: string | null;
  about_content: string | null;
  about_mission: string | null;
  about_vision: string | null;
  about_image: string | null;
  gallery_page_title?: string | null;
  gallery_page_desc?: string | null;
} | null;

export default function SettingsForm({ initialSettings }: { initialSettings: Settings }) {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setMessage("");
    
    const result = await updateSettings(initialSettings?.id || null, formData);
    
    if (result.error) {
      setMessage(result.error);
    } else {
      setMessage("Ayarlar başarıyla güncellendi!");
    }
    
    setIsPending(false);
  }

  return (
    <form action={handleSubmit} className={styles.formCard} style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
      <h3>Genel Ayarlar</h3>
      
      {message && (
        <div className={message.includes("hata") ? styles.errorMsg : styles.successMsg}>
          {message}
        </div>
      )}

      <div className={styles.inputGroup}>
        <label htmlFor="clinic_name">Klinik Adı *</label>
        <input 
          type="text" 
          id="clinic_name" 
          name="clinic_name" 
          required 
          defaultValue={initialSettings?.clinic_name || "Veterinary Clinic"} 
        />
      </div>

      <h3 style={{ marginTop: '30px' }}>Hizmetler Sayfası Ayarları</h3>
      <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '16px' }}>Hizmetlerimiz sayfasının en üstünde yer alan karşılama yazılarını buradan değiştirebilirsiniz.</p>

      <div className={styles.inputGroup}>
        <label htmlFor="services_page_title">Hizmetler Başlığı</label>
        <input 
          type="text" 
          id="services_page_title" 
          name="services_page_title" 
          placeholder="Örn: Evcil Dostlarınız İçin Eksiksiz Veteriner Hizmetleri" 
          defaultValue={initialSettings?.services_page_title || ""} 
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="services_page_desc">Hizmetler Açıklaması</label>
        <textarea 
          id="services_page_desc" 
          name="services_page_desc" 
          rows={5} 
          placeholder="Hizmetlerinizi genel olarak anlatan bir giriş metni..."
          defaultValue={initialSettings?.services_page_desc || ""} 
        ></textarea>
      </div>

      <h3 style={{ marginTop: '40px' }}>Hakkımızda Sayfası Ayarları</h3>
      <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '16px' }}>Sitenizin "Hakkımızda" bölümünde yer alan hikayenizi, misyon ve vizyonunuzu buradan güncelleyebilirsiniz.</p>

      {initialSettings?.about_image && (
        <div style={{ marginBottom: "16px" }}>
          <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "8px" }}>Mevcut Hakkımızda Görseli</p>
          <div style={{ position: "relative", width: "150px", height: "100px", borderRadius: "8px", overflow: "hidden" }}>
            <img src={initialSettings.about_image} alt="Hakkımızda" style={{ width: '100%', height: '100%', objectFit: "cover" }} />
          </div>
        </div>
      )}

      <div className={styles.inputGroup}>
        <label htmlFor="about_image">Sayfa Görseli (Değiştirmek istemiyorsanız boş bırakın)</label>
        <input type="file" id="about_image" name="about_image" accept="image/*" />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="about_title">Ana Başlık</label>
        <input 
          type="text" 
          id="about_title" 
          name="about_title" 
          placeholder="Örn: Kliniğimizin Hikayesi" 
          defaultValue={initialSettings?.about_title || ""} 
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="about_content">Hakkımızda / Hikayeniz (Detaylı Anlatım)</label>
        <textarea 
          id="about_content" 
          name="about_content" 
          rows={8} 
          placeholder="Kliniğinizin ne zaman kurulduğu, temel amacı vs..."
          defaultValue={initialSettings?.about_content || ""} 
        ></textarea>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="about_mission">Misyonumuz</label>
        <textarea 
          id="about_mission" 
          name="about_mission" 
          rows={4} 
          defaultValue={initialSettings?.about_mission || ""} 
        ></textarea>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="about_vision">Vizyonumuz</label>
        <textarea 
          id="about_vision" 
          name="about_vision" 
          rows={4} 
          defaultValue={initialSettings?.about_vision || ""} 
        ></textarea>
      </div>

      <h3 style={{ marginTop: '40px' }}>Galeri Sayfası Ayarları</h3>
      <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '16px' }}>Galeri sayfasının en üstünde yer alan başlık ve açıklamayı buradan güncelleyebilirsiniz.</p>

      <div className={styles.inputGroup}>
        <label htmlFor="gallery_page_title">Galeri Başlığı</label>
        <input 
          type="text" 
          id="gallery_page_title" 
          name="gallery_page_title" 
          placeholder="Örn: Kliniğimizden Kareler" 
          defaultValue={initialSettings?.gallery_page_title || ""} 
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="gallery_page_desc">Galeri Açıklaması</label>
        <textarea 
          id="gallery_page_desc" 
          name="gallery_page_desc" 
          rows={4} 
          placeholder="Galeri sayfasını anlatan bir açıklama metni..."
          defaultValue={initialSettings?.gallery_page_desc || ""} 
        ></textarea>
      </div>

      <button type="submit" disabled={isPending} className={styles.submitBtn} style={{ marginTop: '20px' }}>
        {isPending ? "Kaydediliyor..." : "Ayarları Kaydet"}
      </button>
    </form>
  );
}
