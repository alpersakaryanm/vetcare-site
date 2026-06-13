import { prisma } from "@/lib/prisma";
import SettingsForm from "./SettingsForm";
import styles from "../services/services.module.css";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await prisma.settings.findFirst();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Ayarlar Yönetimi</h1>
        <p>Sitenizin genel ayarlarını ve sabit metinlerini bu bölümden yönetebilirsiniz.</p>
      </div>

      <div className={styles.content} style={{ display: 'block' }}>
        <SettingsForm initialSettings={settings} />
      </div>
    </div>
  );
}
