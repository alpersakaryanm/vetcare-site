import { prisma } from "@/lib/prisma";
import Link from "next/link";
import styles from "./services.module.css";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: { createdAt: "asc" },
  });

  const settings = await prisma.settings.findFirst();
  
  const defaultTitle = "Evcil Dostlarınız İçin Eksiksiz Veteriner Hizmetleri";
  const defaultDesc = "Kliniğimizde teşhisten tedaviye, cerrahi operasyonlardan düzenli bakıma kadar her aşamada evcil hayvanlarınızın sağlığını önceliklendiriyoruz. Uzman ekibimizle, onların ihtiyaçlarına özel kapsamlı ve güvenilir hizmetler sunuyoruz.";

  const pageTitle = settings?.services_page_title || defaultTitle;
  const pageDesc = settings?.services_page_desc || defaultDesc;

  return (
    <main style={{ width: '100%' }}>
      <section className={styles.heroGradient}>
        <div className="container">
          <h1 className={styles.heroTitle}>{pageTitle}</h1>
          <p style={{ maxWidth: '800px', margin: '20px auto 0', fontSize: '1.1rem', color: '#334155', opacity: 0.9 }}>
            {pageDesc}
          </p>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className="container">
          {services.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>Henüz Hizmet Eklenmemiş</h3>
              <p>Hizmetlerimiz çok yakında bu sayfada detaylı olarak listelenecektir.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {services.map((service) => (
                <Link href={`/services/${service.id}`} key={service.id} className={styles.card} style={{ textDecoration: 'none' }}>
                  <div className={styles.photoWrapper}>
                    {service.image ? (
                      <img src={service.image} alt={service.title} className={styles.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', backgroundColor: '#f4f7f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className={`${service.icon || "fa-solid fa-stethoscope"}`} style={{ fontSize: '4rem', color: '#94a3b8' }}></i>
                      </div>
                    )}
                    <div className={styles.hoverOverlay}>
                      <i className="fa-solid fa-arrow-right-to-bracket" style={{ fontSize: '2.5rem', marginBottom: '8px' }}></i>
                      <span style={{ fontWeight: '700', fontSize: '1.2rem', letterSpacing: '1px' }}>Hizmeti İncele</span>
                    </div>
                  </div>
                  <div className={styles.info}>
                    <h3 className={styles.name}>{service.title}</h3>
                    <span className={styles.clickHint}>Detaylar</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
