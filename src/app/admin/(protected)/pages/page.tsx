import { prisma } from "@/lib/prisma";
import ContactForm from "./ContactForm";
import styles from "../services/services.module.css";

export const dynamic = "force-dynamic";

export default async function AdminPagesPage() {
  const settings = await prisma.settings.findFirst();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>İletişim Sayfası Yönetimi</h1>
        <p>İletişim sayfasında ve sitenizin alt kısmında (footer) yer alan adres, telefon, e-posta ve sosyal medya bilgilerinizi buradan yönetebilirsiniz.</p>
      </div>

      <div className={styles.content} style={{ display: 'block' }}>
        <ContactForm initialSettings={settings} />
      </div>
    </div>
  );
}
