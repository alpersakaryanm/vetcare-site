"use client";

import { useState } from "react";
import { deleteTestimonial } from "@/actions/testimonials";
import styles from "./testimonials.module.css";

export default function TestimonialDeleteButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (confirm("Bu yorumu silmek istediğinize emin misiniz?")) {
      setIsDeleting(true);
      await deleteTestimonial(id);
      setIsDeleting(false);
    }
  }

  return (
    <button 
      onClick={handleDelete} 
      disabled={isDeleting}
      className={styles.deleteBtn}
    >
      {isDeleting ? "Siliniyor..." : "Sil"}
    </button>
  );
}
