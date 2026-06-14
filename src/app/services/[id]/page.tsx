import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../services.module.css";

export const dynamic = "force-dynamic";

export default async function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const service = await prisma.service.findUnique({
    where: { id }
  });

  if (!service) {
    notFound();
  }

  // Fetch other active services to show at the bottom
  const otherServices = await prisma.service.findMany({
    where: { 
      active: true,
      NOT: { id: service.id }
    },
    take: 8,
    orderBy: { createdAt: "asc" }
  });

  return (
    <section className={styles.servicesSection} style={{ marginTop: '140px', paddingBottom: '80px' }}>
      <div className="container">
        
        <div style={{ marginBottom: '40px' }}>
          <Link href="/services" style={{ color: 'var(--primary-color)', fontWeight: '600', textDecoration: 'none' }}>
            &larr; Tüm Hizmetlere Dön
          </Link>
        </div>

        <div className={styles.serviceRow} style={{ marginTop: '0' }}>
          <div className={styles.serviceContent}>
            <h1 className={styles.serviceTitle} style={{ fontSize: '3rem', marginBottom: '30px' }}>{service.title}</h1>
            
            <div className={styles.serviceImageWrapper}>
              {service.image ? (
                <Image 
                  src={service.image} 
                  alt={service.title} 
                  fill 
                  className={styles.serviceImage}
                  sizes="(max-width: 900px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className={`${service.icon || "fa-solid fa-stethoscope"}`} style={{ fontSize: '6rem', color: '#cbd5e1' }}></i>
                </div>
              )}
            </div>

            <div className={styles.serviceDescription} style={{ fontSize: '1.15rem', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
              {service.description}
            </div>
            {service.price && (
              <div className={styles.servicePrice} style={{ fontSize: '1.4rem', marginTop: '30px', padding: '12px 24px' }}>
                {service.price} ₺
              </div>
            )}
          </div>
        </div>

        {/* Other Services Section */}
        {otherServices.length > 0 && (
          <div style={{ marginTop: '100px', paddingTop: '60px', borderTop: '1px solid #e1e8ed' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '2rem', color: 'var(--text-color)', marginBottom: '12px' }}>Diğer Hizmetlerimiz</h2>
              <p style={{ color: '#666' }}>Kliniğimizde sunduğumuz diğer hizmetlere de göz atın.</p>
            </div>
            
            <div className={styles.indexGrid}>
              {otherServices.map((other) => (
                <Link href={`/services/${other.id}`} key={other.id} className={styles.indexCard}>
                  <div className={styles.iconWrapper}>
                    <i className={`${other.icon || "fa-solid fa-stethoscope"} ${styles.indexCardIcon}`} style={{ fontSize: '1.4rem' }}></i>
                  </div>
                  <h3 className={styles.indexCardTitle}>{other.title}</h3>
                  <div className={styles.hoverOverlay}>
                    <i className="fa-solid fa-arrow-right-to-bracket" style={{ fontSize: '1.6rem', marginBottom: '4px' }}></i>
                    <span style={{ fontWeight: '700', fontSize: '0.9rem', letterSpacing: '0.5px' }}>İncele</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
