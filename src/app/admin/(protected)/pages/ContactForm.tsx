"use client";

import { useState } from "react";
import { updateContactSettings } from "@/actions/settings";
import styles from "../services/services.module.css";

type Settings = {
  id: string;
  address: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  instagram_link: string | null;
  facebook_link: string | null;
  youtube_link: string | null;
} | null;

export default function ContactForm({ initialSettings }: { initialSettings: Settings }) {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setMessage("");
    
    const result = await updateContactSettings(initialSettings?.id || null, formData);
    
    if (result.error) {
      setMessage(result.error);
    } else {
      setMessage("İletişim ayarları başarıyla güncellendi!");
    }
    
    setIsPending(false);
  }

  return (
    <form action={handleSubmit} className={styles.formCard} style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h3>İletişim Bilgileri</h3>
      
      {message && (
        <div className={message.includes("hata") ? styles.errorMsg : styles.successMsg}>
          {message}
        </div>
      )}

      <div className={styles.inputGroup}>
        <label htmlFor="address">Açık Adres</label>
        <textarea 
          id="address" 
          name="address" 
          rows={3} 
          placeholder="Örn: Atatürk Mah. Vatan Cad. No:123 Kadıköy/İstanbul"
          defaultValue={initialSettings?.address || ""} 
        ></textarea>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="phone">Telefon Numarası</label>
        <input 
          type="text" 
          id="phone" 
          name="phone" 
          placeholder="Örn: +90 555 123 45 67" 
          defaultValue={initialSettings?.phone || ""} 
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="whatsapp">WhatsApp Numarası</label>
        <input 
          type="text" 
          id="whatsapp" 
          name="whatsapp" 
          placeholder="Örn: +90 555 123 45 67" 
          defaultValue={initialSettings?.whatsapp || ""} 
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="email">E-posta Adresi</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          placeholder="Örn: info@veteriner.com" 
          defaultValue={initialSettings?.email || ""} 
        />
      </div>

      <h3 style={{ marginTop: '30px' }}>Sosyal Medya Linkleri</h3>
      <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '15px' }}>
        Aşağıdaki alanlara yönlendirilmesini istediğiniz sosyal medya hesaplarınızın <b>tam web adresi (https://...)</b> linklerini giriniz. Girdiğiniz alanlar sitede ikon olarak görünecektir.
      </p>

      <div className={styles.inputGroup}>
        <label htmlFor="instagram_link"><i className="fa-brands fa-instagram"></i> Instagram Linki</label>
        <input 
          type="url" 
          id="instagram_link" 
          name="instagram_link" 
          placeholder="Örn: https://www.instagram.com/klinikadiniz"
          defaultValue={initialSettings?.instagram_link || ""} 
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="facebook_link"><i className="fa-brands fa-facebook"></i> Facebook Linki</label>
        <input 
          type="url" 
          id="facebook_link" 
          name="facebook_link" 
          placeholder="Örn: https://www.facebook.com/klinikadiniz"
          defaultValue={initialSettings?.facebook_link || ""} 
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="youtube_link"><i className="fa-brands fa-youtube"></i> YouTube Linki</label>
        <input 
          type="url" 
          id="youtube_link" 
          name="youtube_link" 
          placeholder="Örn: https://www.youtube.com/@kanaladiniz"
          defaultValue={initialSettings?.youtube_link || ""} 
        />
      </div>

      <button type="submit" disabled={isPending} className={styles.submitBtn} style={{ marginTop: '20px' }}>
        {isPending ? "Kaydediliyor..." : "İletişim Ayarlarını Kaydet"}
      </button>
    </form>
  );
}
