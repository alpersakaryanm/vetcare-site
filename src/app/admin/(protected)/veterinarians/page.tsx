import { prisma } from "@/lib/prisma";
import Image from "next/image";
import VeterinarianForm from "./VeterinarianForm";
import VeterinarianDeleteButton from "./VeterinarianDeleteButton";
import Link from "next/link";
import styles from "./veterinarians.module.css";

export default async function AdminVeterinariansPage() {
  const veterinarians = await prisma.veterinarian.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Ekip Yönetimi</h1>
        <p>Kliniğinizdeki uzman kadronuzu ve ekip üyelerinizi buradan yönetebilirsiniz.</p>
      </div>

      <div className={styles.content}>
        <div className={styles.sidebar}>
          <VeterinarianForm />
        </div>
        
        <div className={styles.mainGrid}>
          {veterinarians.length === 0 ? (
            <div className={styles.emptyState}>Henüz ekip üyesi eklenmemiş.</div>
          ) : (
            <div className={styles.grid}>
              {veterinarians.map((vet) => (
                <div key={vet.id} className={styles.card}>
                  <div className={styles.photoWrapper}>
                    {vet.photo ? (
                      <Image 
                        src={vet.photo} 
                        alt={vet.name} 
                        fill 
                        className={styles.photo}
                        sizes="(max-width: 768px) 100vw, 300px"
                      />
                    ) : (
                      <span>Fotoğraf Yok</span>
                    )}
                  </div>
                  <div className={styles.info}>
                    <h4>{vet.name}</h4>
                    <span className={styles.title}>{vet.title}</span>
                    {vet.specialization && (
                      <span className={styles.specialization}>{vet.specialization}</span>
                    )}
                    {vet.biography && <p className={styles.biography}>{vet.biography.substring(0, 100)}...</p>}
                  
                  <div className={styles.cardActions} style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                    <Link 
                      href={`/admin/veterinarians/${vet.id}/edit`} 
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
                      <VeterinarianDeleteButton id={vet.id} />
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
