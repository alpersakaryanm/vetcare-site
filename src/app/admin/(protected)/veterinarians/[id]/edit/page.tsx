import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditVeterinarianForm from "../../EditVeterinarianForm";
import styles from "../../veterinarians.module.css";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function EditVeterinarianPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const vet = await prisma.veterinarian.findUnique({
    where: { id }
  });

  if (!vet) {
    notFound();
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div style={{ marginBottom: "16px" }}>
          <Link href="/admin/veterinarians" style={{ color: "var(--primary-color)", fontWeight: "600", textDecoration: "none" }}>
            &larr; Ekip Yönetimine Dön
          </Link>
        </div>
        <h1>Ekip Üyesi Düzenle: {vet.name}</h1>
        <p>Ekip üyesinin mevcut bilgilerini aşağıdan güncelleyebilirsiniz.</p>
      </div>

      <div className={styles.content} style={{ maxWidth: "600px", margin: "0 auto" }}>
        <EditVeterinarianForm vet={vet} />
      </div>
    </div>
  );
}
