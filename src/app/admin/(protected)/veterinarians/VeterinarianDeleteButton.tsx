"use client";

import { useTransition } from "react";
import { deleteVeterinarian } from "@/actions/veterinarians";
import styles from "./veterinarians.module.css";

export default function VeterinarianDeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (confirm("Bu hekimi silmek istediğinize emin misiniz?")) {
      startTransition(async () => {
        await deleteVeterinarian(id);
      });
    }
  }

  return (
    <button 
      onClick={handleDelete} 
      disabled={isPending} 
      className={styles.deleteBtn}
    >
      {isPending ? "Siliniyor..." : "Sil"}
    </button>
  );
}
