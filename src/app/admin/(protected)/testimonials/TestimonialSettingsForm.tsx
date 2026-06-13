"use client";

import { useState } from "react";
import { updateTestimonialSettings } from "@/actions/testimonials";
import styles from "./testimonials.module.css";

export default function TestimonialSettingsForm({ settings }: { settings: any }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const result = await updateTestimonialSettings(formData);

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: "Ayarlar başarıyla kaydedildi." });
      setTimeout(() => setMessage(null), 3000);
    }
    setLoading(false);
  }

  return (
    <div className={styles.settingsCard}>
      <h3>Yorum Gönderme Limitleri</h3>
      <p style={{ marginBottom: "1rem", color: "#64748b", fontSize: "0.9rem" }}>
        Kullanıcıların spam yapmasını engellemek için belirli bir sürede en fazla kaç yorum gönderebileceklerini ayarlayın.
      </p>
      
      {message && (
        <div style={{
          padding: "10px", 
          marginBottom: "15px", 
          borderRadius: "6px",
          backgroundColor: message.type === "success" ? "#dcfce7" : "#fee2e2",
          color: message.type === "success" ? "#166534" : "#991b1b"
        }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "1rem", alignItems: "flex-end", flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ fontSize: "0.9rem", fontWeight: 600 }}>Süre (Gün)</label>
          <input 
            type="number" 
            name="testimonial_limit_days" 
            defaultValue={settings?.testimonial_limit_days || 15}
            min="1"
            className={styles.inputField}
            style={{ width: "120px", padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
          />
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ fontSize: "0.9rem", fontWeight: 600 }}>Limit (Mesaj)</label>
          <input 
            type="number" 
            name="testimonial_limit_count" 
            defaultValue={settings?.testimonial_limit_count || 2}
            min="1"
            className={styles.inputField}
            style={{ width: "120px", padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{
            padding: "8px 16px",
            backgroundColor: "var(--secondary-color, #1a8cc4)",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 500,
            height: "38px"
          }}
        >
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </form>
    </div>
  );
}
