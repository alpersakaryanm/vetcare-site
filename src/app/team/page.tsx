import { prisma } from "@/lib/prisma";
import TeamGrid from "./TeamGrid";
import styles from "./team.module.css";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const veterinarians = await prisma.veterinarian.findMany({
    where: { active: true },
    orderBy: { createdAt: "asc" }
  });

  return (
    <section className={styles.teamSection}>
      <div className="container">
        <div className={styles.header}>
          <span style={{ 
            display: 'inline-block', 
            backgroundColor: 'var(--secondary-color)', 
            color: 'white', 
            padding: '6px 20px', 
            borderRadius: '999px', 
            fontSize: '0.9rem', 
            fontWeight: '600',
            marginBottom: '16px' 
          }}>
            Uzman Kadromuz
          </span>
          <h1 style={{ color: 'var(--text-color)' }}>
            Hekim Seçimi ve <span style={{ color: 'var(--secondary-color)' }}>Randevu Oluşturma</span>
          </h1>
          <p>
            Evcil dostlarınızın sağlık ihtiyaçlarına en uygun uzman hekimi seçerek, kolayca randevunuzu alabilirsiniz. 
            Kliniğimizdeki deneyimli hekimlerimiz, her durumda en iyi bakım ve tedavi hizmetini sunmak için hazır.
          </p>
        </div>

        {veterinarians.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>Uzman Ekibimiz Hazırlanıyor</h3>
            <p>Veteriner hekimlerimizin profilleri çok yakında eklenecektir.</p>
          </div>
        ) : (
          <TeamGrid veterinarians={veterinarians} />
        )}
      </div>
    </section>
  );
}
