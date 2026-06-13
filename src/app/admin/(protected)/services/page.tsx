import { prisma } from "@/lib/prisma";
import Image from "next/image";
import ServiceForm from "./ServiceForm";
import ServiceDeleteButton from "./ServiceDeleteButton";
import Link from "next/link";
import styles from "./services.module.css";

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Hizmet Yönetimi</h1>
        <p>Kliniğinizin sunduğu tüm hizmetleri buradan ekleyebilir ve yönetebilirsiniz.</p>
      </div>

      <div className={styles.content}>
        <div className={styles.formSection}>
          <ServiceForm />
        </div>
        
        <div className={styles.mainGrid}>
          {services.length === 0 ? (
            <div className={styles.emptyState}>Henüz hiçbir hizmet eklenmemiş.</div>
          ) : (
            <div className={styles.grid}>
              {services.map((service) => (
                <div key={service.id} className={styles.card}>
                  {service.image ? (
                    <div className={styles.imageWrapper}>
                      <Image 
                        src={service.image} 
                        alt={service.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className={styles.imageWrapper} style={{ backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: '#94a3b8', fontSize: '2rem' }}>
                        {service.icon ? <i className={service.icon}></i> : <i className="fa-solid fa-stethoscope"></i>}
                      </span>
                    </div>
                  )}
                  
                  <div className={styles.info}>
                    <h3 className={styles.name}>{service.title}</h3>
                    {service.price && (
                      <span className={styles.price}>{service.price} ₺</span>
                    )}
                    <p className={styles.biography}>{service.description.substring(0, 100)}...</p>
                  
                    <div className={styles.cardActions} style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                      <Link 
                        href={`/admin/services/${service.id}/edit`} 
                        style={{ 
                          flex: 1, 
                          textAlign: 'center', 
                          backgroundColor: 'var(--primary-color)', 
                          color: 'white', 
                          padding: '8px', 
                          borderRadius: 'var(--radius-sm)', 
                          textDecoration: 'none',
                          fontWeight: '600',
                          fontSize: '0.9rem'
                        }}
                      >
                        Düzenle
                      </Link>
                      <div style={{ flex: 1 }}>
                        <ServiceDeleteButton id={service.id} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
