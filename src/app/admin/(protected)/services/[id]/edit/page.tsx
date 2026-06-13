import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditServiceForm from "../../EditServiceForm";
import styles from "../../services.module.css";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const service = await prisma.service.findUnique({
    where: { id }
  });

  if (!service) {
    notFound();
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div style={{ marginBottom: "16px" }}>
          <Link href="/admin/services" style={{ color: "var(--primary-color)", fontWeight: "600", textDecoration: "none" }}>
            &larr; Hizmet Yönetimine Dön
          </Link>
        </div>
        <h1>Hizmet Düzenle: {service.title}</h1>
        <p>Hizmetin mevcut bilgilerini aşağıdan güncelleyebilirsiniz.</p>
      </div>

      <div className={styles.content} style={{ maxWidth: "600px", margin: "0 auto" }}>
        <EditServiceForm service={service} />
      </div>
    </div>
  );
}
