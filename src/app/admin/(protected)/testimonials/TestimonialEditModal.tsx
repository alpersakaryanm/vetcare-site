"use client";

import { useState } from "react";
import { updateTestimonial } from "@/actions/testimonials";
import styles from "./testimonials.module.css";

type TestimonialItem = {
  id: string;
  owner_name: string;
  pet_name: string | null;
  comment: string;
  rating: number;
};

export default function TestimonialEditModal({ item }: { item: TestimonialItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    await updateTestimonial(item.id, formData);
    setIsPending(false);
    setIsOpen(false);
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
              <h3>Yorumu Düzenle</h3>
              <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>&times;</button>
            </div>
            
            <form action={handleSubmit}>
              <div className={styles.formGroup}>
                <label>İsim</label>
                <input type="text" name="owner_name" defaultValue={item.owner_name} required />
              </div>

              <div className={styles.formGroup}>
                <label>Evcil Hayvan</label>
                <input type="text" name="pet_name" defaultValue={item.pet_name || ""} />
              </div>

              <div className={styles.formGroup}>
                <label>Puan (1-5)</label>
                <input type="number" name="rating" min="1" max="5" defaultValue={item.rating} required />
              </div>

              <div className={styles.formGroup}>
                <label>Yorum</label>
                <textarea name="comment" rows={5} defaultValue={item.comment} required></textarea>
              </div>

              {item.photo && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "10px", padding: "10px", background: "#fee2e2", borderRadius: "8px" }}>
                  <input type="checkbox" id={`remove_photo_${item.id}`} name="remove_photo" />
                  <label htmlFor={`remove_photo_${item.id}`} style={{ color: "#991b1b", margin: 0, cursor: "pointer", fontWeight: "bold" }}>
                    Bu yoruma ait fotoğrafı kalıcı olarak sil
                  </label>
                </div>
              )}

              <button type="submit" disabled={isPending} className={styles.submitBtn}>
                {isPending ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
