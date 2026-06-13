"use client";

import { useTransition } from "react";
import { deleteService } from "@/actions/services";
import styles from "./services.module.css";

export default function ServiceDeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Bu hizmeti silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) {
      startTransition(async () => {
        const result = await deleteService(id);
        if (result?.error) {
          alert(result.error);
        }
      });
    }
  };

  return (
    <button 
      onClick={handleDelete} 
      disabled={isPending}
      className={`${styles.actionBtn} ${styles.deleteBtn}`}
    >
      {isPending ? "Siliniyor..." : "Sil"}
    </button>
  );
}
