import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import TeamGrid from "../TeamGrid";
import styles from "../team.module.css";

export const dynamic = "force-dynamic";

export default async function VeterinarianDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const vet = await prisma.veterinarian.findUnique({
    where: { id }
  });

  if (!vet) {
    notFound();
  }

  // Fetch up to 4 other active veterinarians to show at the bottom
  const otherVets = await prisma.veterinarian.findMany({
    where: { 
      active: true,
      NOT: { id: vet.id }
    },
    take: 4,
    orderBy: { createdAt: "asc" }
  });

  const placeholderImage = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop";

  return (
    <section className={styles.detailContainer} style={{ marginTop: '140px' }}>
      <div className="container">
        <div style={{ marginBottom: '24px' }}>
          <Link href="/team" style={{ color: 'var(--primary-color)', fontWeight: '600', textDecoration: 'none' }}>
            &larr; Ekibe Geri Dön
          </Link>
        </div>
        
        <div className={styles.detailHeader}>
          <span className={styles.detailNameBadge}>{vet.name}</span>
          <h1>Uzman Kadromuzla Tanışın</h1>
          <p>
            Kliniğimizde görev yapan veteriner hekimlerimizi yakından tanıyın. Her biri alanında deneyimli, sevgi dolu ve hayvan sağlığına gönülden bağlı ekibimizle dostlarınızın yanında olmaktan gurur duyuyoruz. Eğitim geçmişleri, uzmanlık alanları ve klinikteki görevleriyle ilgili tüm bilgilere bu alandan ulaşabilirsiniz.
          </p>
        </div>
        
        <div className={styles.detailLayout}>
          
          <div className={styles.detailSidebar}>
            <div className={styles.detailPhotoBox}>
              <Image 
                src={vet.photo || placeholderImage} 
                alt={vet.name} 
                fill 
                style={{ objectFit: 'cover', objectPosition: 'bottom' }}
                sizes="(max-width: 768px) 100vw, 400px"
                priority
              />
            </div>
            <Link href="/contact" className={styles.detailApptBtn}>
              Randevu Oluşturun
            </Link>
          </div>

          <div className={styles.detailInfoGrid}>
            
            <div className={`${styles.detailInfoBox} ${styles.halfWidth}`}>
              <span className={styles.boxLabel}>{vet.title || "Veteriner Hekim"}</span>
              <p className={styles.boxValue}>{vet.name}</p>
            </div>

            <div className={`${styles.detailInfoBox} ${styles.halfWidth}`}>
              <span className={styles.boxLabel}>Uzmanlık Alanı</span>
              <p className={styles.boxValue}>{vet.specialization || "Genel Veterinerlik"}</p>
            </div>

            <div className={`${styles.detailInfoBox} ${styles.wideWidth}`}>
              <span className={styles.boxLabel}>Mezun Olduğu Üniversite</span>
              <p className={styles.boxValue}>{vet.university || "Belirtilmemiş"}</p>
            </div>

            <div className={`${styles.detailInfoBox} ${styles.narrowWidth}`}>
              <span className={styles.boxLabel}>Mezuniyet Tarihi</span>
              <p className={styles.boxValue}>{vet.graduationYear || "Belirtilmemiş"}</p>
            </div>

            <div className={`${styles.detailInfoBox} ${styles.fullWidth}`}>
              <span className={styles.boxLabel}>Hakkında / Biyografi</span>
              {vet.biography ? (
                <p className={styles.boxText}>{vet.biography}</p>
              ) : (
                <p className={styles.boxText} style={{ fontStyle: 'italic', color: '#999' }}>Bu hekim için henüz detaylı biyografi eklenmemiş.</p>
              )}
            </div>

          </div>

        </div>

        {/* Other Veterinarians Section */}
        {otherVets.length > 0 && (
          <div style={{ marginTop: '80px', paddingTop: '60px', borderTop: '1px solid #e1e8ed' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '2rem', color: 'var(--text-color)', marginBottom: '12px' }}>Diğer Uzmanlarımız</h2>
              <p style={{ color: '#666' }}>Kliniğimizin diğer deneyimli veteriner hekimleri ile de tanışın.</p>
            </div>
            <TeamGrid veterinarians={otherVets} />
          </div>
        )}

      </div>
    </section>
  );
}
